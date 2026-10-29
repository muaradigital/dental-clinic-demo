import type { Branch } from '@/types'
import { CITY_NAME } from './clinic'

export const branches: Branch[] = [
  {
    id: 'branch-pusat-kota',
    slug: 'pusat-kota',
    name: 'Cabang Pusat Kota',
    address: `Jl. Contoh Raya No. 12, Kecamatan Tengah, ${CITY_NAME}`,
    whatsappNumber: '+62 812-0000-0001',
    photoLabels: ['Ruang tunggu', 'Ruang periksa', 'Resepsionis'],
    isVisible: true,
  },
  {
    id: 'branch-timur',
    slug: 'timur',
    name: 'Cabang Timur',
    address: `Jl. Sampel Timur No. 45, Kecamatan Timur, ${CITY_NAME}`,
    whatsappNumber: '+62 812-0000-0002',
    photoLabels: ['Ruang tunggu', 'Ruang periksa', 'Resepsionis'],
    isVisible: true,
  },
  {
    id: 'branch-barat',
    slug: 'barat',
    name: 'Cabang Barat',
    address: `Jl. Percobaan Barat No. 8, Kecamatan Barat, ${CITY_NAME}`,
    whatsappNumber: '+62 812-0000-0003',
    photoLabels: ['Ruang tunggu', 'Ruang periksa', 'Resepsionis'],
    isVisible: true,
  },
]
