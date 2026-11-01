import type { RoleConfig, RoleId } from '@/types'

/**
 * Single source of truth for role behavior: drives the dashboard Sidebar,
 * the RequireRole route guard, the Login page's OTP step, the Pengguna
 * page's rendered permission matrix, and useBranchScope. Keeping it in one
 * object means those four surfaces can't drift apart from each other.
 */
export const ROLE_CONFIG: Record<RoleId, RoleConfig> = {
  pemilik: {
    id: 'pemilik',
    label: 'Pemilik',
    branchScope: 'all',
    mfaRequired: true,
    defaultLandingRoute: '/dashboard/janji',
    dashboardNav: {
      operational: ['janji', 'jadwal', 'dokter-cuti', 'pengingat', 'ulasan', 'laporan', 'pengguna'],
      content: ['layanan', 'cabang', 'dokter', 'pengumuman', 'pratinjau'],
    },
  },
  admin_cabang: {
    id: 'admin_cabang',
    label: 'Admin cabang',
    branchScope: 'locked',
    mfaRequired: false,
    defaultLandingRoute: '/dashboard/janji',
    dashboardNav: {
      operational: ['janji', 'jadwal', 'dokter-cuti', 'pengingat', 'ulasan'],
      content: [],
    },
  },
  resepsionis: {
    id: 'resepsionis',
    label: 'Resepsionis',
    branchScope: 'locked',
    mfaRequired: false,
    defaultLandingRoute: '/dashboard/janji',
    dashboardNav: {
      operational: ['janji', 'jadwal', 'pengingat'],
      content: [],
    },
  },
  peninjau: {
    id: 'peninjau',
    label: 'Peninjau (dokter)',
    branchScope: 'all',
    mfaRequired: true,
    defaultLandingRoute: '/dashboard/content/pratinjau',
    dashboardNav: {
      operational: [],
      content: ['layanan', 'cabang', 'dokter', 'pengumuman', 'pratinjau'],
    },
  },
}

export const ROLE_ORDER: RoleId[] = ['pemilik', 'admin_cabang', 'resepsionis', 'peninjau']

export function canAccessOperationalNav(role: RoleId, key: RoleConfig['dashboardNav']['operational'][number]) {
  return ROLE_CONFIG[role].dashboardNav.operational.includes(key)
}

export function canAccessContentNav(role: RoleId, key: RoleConfig['dashboardNav']['content'][number]) {
  return ROLE_CONFIG[role].dashboardNav.content.includes(key)
}
