export interface ClinicSettings {
  id: string
  name: string
  tagline: string
  hasMultipleBranches: boolean
  singleLocationAddress?: {
    address: string
    whatsappNumber: string
  }
  doctorReviewEnabled: boolean
  whatsappNumber: string
  consentRetentionMonths: number
}
