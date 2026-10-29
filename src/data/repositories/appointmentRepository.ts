import { useShallow } from 'zustand/react/shallow'
import { useDemoStore } from '@/store/useDemoStore'
import type { Appointment, AppointmentExportRow, AppointmentStatus } from '@/types'

export function getAppointments(filter?: { branchId?: string; date?: string; status?: AppointmentStatus }): Appointment[] {
  let appointments = useDemoStore.getState().appointments
  if (filter?.branchId) appointments = appointments.filter((a) => a.branchId === filter.branchId)
  if (filter?.date) appointments = appointments.filter((a) => a.date === filter.date)
  if (filter?.status) appointments = appointments.filter((a) => a.status === filter.status)
  return appointments
}

export function createAppointment(input: Omit<Appointment, 'id' | 'appointmentNumber' | 'createdAt'>): Appointment {
  return useDemoStore.getState().createAppointment(input)
}

export function updateAppointmentStatus(id: string, status: AppointmentStatus, actorUserId: string): void {
  useDemoStore.getState().updateAppointmentStatus(id, status, actorUserId)
}

export function getTodayStats(branchId: string, date: string) {
  const appointments = getAppointments({ branchId, date })
  return {
    total: appointments.length,
    menungguKonfirmasi: appointments.filter((a) => a.status === 'baru').length,
    hadir: appointments.filter((a) => a.status === 'hadir').length,
    tidakHadir: appointments.filter((a) => a.status === 'tidak hadir').length,
  }
}

/** Reduced row type with no name/phone field — a compile-time guarantee, not a runtime filter. */
export function toExportRows(rows: Appointment[]): AppointmentExportRow[] {
  return rows.map(({ appointmentNumber, branchId, serviceCategoryId, date, timeSlot, status, source }) => ({
    appointmentNumber,
    branchId,
    serviceCategoryId,
    date,
    timeSlot,
    status,
    source,
  }))
}

export function useAppointments(branchId?: string): Appointment[] {
  return useDemoStore(
    useShallow((s) => (branchId ? s.appointments.filter((a) => a.branchId === branchId) : s.appointments)),
  )
}
