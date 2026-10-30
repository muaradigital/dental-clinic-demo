export interface Branch {
  id: string
  slug: string
  name: string
  /** Short display code (e.g. "PK") used on dense grids like the Dokter & cuti weekly schedule. */
  code: string
  address: string
  whatsappNumber: string
  gmapsUrl?: string
  photoLabels: string[]
  isVisible: boolean
}
