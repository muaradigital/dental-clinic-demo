import type { Closure, PracticeHours, SlotSettings } from '@/types'

function weekdayHours(open: string, close: string, saturdayClose?: string): PracticeHours['days'] {
  return [
    { weekday: 0, isClosed: true }, // Minggu
    { weekday: 1, isClosed: false, open, close },
    { weekday: 2, isClosed: false, open, close },
    { weekday: 3, isClosed: false, open, close },
    { weekday: 4, isClosed: false, open, close },
    { weekday: 5, isClosed: false, open, close },
    { weekday: 6, isClosed: false, open, close: saturdayClose ?? close },
  ]
}

export const practiceHours: PracticeHours[] = [
  { branchId: 'branch-pusat-kota', days: weekdayHours('09.00', '20.00', '17.00') },
  { branchId: 'branch-timur', days: weekdayHours('09.00', '20.00', '17.00') },
  { branchId: 'branch-barat', days: weekdayHours('10.00', '19.00') },
]

export const slotSettings: SlotSettings[] = [
  { branchId: 'branch-pusat-kota', defaultQuotaPerSlot: 3, slotDurationMinutes: 60 },
  { branchId: 'branch-timur', defaultQuotaPerSlot: 3, slotDurationMinutes: 60 },
  { branchId: 'branch-barat', defaultQuotaPerSlot: 3, slotDurationMinutes: 60 },
]

export const closures: Closure[] = [
  {
    id: 'closure-rapat-internal',
    branchId: 'branch-pusat-kota',
    name: 'Rapat internal klinik',
    startDate: '2026-11-16',
    endDate: '2026-11-16',
  },
  {
    id: 'closure-natal',
    branchId: 'branch-pusat-kota',
    name: 'Natal',
    startDate: '2026-12-25',
    endDate: '2026-12-25',
  },
]
