import type { ContentItem } from '@/types'
import { branches } from './branches'
import { doctors } from './doctors'
import { services } from './services'

const BASE_UPDATED_AT = '2026-10-12T10:00:00+07:00'
const BASE_UPDATED_BY = 'Rudi H.'

/**
 * Every service/branch/doctor starts with a baseline ContentItem already at
 * 'tayang' so the public site looks complete before anyone touches the
 * content dashboard. The content-workflow demo (Slice 6) centers on
 * publishing one *new* Pengumuman banner end to end, not on these.
 */
const layananContent: ContentItem[] = services.map((service) => ({
  id: `content-layanan-${service.id}`,
  type: 'layanan',
  title: service.name,
  serviceId: service.id,
  body: service.shortDescription,
  status: 'tayang',
  showOnWebsite: true,
  showInReservation: true,
  showPrice: false,
  updatedAt: BASE_UPDATED_AT,
  updatedBy: BASE_UPDATED_BY,
}))

const cabangContent: ContentItem[] = branches.map((branch) => ({
  id: `content-cabang-${branch.id}`,
  type: 'cabang',
  title: branch.name,
  branchId: branch.id,
  body: `${branch.name} berlokasi di ${branch.address}.`,
  status: 'tayang',
  updatedAt: BASE_UPDATED_AT,
  updatedBy: BASE_UPDATED_BY,
}))

const dokterContent: ContentItem[] = doctors.map((doctor) => ({
  id: `content-dokter-${doctor.id}`,
  type: 'dokter',
  title: doctor.name,
  doctorId: doctor.id,
  body: `${doctor.name} praktik sebagai ${doctor.specialty.toLowerCase()} di Klinik Gigi Arunika.`,
  status: 'tayang',
  showCredentialNumber: false,
  updatedAt: BASE_UPDATED_AT,
  updatedBy: BASE_UPDATED_BY,
}))

export const content: ContentItem[] = [...layananContent, ...cabangContent, ...dokterContent]
