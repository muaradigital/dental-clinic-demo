import type { Appointment } from './appointment'

export type LeaveStatus = 'draf' | 'menunggu' | 'disetujui'

export interface LeaveRequest {
  id: string
  doctorId: string
  startDate: string
  endDate: string
  note?: string
  status: LeaveStatus
  createdAt: string
}

export interface LeaveImpact {
  closedSlotCount: number
  /** Every branch with at least one day fully closed by this leave, even if no appointment was booked there yet. */
  closedBranchIds: string[]
  affectedAppointments: Appointment[]
}
