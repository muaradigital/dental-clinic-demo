import type { AuditLogEntry } from '@/types'

/** Grows as real actions happen during the demo session (Slice 4+). */
export const auditLog: AuditLogEntry[] = []
