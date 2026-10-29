import { useShallow } from 'zustand/react/shallow'
import { useDemoStore } from '@/store/useDemoStore'
import type { LeaveImpact, LeaveRequest, LeaveStatus } from '@/types'
import { getDoctorById } from './doctorRepository'

export function getLeaveRequests(doctorId?: string): LeaveRequest[] {
  const leaves = useDemoStore.getState().leaves
  return doctorId ? leaves.filter((l) => l.doctorId === doctorId) : leaves
}

export function createLeaveRequest(input: Omit<LeaveRequest, 'id' | 'createdAt'>): LeaveRequest {
  return useDemoStore.getState().createLeaveRequest(input)
}

export function updateLeaveRequestStatus(id: string, status: LeaveStatus): void {
  useDemoStore.getState().updateLeaveRequestStatus(id, status)
}

// TODO(Slice 5): real derivation — closed slot count across the leave's date
// range at the doctor's branches, and which existing appointments in that
// window need rescheduling. Always computed on read, never persisted.
export function computeLeaveImpact(leaveId: string): LeaveImpact {
  const leave = useDemoStore.getState().leaves.find((l) => l.id === leaveId)
  if (!leave || !getDoctorById(leave.doctorId)) {
    return { closedSlotCount: 0, affectedAppointments: [] }
  }
  return { closedSlotCount: 0, affectedAppointments: [] }
}

export function useLeaveRequests(doctorId?: string): LeaveRequest[] {
  return useDemoStore(useShallow((s) => (doctorId ? s.leaves.filter((l) => l.doctorId === doctorId) : s.leaves)))
}
