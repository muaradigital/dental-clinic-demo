import { useShallow } from 'zustand/react/shallow'
import { addDays, getWeekday, toISODate } from '@/lib/date'
import { generateSlotTimes, isDayClosed } from '@/lib/slots'
import { useDemoStore } from '@/store/useDemoStore'
import type { LeaveImpact, LeaveRequest, LeaveStatus, Weekday } from '@/types'
import { getDoctorById, getDoctorsByBranch } from './doctorRepository'
import { getPracticeHours, getSlotSettings } from './scheduleRepository'

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

/**
 * Real derivation, always computed on read, never persisted: for each day in
 * the leave's date range that matches one of the doctor's practice days, a
 * branch's slots only close if NO other doctor also covers that branch on
 * that same weekday — if someone else is on duty, the clinic stays open and
 * there's no impact from this doctor's absence alone.
 */
export function computeLeaveImpact(leaveId: string): LeaveImpact {
  const leave = useDemoStore.getState().leaves.find((l) => l.id === leaveId)
  const doctor = leave ? getDoctorById(leave.doctorId) : undefined
  if (!leave || !doctor) return { closedSlotCount: 0, closedBranchIds: [], affectedAppointments: [] }

  const closedByDate: { date: string; branchId: string }[] = []
  const end = new Date(`${leave.endDate}T00:00:00`)
  for (let cursor = new Date(`${leave.startDate}T00:00:00`); cursor <= end; cursor = addDays(cursor, 1)) {
    const weekday = getWeekday(cursor) as Weekday
    const date = toISODate(cursor)
    for (const entry of doctor.schedule.filter((e) => e.weekday === weekday)) {
      const coveredByAnotherDoctor = getDoctorsByBranch(entry.branchId).some(
        (other) => other.id !== doctor.id && other.schedule.some((e2) => e2.weekday === weekday && e2.branchId === entry.branchId),
      )
      if (!coveredByAnotherDoctor) closedByDate.push({ date, branchId: entry.branchId })
    }
  }

  let closedSlotCount = 0
  for (const { date, branchId } of closedByDate) {
    const dayHours = getPracticeHours(branchId)?.days.find((d) => d.weekday === getWeekday(new Date(`${date}T00:00:00`)))
    if (isDayClosed(dayHours)) continue
    closedSlotCount += generateSlotTimes(dayHours!, getSlotSettings(branchId)?.slotDurationMinutes).length
  }

  const affectedAppointments = useDemoStore
    .getState()
    .appointments.filter((a) => closedByDate.some((c) => c.date === a.date && c.branchId === a.branchId))
  const closedBranchIds = Array.from(new Set(closedByDate.map((c) => c.branchId)))

  return { closedSlotCount, closedBranchIds, affectedAppointments }
}

export function useLeaveRequests(doctorId?: string): LeaveRequest[] {
  return useDemoStore(useShallow((s) => (doctorId ? s.leaves.filter((l) => l.doctorId === doctorId) : s.leaves)))
}
