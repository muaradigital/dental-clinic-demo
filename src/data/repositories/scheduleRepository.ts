import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { addDays, getWeekday, getWeekdayShort, now, parseTimeToMinutes, toISODate } from '@/lib/date'
import {
  deriveSlotStatus,
  effectiveBookedCount,
  generateSlotTimes,
  isDayClosed,
  type SlotInfo,
  type SlotStatus,
} from '@/lib/slots'
import { practiceHours } from '@/data/seed/practiceHours'
import { useDemoStore } from '@/store/useDemoStore'
import type { Appointment, Closure, DayHours, PracticeHours, SlotSettings, Weekday } from '@/types'

/**
 * Single source read by the homepage branch cards, the Reservasi slot
 * picker, and the dashboard — never duplicated per feature.
 */
export function getPracticeHours(branchId: string): PracticeHours | undefined {
  return practiceHours.find((p) => p.branchId === branchId)
}

export function getTodayHours(branchId: string, date: Date = now()): DayHours | undefined {
  const hours = getPracticeHours(branchId)
  const weekday = getWeekday(date)
  return hours?.days.find((d) => d.weekday === weekday)
}

export function isBranchOpenNow(branchId: string, date: Date = now()): boolean {
  const today = getTodayHours(branchId, date)
  if (!today || today.isClosed || !today.open || !today.close) return false
  const nowMinutes = date.getHours() * 60 + date.getMinutes()
  return nowMinutes >= parseTimeToMinutes(today.open) && nowMinutes < parseTimeToMinutes(today.close)
}

function getDayHoursForDate(branchId: string, date: string): DayHours | undefined {
  const hours = getPracticeHours(branchId)
  const weekday = getWeekday(new Date(`${date}T00:00:00`)) as Weekday
  return hours?.days.find((d) => d.weekday === weekday)
}

function isDateClosedByClosure(branchId: string, date: string, closures: Closure[]): boolean {
  return closures.some((c) => c.branchId === branchId && date >= c.startDate && date <= c.endDate)
}

/** Whether a branch is closed on `date` at all — either a weekly off-day or a one-off closure. */
export function isDateClosedForBranch(branchId: string, date: string): boolean {
  const day = getDayHoursForDate(branchId, date)
  return isDayClosed(day) || isDateClosedByClosure(branchId, date, useDemoStore.getState().closures)
}

/** How many real appointments occupy each time slot on this branch/date. */
function countBookingsByTime(appointments: Appointment[], branchId: string, date: string): Map<string, number> {
  const counts = new Map<string, number>()
  for (const a of appointments) {
    if (a.branchId !== branchId || a.date !== date) continue
    counts.set(a.timeSlot, (counts.get(a.timeSlot) ?? 0) + 1)
  }
  return counts
}

/**
 * Quota-aware: a slot is "penuh" once real bookings (or, lacking any, the
 * deterministic baseline — see lib/slots.ts) reach the branch's
 * `defaultQuotaPerSlot`, not merely when at least one booking exists.
 */
function computeAvailableSlots(branchId: string, date: string, realCounts: Map<string, number>, closures: Closure[]): SlotInfo[] {
  const day = getDayHoursForDate(branchId, date)
  if (isDayClosed(day) || isDateClosedByClosure(branchId, date, closures)) return []
  const settings = getSlotSettings(branchId)
  const quota = settings?.defaultQuotaPerSlot ?? 3
  const times = generateSlotTimes(day!, settings?.slotDurationMinutes)
  return times.map((time) => {
    const filled = effectiveBookedCount(realCounts.get(time) ?? 0, branchId, date, time, quota)
    const status = deriveSlotStatus(filled, quota, false)
    // The public booking page only distinguishes tersedia/penuh (per the
    // reference's 3-item legend) — fold "hampir_penuh" into "tersedia" here;
    // the dashboard's week grid (below) is where the 4-state legend lives.
    return { time, status: status === 'penuh' ? 'penuh' : 'tersedia' }
  })
}

/** Non-reactive read — for one-off reads outside React render (e.g. a repository consumer that isn't a component). */
export function getAvailableSlots(branchId: string, date: string): SlotInfo[] {
  const { appointments, closures } = useDemoStore.getState()
  return computeAvailableSlots(branchId, date, countBookingsByTime(appointments, branchId, date), closures)
}

/**
 * Reactive slot list — re-renders when a session booking lands in the store,
 * so a just-submitted reservation immediately shows that slot as full.
 */
export function useAvailableSlots(branchId: string | null, date: string | null): SlotInfo[] {
  const relevantAppointments = useDemoStore(
    useShallow((s) => (branchId && date ? s.appointments.filter((a) => a.branchId === branchId && a.date === date) : [])),
  )
  const closures = useDemoStore(useShallow((s) => s.closures))
  return useMemo(() => {
    if (!branchId || !date) return []
    return computeAvailableSlots(branchId, date, countBookingsByTime(relevantAppointments, branchId, date), closures)
  }, [branchId, date, relevantAppointments, closures])
}

