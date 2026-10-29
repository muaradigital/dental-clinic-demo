import type { AuditLogEntry } from '@/types'

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString()

/**
 * A little history so the audit log isn't empty before the demo session
 * does anything itself. Descriptions are written in the exact format
 * useDemoStore's renderAuditDescription produces, so these read as
 * indistinguishable from entries the app generates live.
 */
export const auditLog: AuditLogEntry[] = [
  {
    id: 'audit-seed-1',
    timestamp: hoursAgo(1),
    userId: 'user-rudi',
    branchId: 'branch-pusat-kota',
    actionType: 'status_appointment',
    description: 'Janji #1035: baru → dikonfirmasi',
  },
  {
    id: 'audit-seed-2',
    timestamp: hoursAgo(2),
    userId: 'user-sari',
    branchId: 'branch-pusat-kota',
    actionType: 'status_appointment',
    description: 'Janji #1036: baru → dikonfirmasi',
  },
  {
    id: 'audit-seed-3',
    timestamp: hoursAgo(3),
    userId: 'user-sari',
    branchId: 'branch-pusat-kota',
    actionType: 'reminder_sent',
    description: 'Mengirim pengingat H-1 · Janji #1038',
  },
  {
    id: 'audit-seed-4',
    timestamp: hoursAgo(26),
    userId: 'user-pemilik',
    actionType: 'login',
    description: 'Masuk sebagai pemilik',
  },
]
