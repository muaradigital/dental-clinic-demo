import type { Service, ServiceCategory } from '@/types'

/**
 * The design export doesn't layer a separate taxonomy over the 8 services —
 * its "kategori layanan" picker in Reservasi lists the same 8 names. Each
 * category maps 1:1 to one service here, which keeps that behavior while
 * leaving room to group multiple services under one category later.
 */
export const serviceCategories: ServiceCategory[] = [
  { id: 'cat-pemeriksaan', name: 'Pemeriksaan & Konsultasi' },
  { id: 'cat-pembersihan', name: 'Pembersihan Karang Gigi' },
  { id: 'cat-tambal', name: 'Tambal Gigi' },
  { id: 'cat-cabut', name: 'Pencabutan Gigi' },
  { id: 'cat-saluran-akar', name: 'Perawatan Saluran Akar' },
  { id: 'cat-kawat-gigi', name: 'Kawat Gigi (Ortodonti)' },
  { id: 'cat-gigi-tiruan', name: 'Gigi Tiruan' },
  { id: 'cat-gigi-anak', name: 'Perawatan Gigi Anak' },
]

export const services: Service[] = [
  {
    id: 'svc-pemeriksaan',
    slug: 'pemeriksaan-konsultasi',
    categoryId: 'cat-pemeriksaan',
    name: 'Pemeriksaan & Konsultasi',
    shortDescription:
      'Pemeriksaan gigi dan mulut serta diskusi rencana perawatan bersama dokter.',
    icon: 'stethoscope',
  },
  {
    id: 'svc-pembersihan',
    slug: 'pembersihan-karang-gigi',
    categoryId: 'cat-pembersihan',
    name: 'Pembersihan Karang Gigi',
    shortDescription:
      'Membersihkan plak dan karang gigi sebagai bagian dari perawatan berkala.',
    icon: 'sparkles',
  },
  {
    id: 'svc-tambal',
    slug: 'tambal-gigi',
    categoryId: 'cat-tambal',
    name: 'Tambal Gigi',
    shortDescription:
      'Penjelasan umum tentang tambalan untuk gigi berlubang, sesuai penilaian dokter.',
    icon: 'tooth',
  },
  {
    id: 'svc-cabut',
    slug: 'pencabutan-gigi',
    categoryId: 'cat-cabut',
    name: 'Pencabutan Gigi',
    shortDescription:
      'Tindakan pencabutan oleh dokter sesuai kondisi masing-masing pasien.',
    icon: 'tooth-outline',
  },
  {
    id: 'svc-saluran-akar',
    slug: 'perawatan-saluran-akar',
    categoryId: 'cat-saluran-akar',
    name: 'Perawatan Saluran Akar',
    shortDescription:
      'Perawatan bagian dalam gigi. Dokter menjelaskan tahapan dan jumlah kunjungan.',
    icon: 'root-canal',
  },
  {
    id: 'svc-kawat-gigi',
    slug: 'kawat-gigi-ortodonti',
    categoryId: 'cat-kawat-gigi',
    name: 'Kawat Gigi (Ortodonti)',
    shortDescription:
      'Konsultasi penataan susunan gigi dan rahang serta pilihan perawatannya.',
    icon: 'braces',
  },
  {
    id: 'svc-gigi-tiruan',
    slug: 'gigi-tiruan',
    categoryId: 'cat-gigi-tiruan',
    name: 'Gigi Tiruan',
    shortDescription: 'Informasi penggantian gigi yang hilang, jenis, dan perawatannya.',
    icon: 'denture',
  },
  {
    id: 'svc-gigi-anak',
    slug: 'perawatan-gigi-anak',
    categoryId: 'cat-gigi-anak',
    name: 'Perawatan Gigi Anak',
    shortDescription:
      'Pemeriksaan dan edukasi kesehatan gigi anak dengan pendekatan bertahap.',
    icon: 'child-tooth',
  },
]
