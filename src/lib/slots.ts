import type { Weekday } from '@/types'

export type SlotStatus = 'tersedia' | 'hampir_penuh' | 'penuh' | 'ditutup'

export interface SlotInfo {
  time: string
  status: SlotStatus
}

// TODO(Slice 3): deterministic slot-fullness formula over practice hours +
// slot settings + closures, overlaid with this-session-created appointments
// so a just-submitted reservation also shows as full.
export function getAvailableSlots(_branchId: string, _date: string): SlotInfo[] {
  return []
}

// TODO(Slice 5): week grid used by the Jadwal & slot dashboard screen.
export function getWeekSlotGrid(_branchId: string, _weekStartDate: string): unknown {
  return null
}

export function isWeekdayClosed(weekday: Weekday): boolean {
  return weekday === 0
}
