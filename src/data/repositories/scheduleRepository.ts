import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { getWeekday, now, parseTimeToMinutes } from '@/lib/date'
import {
  generateSlotTimes,
  getWeekSlotGrid as computeWeekGrid,
  isDayClosed,
  isDeterministicallyFull,
  type SlotInfo,
} from '@/lib/slots'
import { practiceHours } from '@/data/seed/practiceHours'
import { useDemoStore } from '@/store/useDemoStore'
import type { Closure, DayHours, PracticeHours, SlotSettings, Weekday } from '@/types'

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

function computeAvailableSlots(branchId: string, date: string, bookedTimes: Set<string>, closures: Closure[]): SlotInfo[] {
  const day = getDayHoursForDate(branchId, date)
  if (isDayClosed(day) || isDateClosedByClosure(branchId, date, closures)) return []
  const settings = getSlotSettings(branchId)
  const times = generateSlotTimes(day!, settings?.slotDurationMinutes)
  return times.map((time) => ({
    time,
    status: bookedTimes.has(time) || isDeterministicallyFull(branchId, date, time) ? 'penuh' : 'tersedia',
  }))
}

/** Non-reactive read — for one-off reads outside React render (e.g. a repository consumer that isn't a component). */
export function getAvailableSlots(branchId: string, date: string): SlotInfo[] {
  const { appointments, closures } = useDemoStore.getState()
  const bookedTimes = new Set(
    appointments.filter((a) => a.branchId === branchId && a.date === date).map((a) => a.timeSlot),
  )
  return computeAvailableSlots(branchId, date, bookedTimes, closures)
}

/**
 * Reactive slot list — re-renders when a session booking lands in the store,
 * so a just-submitted reservation immediately shows that slot as full.
 */
export function useAvailableSlots(branchId: string | null, date: string | null): SlotInfo[] {
  const bookedTimes = useDemoStore(
    useShallow((s) =>
      branchId && date
        ? s.appointments.filter((a) => a.branchId === branchId && a.date === date).map((a) => a.timeSlot)
        : [],
    ),
  )
  const closures = useDemoStore(useShallow((s) => s.closures))
  return useMemo(() => {
    if (!branchId || !date) return []
    return computeAvailableSlots(branchId, date, new Set(bookedTimes), closures)
  }, [branchId, date, bookedTimes, closures])
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

export function getWeekSlotGrid(branchId: string, weekStartDate: string) {
  return computeWeekGrid(branchId, weekStartDate)
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
