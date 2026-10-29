import { users } from '@/data/seed/users'
import { ROLE_CONFIG, ROLE_ORDER } from '@/lib/permissions'
import type { RoleId, User } from '@/types'

export function getUsers(): User[] {
  return users
}

export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id)
}

export function getUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email === email)
}

export interface PermissionMatrixRow {
  permission: string
  byRole: Record<RoleId, boolean>
}

/**
 * Derived from lib/permissions.ts — a single source, so this table can
 * never contradict what RequireRole actually enforces.
 */
export function getRolePermissionMatrix(): PermissionMatrixRow[] {
  const rows: Array<{ permission: string; check: (role: RoleId) => boolean }> = [
    { permission: 'Lihat semua cabang', check: (r) => ROLE_CONFIG[r].branchScope === 'all' },
    { permission: 'Lihat daftar janji hari ini', check: (r) => ROLE_CONFIG[r].dashboardNav.operational.includes('janji') },
    { permission: 'Ubah status janji', check: (r) => ROLE_CONFIG[r].dashboardNav.operational.includes('janji') },
    { permission: 'Atur jadwal, slot, dan kuota', check: (r) => ROLE_CONFIG[r].dashboardNav.operational.includes('jadwal') },
    { permission: 'Kelola dokter & cuti', check: (r) => ROLE_CONFIG[r].dashboardNav.operational.includes('dokter-cuti') },
    { permission: 'Balas ulasan Google', check: (r) => ROLE_CONFIG[r].dashboardNav.operational.includes('ulasan') },
    { permission: 'Laporan & ekspor CSV', check: (r) => ROLE_CONFIG[r].dashboardNav.operational.includes('laporan') },
    { permission: 'Kelola pengguna & log audit', check: (r) => ROLE_CONFIG[r].dashboardNav.operational.includes('pengguna') },
    { permission: 'Tinjau & tayangkan konten', check: (r) => ROLE_CONFIG[r].dashboardNav.content.includes('pratinjau') },
  ]
  return rows.map(({ permission, check }) => ({
    permission,
    byRole: Object.fromEntries(ROLE_ORDER.map((role) => [role, check(role)])) as Record<RoleId, boolean>,
  }))
}

export function getDesignatedReviewers(): User[] {
  return users.filter((u) => u.role === 'peninjau')
}
