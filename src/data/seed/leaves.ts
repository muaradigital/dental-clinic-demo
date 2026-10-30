import { addDays, getWeekday, now, toISODate } from '@/lib/date'
import type { LeaveRequest, Weekday } from '@/types'

function nextWeekdayOnOrAfter(from: Date, weekday: Weekday): Date {
  const diff = (weekday - getWeekday(from) + 7) % 7
  return addDays(from, diff)
}

// Mirrors the seeded appointments on Anindya's two sole-practitioner days
// this week — Monday at Pusat Kota, Wednesday at Timur — see
// data/seed/appointments.ts.
const nextMonday = nextWeekdayOnOrAfter(now(), 1)
const leaveStart = toISODate(nextMonday)
const leaveEnd = toISODate(addDays(nextMonday, 2))

/** Populated with realistic sample rows in Slice 5 (Dokter & cuti). */
export const leaves: LeaveRequest[] = [
  {
    id: 'leave-anindya-sample',
    doctorId: 'doc-anindya',
    startDate: leaveStart,
    endDate: leaveEnd,
    note: 'Acara keluarga di luar kota',
    status: 'disetujui',
    createdAt: toISODate(now()),
  },
  {
    id: 'leave-bayu-sample',
    doctorId: 'doc-bayu',
    startDate: toISODate(addDays(nextMonday, 7)),
    endDate: toISODate(addDays(nextMonday, 8)),
    note: 'Pelatihan ortodonti',
    status: 'menunggu',
    createdAt: toISODate(now()),
  },
  {
    id: 'leave-citra-sample',
    doctorId: 'doc-citra',
    startDate: toISODate(addDays(nextMonday, 10)),
    endDate: toISODate(addDays(nextMonday, 10)),
    status: 'draf',
    createdAt: toISODate(now()),
  },
]
