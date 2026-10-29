export type AppointmentStatus = 'baru' | 'dikonfirmasi' | 'hadir' | 'tidak hadir' | 'jadwal ulang'

export type AppointmentSource = 'online' | 'telepon' | 'walk-in'

export interface Appointment {
  id: string
  /** The only identifier ever allowed into the audit log or an export. */
  appointmentNumber: string
  branchId: string
  serviceCategoryId: string
  date: string // ISO yyyy-mm-dd
  timeSlot: string // "09.00"
  patientName: string
  patientWhatsapp: string
  status: AppointmentStatus
  source: AppointmentSource
  consentGiven: boolean
  createdAt: string
  /** Drives the slot-fullness session overlay in the reservation flow. */
  isSessionCreated: boolean
}

/** Row shape for CSV export — structurally has no name/phone field. */
export type AppointmentExportRow = Pick<
  Appointment,
  'appointmentNumber' | 'branchId' | 'serviceCategoryId' | 'date' | 'timeSlot' | 'status' | 'source'
>
