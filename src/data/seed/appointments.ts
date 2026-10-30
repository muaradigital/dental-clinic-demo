import { addDays, getWeekday, toISODate, now } from '@/lib/date'
import { practiceHours } from './practiceHours'
import type { Appointment, Weekday } from '@/types'

const today = toISODate(now())
const tomorrowDate = addDays(now(), 1)
const tomorrowISO = toISODate(tomorrowDate)

/** Whether `branchId` is open on `date`, per its weekly practice hours (closures aren't checked — not needed for seed data). */
function isBranchOpenOnWeekday(branchId: string, date: Date): boolean {
  const weekday = getWeekday(date)
  const day = practiceHours.find((p) => p.branchId === branchId)?.days.find((d) => d.weekday === weekday)
  return !!day && !day.isClosed
}

/** The next date on/after `from` that falls on `weekday` (today counts if it already matches). */
function nextWeekdayOnOrAfter(from: Date, weekday: Weekday): Date {
  const diff = (weekday - getWeekday(from) + 7) % 7
  return addDays(from, diff)
}

// Anindya's two sole-practitioner days this week — Monday at Pusat Kota and
// Wednesday at Timur, neither covered by another doctor — used by the
// Dokter & cuti "dampak cuti" demo seed below, computed from the system
// clock so it's never a stale hardcoded date.
const nextMonday = nextWeekdayOnOrAfter(now(), 1)
const nextWednesdayOfSameWeek = toISODate(addDays(nextMonday, 2))
const nextMondayISO = toISODate(nextMonday)

/**
 * Realistic rows for Cabang Pusat Kota today, mirroring the design export's
 * "Janji hari ini" sample data. Numbered 1033-1040 so the store's running
 * counter (seeded to start at 1041) never collides with these.
 */
