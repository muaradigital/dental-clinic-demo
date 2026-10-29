import type { Weekday } from '@/types'

const WEEKDAY_NAMES_SHORT = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
const WEEKDAY_NAMES_LONG = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
]
const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

/** "Hari ini" is always computed from the system clock, never hardcoded. */
export function now(): Date {
  return new Date()
}

export function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function getWeekday(date: Date): Weekday {
  return date.getDay() as Weekday
}

export function getWeekdayShort(weekday: Weekday): string {
  return WEEKDAY_NAMES_SHORT[weekday]
}

export function getWeekdayLong(weekday: Weekday): string {
  return WEEKDAY_NAMES_LONG[weekday]
}

export function formatLongDateID(date: Date): string {
  const weekday = WEEKDAY_NAMES_LONG[date.getDay()]
  const day = date.getDate()
  const month = MONTH_NAMES[date.getMonth()]
  const year = date.getFullYear()
  return `${weekday}, ${day} ${month} ${year}`
}

export function formatShortDateID(date: Date): string {
  const day = date.getDate()
  const month = MONTH_NAMES[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/** The 7-day rolling window the reservation date picker shows, starting today. */
export function getNext7Days(from: Date = now()): Date[] {
  return Array.from({ length: 7 }, (_, i) => addDays(from, i))
}

export function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split('.').map(Number)
  return h * 60 + m
}

export function formatMinutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}.${String(m).padStart(2, '0')}`
}
