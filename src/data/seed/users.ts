import type { User } from '@/types'

export const users: User[] = [
  {
    id: 'user-pemilik',
    name: 'Drg. Pemilik',
    email: 'pemilik@arunika.example',
    role: 'pemilik',
    mfaEnabled: true,
    lastLoginAt: '2026-10-28T09:12:00+07:00',
  },
  {
    id: 'user-rudi',
    name: 'Rudi H.',
    email: 'rudi@arunika.example',
    role: 'admin_cabang',
    branchId: 'branch-pusat-kota',
    mfaEnabled: false,
    lastLoginAt: '2026-10-29T08:05:00+07:00',
  },
  {
    id: 'user-sari',
    name: 'Sari W.',
    email: 'sari@arunika.example',
    role: 'resepsionis',
    branchId: 'branch-pusat-kota',
    mfaEnabled: false,
    lastLoginAt: '2026-10-29T07:40:00+07:00',
  },
  {
    id: 'user-anindya',
    name: 'drg. Anindya Prameswari',
    email: 'anindya@arunika.example',
    role: 'peninjau',
    mfaEnabled: true,
    lastLoginAt: '2026-10-27T13:20:00+07:00',
  },
]
