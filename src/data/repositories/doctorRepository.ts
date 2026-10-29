import { doctors } from '@/data/seed/doctors'
import type { Doctor, DoctorScheduleEntry } from '@/types'

export function getDoctors(): Doctor[] {
  return doctors
}

export function getDoctorById(id: string): Doctor | undefined {
  return doctors.find((d) => d.id === id)
}

export function getDoctorBySlug(slug: string): Doctor | undefined {
  return doctors.find((d) => d.slug === slug)
}

/** Derived from `doctor.schedule` — a doctor's branches are never stored separately. */
export function getDoctorsByBranch(branchId: string): Doctor[] {
  return doctors.filter((d) => d.schedule.some((entry) => entry.branchId === branchId))
}

export function getDoctorSchedule(doctorId: string): DoctorScheduleEntry[] {
  return doctors.find((d) => d.id === doctorId)?.schedule ?? []
}
