import { getAppointments } from './appointmentRepository'

// TODO(Slice 5): real aggregate computations over appointments for the
// selected month/branch. Aggregate-only by construction — these functions
// never take or return a patient name/number.
export function getMonthlyKpis(_month: string, branchId?: string) {
  const appointments = getAppointments(branchId ? { branchId } : undefined)
  return {
    totalAppointments: appointments.length,
    attendanceRate: 0,
    noShowRate: 0,
    fromWebsiteCount: 0,
  }
}

export function getWeeklyAppointmentsByBranch(_month: string) {
  return []
}

export function getSourceBreakdown(_month: string, _branchId?: string) {
  return []
}

export function getBusyHourHistogram(_month: string, _branchId?: string) {
  return []
}

export function getDoctorAttendanceRates(_month: string, _branchId?: string) {
  return []
}
