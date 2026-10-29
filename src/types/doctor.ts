import type { Weekday } from './practiceHours'

export interface DoctorScheduleEntry {
  weekday: Weekday
  branchId: string
}

export interface Doctor {
  id: string
  slug: string
  name: string
  title: string
  specialty: string
  bio?: string
  initials: string
  avatarSeed: string
  /** Branch assignment is always DERIVED from this — never stored separately. */
  schedule: DoctorScheduleEntry[]
}