export const appointments: Appointment[] = [
  {
    id: 'appt-1033',
    appointmentNumber: '1033',
    branchId: 'branch-pusat-kota',
    serviceCategoryId: 'cat-pemeriksaan',
    date: today,
    timeSlot: '09.00',
    patientName: 'Rina A.',
    patientWhatsapp: '081234563321',
    status: 'hadir',
    source: 'online',
    consentGiven: true,
    createdAt: today,
    isSessionCreated: false,
  },
  {
    id: 'appt-1034',
    appointmentNumber: '1034',
    branchId: 'branch-pusat-kota',
    serviceCategoryId: 'cat-pembersihan',
    date: today,
    timeSlot: '09.00',
    patientName: 'Budi S.',
    patientWhatsapp: '085790120912',
    status: 'hadir',
    source: 'gbp',
    consentGiven: true,
    createdAt: today,
    isSessionCreated: false,
  },
  {
    id: 'appt-1035',
    appointmentNumber: '1035',
    branchId: 'branch-pusat-kota',
    serviceCategoryId: 'cat-tambal',
    date: today,
    timeSlot: '10.00',
    patientName: 'Maya P.',
    patientWhatsapp: '081317647764',
    status: 'dikonfirmasi',
    source: 'online',
    consentGiven: true,
    createdAt: today,
    isSessionCreated: false,
  },
  {
    id: 'appt-1036',
    appointmentNumber: '1036',
    branchId: 'branch-pusat-kota',
    serviceCategoryId: 'cat-kawat-gigi',
    date: today,
    timeSlot: '11.00',
    patientName: 'Dewi K.',
    patientWhatsapp: '082111801180',
    status: 'dikonfirmasi',
    source: 'instagram',
    consentGiven: true,
    createdAt: today,
    isSessionCreated: false,
  },
  {
    id: 'appt-1037',
    appointmentNumber: '1037',
    branchId: 'branch-pusat-kota',
    serviceCategoryId: 'cat-cabut',
    date: today,
    timeSlot: '13.00',
    patientName: 'Andi R.',
    patientWhatsapp: '087855035503',
    status: 'baru',
    source: 'online',
    consentGiven: true,
    createdAt: today,
    isSessionCreated: false,
  },
  {
    id: 'appt-1038',
    appointmentNumber: '1038',
    branchId: 'branch-pusat-kota',
    serviceCategoryId: 'cat-saluran-akar',
    date: today,
    timeSlot: '14.00',
    patientName: 'Lia N.',
    patientWhatsapp: '089620472047',
    status: 'baru',
    source: 'online',
    consentGiven: true,
    createdAt: today,
    isSessionCreated: false,
  },
  {
    id: 'appt-1039',
    appointmentNumber: '1039',
    branchId: 'branch-pusat-kota',
    serviceCategoryId: 'cat-gigi-tiruan',
    date: today,
    timeSlot: '15.00',
    patientName: 'Tono W.',
    patientWhatsapp: '081190359035',
    status: 'jadwal ulang',
    source: 'gbp',
    consentGiven: true,
    createdAt: today,
    isSessionCreated: false,
  },
  {
    id: 'appt-1040',
    appointmentNumber: '1040',
    branchId: 'branch-pusat-kota',
    serviceCategoryId: 'cat-pemeriksaan',
    date: today,
    timeSlot: '16.00',
    patientName: 'Yuni F.',
    patientWhatsapp: '085244184418',
    status: 'tidak hadir',
    source: 'online',
    consentGiven: true,
    createdAt: today,
    isSessionCreated: false,
  },
  {
    id: 'appt-1041',
    appointmentNumber: '1041',
    branchId: 'branch-pusat-kota',
    serviceCategoryId: 'cat-pemeriksaan',
    date: nextMondayISO,
    timeSlot: '09.00',
    patientName: 'Fajar H.',
    patientWhatsapp: '081355667788',
    status: 'dikonfirmasi',
    source: 'online',
    consentGiven: true,
    createdAt: today,
    isSessionCreated: false,
  },
  {
    id: 'appt-1042',
    appointmentNumber: '1042',
    branchId: 'branch-timur',
    serviceCategoryId: 'cat-tambal',
    date: nextWednesdayOfSameWeek,
    timeSlot: '10.00',
    patientName: 'Sinta M.',
    patientWhatsapp: '082199887766',
    status: 'baru',
    source: 'online',
    consentGiven: true,
    createdAt: today,
    isSessionCreated: false,
  },
  // Tomorrow's rows give the Pengingat (H-1 reminder) screen real candidates
  // to act on no matter what day the demo is actually opened — one sendable
  // (consent given), one not (no consent), matching the reference's own mix.
  // Skipped entirely if tomorrow lands on a day Pusat Kota is closed.
  ...(isBranchOpenOnWeekday('branch-pusat-kota', tomorrowDate)
    ? [
        {
          id: 'appt-1043',
          appointmentNumber: '1043',
          branchId: 'branch-pusat-kota',
          serviceCategoryId: 'cat-pembersihan',
          date: tomorrowISO,
          timeSlot: '10.00',
          patientName: 'Wulan K.',
          patientWhatsapp: '081277889900',
          status: 'dikonfirmasi',
          source: 'online',
          consentGiven: true,
          createdAt: today,
          isSessionCreated: false,
        } satisfies Appointment,
        {
          id: 'appt-1044',
          appointmentNumber: '1044',
          branchId: 'branch-pusat-kota',
          serviceCategoryId: 'cat-cabut',
          date: tomorrowISO,
          timeSlot: '11.00',
          patientName: 'Hadi P.',
          patientWhatsapp: '081366778899',
          status: 'baru',
          source: 'gbp',
          consentGiven: false,
          createdAt: today,
          isSessionCreated: false,
        } satisfies Appointment,
      ]
    : []),
  // A second branch today, so Laporan's per-branch aggregation (and the
  // Jadwal/Pengingat/Ulasan branch-scoped screens) have more than one
  // branch's worth of real data to show within the current month.
  {
    id: 'appt-1045',
    appointmentNumber: '1045',
    branchId: 'branch-timur',
    serviceCategoryId: 'cat-pemeriksaan',
    date: today,
    timeSlot: '11.00',
    patientName: 'Eka L.',
    patientWhatsapp: '081288990011',
    status: 'hadir',
    source: 'gbp',
    consentGiven: true,
    createdAt: today,
    isSessionCreated: false,
  },
]
