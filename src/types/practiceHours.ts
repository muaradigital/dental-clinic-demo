/** 0 = Minggu (Sunday), 1 = Senin ... 6 = Sabtu */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface DayHours {
  weekday: Weekday
  isClosed: boolean
  open?: string // "09.00"
  close?: string // "20.00"
}

export interface PracticeHours {
  branchId: string
  days: DayHours[] // always 7 entries
}

export interface SlotSettings {
  branchId: string
  defaultQuotaPerSlot: number
  slotDurationMinutes: number
}

export interface Closure {
  id: string
  branchId: string
  name: string
  startDate: string
  endDate: string
}
