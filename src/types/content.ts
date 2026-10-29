export type ContentStatus = 'draf' | 'ditinjau' | 'tayang' | 'berakhir'

interface ContentItemBase {
  id: string
  title: string
  status: ContentStatus
  updatedAt: string
  updatedBy: string
  reviewerId?: string
  reviewNote?: string
}

export interface LayananContent extends ContentItemBase {
  type: 'layanan'
  serviceId: string
  body: string
  showOnWebsite: boolean
  showInReservation: boolean
  showPrice: boolean
}

export interface CabangContent extends ContentItemBase {
  type: 'cabang'
  branchId: string
  body: string
}

export interface DokterContent extends ContentItemBase {
  type: 'dokter'
  doctorId: string
  body: string
  showCredentialNumber: boolean
}

export type PengumumanType = 'pengumuman' | 'artikel' | 'event_promo'

export interface PengumumanContent extends ContentItemBase {
  type: 'pengumuman'
  announcementType: PengumumanType
  body: string
  publishAt?: string
  expireAt?: string
  showAsHomepageBanner: boolean
  branchIds: string[]
}

export type ContentItem = LayananContent | CabangContent | DokterContent | PengumumanContent
export type ContentType = ContentItem['type']
