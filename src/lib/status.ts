import type { AppointmentSource, AppointmentStatus, AuditActionType } from '@/types'

export type StatusTone = 'success' | 'soft-teal' | 'warning' | 'danger' | 'neutral' | 'indigo' | 'expired'

/**
 * Canonical tone -> Tailwind class pairs. The design export used two
 * slightly different hex pairs for its "warning" chip across screens
 * (#fff1d0/#6c4a00 and #fdecc8/#7a4b00) — this adopts the first,
 * everywhere, as the single source so chips never disagree with each other.
 */
export const STATUS_TONE_CLASSES: Record<StatusTone, string> = {
  success: 'bg-success-bg text-success-text',
  'soft-teal': 'bg-soft-teal-bg text-soft-teal-text',
  warning: 'bg-warning-bg text-warning-text',
  danger: 'bg-danger-bg text-danger-text',
  neutral: 'bg-neutral-bg text-neutral-text',
  indigo: 'bg-indigo-bg text-indigo-text',
  expired: 'bg-expired-bg text-expired-text',
}

/** Status text renders lowercase, exactly as the design export shows it. */
export const APPOINTMENT_STATUS_TONE: Record<AppointmentStatus, StatusTone> = {
  baru: 'warning',
  dikonfirmasi: 'soft-teal',
  hadir: 'success',
  'tidak hadir': 'danger',
  'jadwal ulang': 'indigo',
}

export const SOURCE_LABELS: Record<AppointmentSource, string> = {
  online: 'WEB',
  gbp: 'GBP',
  instagram: 'Instagram',
  lainnya: 'Lainnya',
}

export type AuditCategory = 'Perubahan' | 'Melihat data' | 'Keamanan'

/**
 * Every AuditPayload type falls into exactly one of the three filter
 * categories the Pengguna page's log shows — keeps the filter pills and
 * the data in sync without a second parallel list to maintain.
 */
export const AUDIT_CATEGORY: Record<AuditActionType, AuditCategory> = {
  status_appointment: 'Perubahan',
  reminder_sent: 'Perubahan',
  content_submit_review: 'Perubahan',
  content_request_revision: 'Perubahan',
  content_publish: 'Perubahan',
  settings_change: 'Perubahan',
  export_csv: 'Melihat data',
  login: 'Keamanan',
}

export const AUDIT_CATEGORY_TONE: Record<AuditCategory, StatusTone> = {
  Perubahan: 'indigo',
  'Melihat data': 'neutral',
  Keamanan: 'soft-teal',
}
