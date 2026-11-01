import type { ContentNavKey, OperationalNavKey } from '@/types'

export const OPERATIONAL_NAV_ITEMS: { key: OperationalNavKey; label: string; to: string }[] = [
  { key: 'janji', label: 'Janji', to: '/dashboard/janji' },
  { key: 'jadwal', label: 'Jadwal & slot', to: '/dashboard/jadwal' },
  { key: 'dokter-cuti', label: 'Dokter & cuti', to: '/dashboard/dokter-cuti' },
  { key: 'pengingat', label: 'Pengingat', to: '/dashboard/pengingat' },
  { key: 'ulasan', label: 'Ulasan Google', to: '/dashboard/ulasan' },
  { key: 'laporan', label: 'Laporan', to: '/dashboard/laporan' },
  { key: 'pengguna', label: 'Pengguna & keamanan', to: '/dashboard/pengguna' },
]

export const CONTENT_NAV_ITEMS: { key: ContentNavKey; label: string; to: string }[] = [
  { key: 'layanan', label: 'Layanan', to: '/dashboard/content/layanan' },
  { key: 'cabang', label: 'Cabang', to: '/dashboard/content/cabang' },
  { key: 'dokter', label: 'Profil dokter', to: '/dashboard/content/dokter' },
  { key: 'pengumuman', label: 'Pengumuman & artikel', to: '/dashboard/content/pengumuman' },
  { key: 'pratinjau', label: 'Antrean tinjauan', to: '/dashboard/content/pratinjau' },
]
