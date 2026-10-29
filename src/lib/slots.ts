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
 * Deterministic "already full" pattern — a stable hash of branch/date/time,
 * not randomness, so the same slot is full on every reload. A demo stand-in
 * for real quota data, not a business rule.
 */
export function isDeterministicallyFull(branchId: string, date: string, time: string): boolean {
  return hashString(`${branchId}|${date}|${time}`) % 4 === 0
}

// TODO(Slice 5): week grid used by the Jadwal & slot dashboard screen.
export function getWeekSlotGrid(_branchId: string, _weekStartDate: string): unknown {
  return null
}