/** The branch's standard (Mon–Fri) hours, e.g. "09.00 – 20.00" — a general label, not today's specific hours. */
export function getWeekdayHoursLabel(branchId: string): string {
  const hours = getPracticeHours(branchId)
  const monday = hours?.days.find((d) => d.weekday === 1)
  if (!monday || monday.isClosed || !monday.open || !monday.close) return ''
  return `${monday.open} – ${monday.close}`
}

export function useIsDateClosedForBranch(branchId: string | null, date: string | null): boolean {
  const closures = useDemoStore(useShallow((s) => s.closures))
  if (!branchId || !date) return true
  const day = getDayHoursForDate(branchId, date)
  return isDayClosed(day) || isDateClosedByClosure(branchId, date, closures)
}

export interface WeekSlotCell {
  date: string
  time: string
  status: SlotStatus
  filled: number
  quota: number
}

export interface WeekSlotDay {
  date: string
  weekday: Weekday
  label: string // "Sen 26"
  isClosed: boolean
  closureName?: string
  cellsByTime: Map<string, WeekSlotCell>
}

export interface WeekSlotGrid {
  branchId: string
  weekStartDate: string
  /** Union of every time slot open on any day this week, sorted — the grid's row headers. */
  times: string[]
  days: WeekSlotDay[]
}

/**
 * The week grid behind the Jadwal & slot screen: 7 day-columns × every hourly
 * slot open that week, each cell's fill count/status derived from real store
 * data (never mock numbers). Monday-start week, matching the reference.
 */
export function getWeekSlotGrid(branchId: string, weekStartDate: string): WeekSlotGrid {
  const { appointments, closures } = useDemoStore.getState()
  const settings = getSlotSettings(branchId)
  const quota = settings?.defaultQuotaPerSlot ?? 3
  const weekStart = new Date(`${weekStartDate}T00:00:00`)

  const days: WeekSlotDay[] = []
  const timeSet = new Set<string>()

  for (let i = 0; i < 7; i++) {
    const dateObj = addDays(weekStart, i)
    const date = toISODate(dateObj)
    const weekday = getWeekday(dateObj)
    const dayHours = getDayHoursForDate(branchId, date)
    const closure = closures.find((c) => c.branchId === branchId && date >= c.startDate && date <= c.endDate)
    const isClosed = isDayClosed(dayHours) || !!closure
    const cellsByTime = new Map<string, WeekSlotCell>()

    if (!isClosed && dayHours) {
      const bookedCounts = countBookingsByTime(appointments, branchId, date)
      for (const time of generateSlotTimes(dayHours, settings?.slotDurationMinutes)) {
        const filled = effectiveBookedCount(bookedCounts.get(time) ?? 0, branchId, date, time, quota)
        cellsByTime.set(time, { date, time, status: deriveSlotStatus(filled, quota, false), filled, quota })
        timeSet.add(time)
      }
    }

    days.push({
      date,
      weekday,
      label: `${getWeekdayShort(weekday)} ${dateObj.getDate()}`,
      isClosed,
      closureName: closure?.name,
      cellsByTime,
    })
  }

  return { branchId, weekStartDate, times: Array.from(timeSet).sort(), days }
}

/** Monday of the week containing `date` — the grid always starts on a Monday. */
export function getWeekStart(date: Date = now()): string {
  const weekday = getWeekday(date)
  const diffToMonday = weekday === 0 ? -6 : 1 - weekday
  return toISODate(addDays(date, diffToMonday))
}

/**
 * Reactive version of getWeekSlotGrid. The three subscriptions below are
 * what trigger a re-render on a new/changed booking, a quota edit, or a
 * closure — getWeekSlotGrid itself re-reads the store fresh via getState()
 * on every call, and the grid is small enough (a handful of days × hourly
 * slots) that recomputing on every render needs no memoization.
 */
export function useWeekSlotGrid(branchId: string | null, weekStartDate: string | null): WeekSlotGrid | null {
  useDemoStore(useShallow((s) => (branchId ? s.appointments.filter((a) => a.branchId === branchId) : [])))
  useDemoStore(useShallow((s) => (branchId ? s.closures.filter((c) => c.branchId === branchId) : [])))
  useDemoStore(useShallow((s) => (branchId ? s.slotSettings.find((ss) => ss.branchId === branchId) : undefined)))
  if (!branchId || !weekStartDate) return null
  return getWeekSlotGrid(branchId, weekStartDate)
}

export function getClosures(branchId: string): Closure[] {
  return useDemoStore.getState().closures.filter((c) => c.branchId === branchId)
}

export function addClosure(closure: Omit<Closure, 'id'>): void {
  useDemoStore.getState().addClosure(closure)
}

export function removeClosure(id: string): void {
  useDemoStore.getState().removeClosure(id)
}

export function getSlotSettings(branchId: string): SlotSettings | undefined {
  return useDemoStore.getState().slotSettings.find((s) => s.branchId === branchId)
}

export function updateSlotSettings(branchId: string, patch: Partial<Omit<SlotSettings, 'branchId'>>): void {
  useDemoStore.getState().updateSlotSettings(branchId, patch)
}

export function useClosures(branchId: string): Closure[] {
  return useDemoStore(useShallow((s) => s.closures.filter((c) => c.branchId === branchId)))
}
