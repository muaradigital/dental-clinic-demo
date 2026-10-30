import { formatMinutesToTime, parseTimeToMinutes } from '@/lib/date'
import { hashString } from '@/lib/hash'
import type { DayHours, Weekday } from '@/types'

export type SlotStatus = 'tersedia' | 'hampir_penuh' | 'penuh' | 'ditutup'

export interface SlotInfo {
  time: string
  status: SlotStatus
}

const DEFAULT_SLOT_DURATION_MINUTES = 60

export function isDayClosed(day: DayHours | undefined): boolean {
  return !day || day.isClosed || !day.open || !day.close
}

export function isWeekdayClosed(weekday: Weekday): boolean {
  return weekday === 0
}

/** Every slot time between a day's open/close hours, given a slot duration. */
export function generateSlotTimes(day: DayHours, durationMinutes = DEFAULT_SLOT_DURATION_MINUTES): string[] {
  if (isDayClosed(day)) return []
  const open = parseTimeToMinutes(day.open!)
  const close = parseTimeToMinutes(day.close!)
  const times: string[] = []
  for (let m = open; m < close; m += durationMinutes) {
    times.push(formatMinutesToTime(m))
  }
  return times
}

/**
 * Deterministic "baseline load" — a stable hash of branch/date/time, not
 * randomness, so the same slot looks the same on every reload. Models the
 * kind of booking activity that would exist on any other date without
 * needing seed `Appointment` rows for every date/branch/time combination.
 * A real appointment count always takes priority over this baseline (see
 * `effectiveBookedCount`) — this only fills in when there's no real data.
 */
export function getBaselineBookedCount(branchId: string, date: string, time: string, quota: number): number {
  if (quota <= 0) return 0
  const bucket = hashString(`${branchId}|${date}|${time}`) % 4
  if (bucket === 0) return quota // baseline: fully booked
  if (bucket === 1) return Math.max(quota - 1, 0) // baseline: one seat left
  return 0
}

/** The count that actually determines fullness: real bookings, or the baseline when there are none. */
export function effectiveBookedCount(realCount: number, branchId: string, date: string, time: string, quota: number): number {
  return Math.max(realCount, getBaselineBookedCount(branchId, date, time, quota))
}

/** Quota-aware status: full at >=quota, "almost full" with exactly one seat left (only meaningful when quota > 1). */
export function deriveSlotStatus(filled: number, quota: number, isClosed: boolean): SlotStatus {
  if (isClosed) return 'ditutup'
  if (quota <= 0 || filled >= quota) return 'penuh'
  if (quota > 1 && filled >= quota - 1) return 'hampir_penuh'
  return 'tersedia'
}
