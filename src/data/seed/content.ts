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
  firstPublishedAt: BASE_UPDATED_AT,
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
  firstPublishedAt: BASE_UPDATED_AT,
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
  firstPublishedAt: BASE_UPDATED_AT,
}))

const nowISO = () => new Date().toISOString()
const atHour = (daysFromNow: number, hour: number) => {
  const d = new Date()
  d.setDate(d.getDate() + daysFromNow)
  d.setHours(hour, 0, 0, 0)
  return d.toISOString()
}

/**
 * Seeded as 'draf' so Slice 6's demo can push it Draf -> Ditinjau -> (4-point
 * checklist) -> Tayang and prove the homepage banner appears afterward,
 * rather than starting pre-published like the baseline items above.
 */
const pengumumanContent: ContentItem[] = [
  {
    id: 'content-pengumuman-pekan-edukasi',
    type: 'pengumuman',
    title: 'Pekan Edukasi Kesehatan Gigi',
    announcementType: 'event_promo',
    body: 'Pemeriksaan gigi dan edukasi cara menyikat gigi yang tepat untuk keluarga. Pendaftaran melalui WhatsApp atau reservasi online. Jumlah peserta terbatas per sesi.',
    publishAt: atHour(5, 0),
    expireAt: atHour(11, 23),
    showAsHomepageBanner: true,
    showOnArticlesPage: true,
    branchIds: [branches[0].id],
    status: 'draf',
    updatedAt: nowISO(),
    updatedBy: 'Rudi H.',
  },
]

export const content: ContentItem[] = [...layananContent, ...cabangContent, ...dokterContent, ...pengumumanContent]
