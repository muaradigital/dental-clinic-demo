export type RoleId = 'pemilik' | 'admin_cabang' | 'resepsionis' | 'peninjau'

export type OperationalNavKey =
  | 'janji'
  | 'jadwal'
  | 'dokter-cuti'
  | 'pengingat'
  | 'ulasan'
  | 'laporan'
  | 'pengguna'

export type ContentNavKey = 'layanan' | 'cabang' | 'dokter' | 'pengumuman' | 'pratinjau'

export interface RoleConfig {
  id: RoleId
  label: string
  branchScope: 'all' | 'locked'
  mfaRequired: boolean
  defaultLandingRoute: string
  dashboardNav: {
    operational: OperationalNavKey[]
    content: ContentNavKey[]
  }
}
