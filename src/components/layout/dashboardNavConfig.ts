import type { ContentNavKey, OperationalNavKey } from '@/types'

export const OPERATIONAL_NAV_ITEMS: { key: OperationalNavKey; label: string; to: string }[] = [
  { key: 'janji', label: 'Janji hari ini', to: '/dasbor/janji' },
  { key: 'jadwal', label: 'Jadwal & slot', to: '/dasbor/jadwal' },
  { key: 'dokter-cuti', label: 'Dokter & cuti', to: '/dasbor/dokter-cuti' },
  { key: 'pengingat', label: 'Pengingat', to: '/dasbor/pengingat' },
  { key: 'ulasan', label: 'Ulasan Google', to: '/dasbor/ulasan' },
  { key: 'laporan', label: 'Laporan', to: '/dasbor/laporan' },
  { key: 'pengguna', label: 'Pengguna & log audit', to: '/dasbor/pengguna' },
]

export const CONTENT_NAV_ITEMS: { key: ContentNavKey; label: string; to: string }[] = [
  { key: 'layanan', label: 'Layanan', to: '/dasbor/konten/layanan' },
  { key: 'cabang', label: 'Cabang', to: '/dasbor/konten/cabang' },
  { key: 'dokter', label: 'Profil dokter', to: '/dasbor/konten/dokter' },
  { key: 'pengumuman', label: 'Pengumuman & artikel', to: '/dasbor/konten/pengumuman' },
]
