import { getWeekday } from '@/lib/date'
import type { Appointment, AppointmentSource, Weekday } from '@/types'
import { SOURCE_LABELS } from '@/lib/status'
import { getBranchById, getBranches } from './branchRepository'
import { getAppointments } from './appointmentRepository'
import { getDoctorsByBranch } from './doctorRepository'

/** Aggregate-only by construction — every function here reads/returns counts and rates, never a patient name or number. */
function getAppointmentsForMonth(month: string, branchId?: string): Appointment[] {
  return getAppointments(branchId ? { branchId } : undefined).filter((a) => a.date.startsWith(month))
}

export function getMonthlyKpis(month: string, branchId?: string) {
  const appointments = getAppointmentsForMonth(month, branchId)
  const total = appointments.length
  const hadir = appointments.filter((a) => a.status === 'hadir').length
  const tidakHadir = appointments.filter((a) => a.status === 'tidak hadir').length
  const fromWebsite = appointments.filter((a) => a.source === 'online').length
  return {
    totalAppointments: total,
    hadirCount: hadir,
    attendanceRate: total === 0 ? 0 : hadir / total,
    tidakHadirCount: tidakHadir,
    noShowRate: total === 0 ? 0 : tidakHadir / total,
    fromWebsiteCount: fromWebsite,
    fromWebsiteRate: total === 0 ? 0 : fromWebsite / total,
  }
}

export interface WeeklyBranchPoint {
  weekLabel: string
  byBranch: { branchId: string; branchName: string; count: number }[]
}

/** Buckets each appointment into a 7-day "week N of month" bucket by day-of-month. */
export function getWeeklyAppointmentsByBranch(month: string): WeeklyBranchPoint[] {
  const branches = getBranches()
  const appointments = getAppointmentsForMonth(month)
  const weekCount = 5 // covers up to a 31-day month

  return Array.from({ length: weekCount }, (_, weekIndex) => {
    const weekAppointments = appointments.filter((a) => {
      const day = Number(a.date.slice(8, 10))
      return Math.floor((day - 1) / 7) === weekIndex
    })
    return {
      weekLabel: `Minggu ${weekIndex + 1}`,
      byBranch: branches.map((b) => ({
        branchId: b.id,
        branchName: b.name,
        count: weekAppointments.filter((a) => a.branchId === b.id).length,
      })),
    }
  }).filter((point) => point.byBranch.some((b) => b.count > 0))
}

export interface SourceBreakdownRow {
  source: AppointmentSource
  label: string
  count: number
  percentage: number
}

export function getSourceBreakdown(month: string, branchId?: string): SourceBreakdownRow[] {
  const appointments = getAppointmentsForMonth(month, branchId)
  const total = appointments.length
  const sources: AppointmentSource[] = ['online', 'gbp', 'instagram', 'lainnya']
  return sources.map((source) => {
    const count = appointments.filter((a) => a.source === source).length
    return { source, label: SOURCE_LABELS[source], count, percentage: total === 0 ? 0 : count / total }
  })
}

export interface BusyHourPoint {
  hour: string
  count: number
}

export function getBusyHourHistogram(month: string, branchId?: string): BusyHourPoint[] {
  const appointments = getAppointmentsForMonth(month, branchId)
  const counts = new Map<string, number>()
  for (const a of appointments) {
    const hour = a.timeSlot.split('.')[0] + '.00'
    counts.set(hour, (counts.get(hour) ?? 0) + 1)
  }
  return Array.from(counts.entries())
    .map(([hour, count]) => ({ hour, count }))
    .sort((a, b) => a.hour.localeCompare(b.hour))
}

export interface DoctorAttendanceRow {
  doctorId: string
  doctorName: string
  appointmentCount: number
  attendanceRate: number
}

/**
 * `Appointment` has no doctor field by design (it's booked by service
 * category, not by doctor — see types/appointment.ts). A doctor is
 * attributed to an appointment only when exactly one doctor covers that
 * branch on that weekday; otherwise it's left out of this table rather than
 * guessed. This is why branch/days with two overlapping doctors (e.g.
 * Thursdays at Barat) won't show every appointment accounted for here.
 */
export function getDoctorAttendanceRates(month: string, branchId?: string): DoctorAttendanceRow[] {
  const appointments = getAppointmentsForMonth(month, branchId)
  const byDoctor = new Map<string, Appointment[]>()

  for (const appointment of appointments) {
    const weekday = getWeekday(new Date(`${appointment.date}T00:00:00`)) as Weekday
    const candidates = getDoctorsByBranch(appointment.branchId).filter((d) =>
      d.schedule.some((e) => e.weekday === weekday && e.branchId === appointment.branchId),
    )
    if (candidates.length !== 1) continue
    const doctor = candidates[0]
    byDoctor.set(doctor.id, [...(byDoctor.get(doctor.id) ?? []), appointment])
  }

  return Array.from(byDoctor.entries()).map(([doctorId, list]) => {
    const hadir = list.filter((a) => a.status === 'hadir').length
    const doctorName = getDoctorsByBranch(list[0].branchId).find((d) => d.id === doctorId)?.name ?? doctorId
    return { doctorId, doctorName, appointmentCount: list.length, attendanceRate: list.length === 0 ? 0 : hadir / list.length }
  })
}

export function getBranchName(branchId: string): string {
  return getBranchById(branchId)?.name ?? branchId
}
