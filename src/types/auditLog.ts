import type { AppointmentStatus } from './appointment'
import type { ContentType } from './content'
import type { RoleId } from './role'

/**
 * Closed union, no free-text field anywhere. This is what makes "log audit
 * tidak memuat nama atau nomor pasien" a structural guarantee rather than a
 * convention — there is no parameter an author could misuse to pass a name.
 */
export type AuditPayload =
  | {
      type: 'status_appointment'
      appointmentNumber: string
      from: AppointmentStatus
      to: AppointmentStatus
      branchId: string
    }
  | {
      type: 'reminder_sent'
      appointmentNumber: string
      branchId: string
    }
  | {
      type: 'content_submit_review' | 'content_request_revision' | 'content_publish'
      contentTitle: string
      contentType: ContentType
    }
  | {
      type: 'export_csv'
      scope: string
    }
  | {
      type: 'settings_change'
      setting: string
    }
  | {
      type: 'login'
      role: RoleId
    }

export type AuditActionType = AuditPayload['type']

export interface AuditLogEntry {
  id: string
  timestamp: string
  userId: string
  branchId?: string
  actionType: AuditActionType
  /** Rendered from an AuditPayload at write time — never authored freehand. */
  description: string
}
