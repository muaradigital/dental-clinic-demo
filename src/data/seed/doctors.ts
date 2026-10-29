import type { Doctor } from '@/types'

export const doctors: Doctor[] = [
  {
    id: 'doc-anindya',
    slug: 'anindya-prameswari',
    name: 'drg. Anindya Prameswari',
    title: '',
    specialty: 'Dokter Gigi Umum',
    initials: 'AP',
    avatarSeed: 'anindya-prameswari',
    schedule: [
      { weekday: 1, branchId: 'branch-pusat-kota' }, // Senin
      { weekday: 3, branchId: 'branch-pusat-kota' }, // Rabu
      { weekday: 5, branchId: 'branch-timur' }, // Jumat
    ],
  },
  {
    id: 'doc-bayu',
    slug: 'bayu-santosa',
    name: 'drg. Bayu Santosa',
    title: 'Sp.Ort',
    specialty: 'Spesialis Ortodonti',
    initials: 'BS',
    avatarSeed: 'bayu-santosa',
    schedule: [
      { weekday: 2, branchId: 'branch-pusat-kota' }, // Selasa
      { weekday: 4, branchId: 'branch-pusat-kota' }, // Kamis
      { weekday: 6, branchId: 'branch-pusat-kota' }, // Sabtu
    ],
  },
  {
    id: 'doc-citra',
    slug: 'citra-maharani',
    name: 'drg. Citra Maharani',
    title: 'Sp.KGA',
    specialty: 'Spesialis Gigi Anak',
    initials: 'CM',
    avatarSeed: 'citra-maharani',
    schedule: [
      { weekday: 1, branchId: 'branch-timur' }, // Senin
      { weekday: 2, branchId: 'branch-timur' }, // Selasa
      { weekday: 4, branchId: 'branch-barat' }, // Kamis
    ],
  },
  {
    id: 'doc-dimas',
    slug: 'dimas-aryaputra',
    name: 'drg. Dimas Aryaputra',
    title: '',
    specialty: 'Dokter Gigi Umum',
    initials: 'DA',
    avatarSeed: 'dimas-aryaputra',
    schedule: [
      { weekday: 1, branchId: 'branch-barat' },
      { weekday: 2, branchId: 'branch-barat' },
      { weekday: 3, branchId: 'branch-barat' },
      { weekday: 4, branchId: 'branch-barat' },
      { weekday: 5, branchId: 'branch-barat' },
      { weekday: 6, branchId: 'branch-barat' },
    ],
  },
]
