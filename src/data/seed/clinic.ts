import type { ClinicSettings } from '@/types'

/**
 * "Mahardika" is a stand-in city name, replacing the design export's
 * literal "[Kota]" bracket placeholder in branch addresses — chosen to be
 * unambiguously fictional rather than naming a real Indonesian city.
 */
export const CITY_NAME = 'Mahardika'

export const clinicSettings: ClinicSettings = {
  id: 'clinic-arunika',
  name: 'Klinik Gigi Arunika',
  tagline: 'Klinik Gigi',
  hasMultipleBranches: true,
  // Populated up front so flipping to "Satu lokasi" always has a real
  // address to show — defaults to the Pusat Kota branch's own contact
  // details, a reasonable stand-in for "if this clinic were one location."
  singleLocationAddress: {
    address: `Jl. Contoh Raya No. 12, Kecamatan Tengah, ${CITY_NAME}`,
    whatsappNumber: '+62 812-0000-0001',
  },
  doctorReviewEnabled: true,
  whatsappNumber: '+62 812-0000-0001',
  // The design export's consent checkbox left "[12]" as a bracketed
  // placeholder number; 12 was already the concrete example shown, so it's
  // adopted as the real value rather than re-guessed.
  consentRetentionMonths: 12,
}
