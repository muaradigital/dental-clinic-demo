/**
 * Static marketing copy — not filtered, mutated, or session-overlaid, so it
 * doesn't need a repository wrapper; components import it directly.
 */

export const hero = {
  eyebrow: 'Klinik gigi · 3 cabang',
  headline: 'Perawatan gigi yang tertata, dari janji temu hingga kontrol.',
  headlineEmphasis: 'tertata',
  subcopy:
    'Pilih cabang terdekat, kenali dokternya, lalu reservasi jam kunjungan langsung di website.',
  floatingChips: [
    { icon: 'dot' as const, label: 'Slot jam tampil per cabang' },
    { icon: 'check' as const, label: 'Konfirmasi lewat WhatsApp' },
  ],
}

export const servicesIntro = {
  eyebrow: 'Layanan',
  title: 'Layanan gigi untuk berbagai kebutuhan.',
  subtitle:
    'Penjelasan bersifat edukatif. Rencana perawatan ditentukan dokter setelah pemeriksaan.',
}

export const branchesIntro = {
  eyebrow: 'Cabang kami',
  title: 'Pilih cabang yang paling dekat.',
  subtitle: 'Setiap cabang punya halaman, jam praktik, dan nomor WhatsApp sendiri.',
}

export const visitFlowIntro = {
  eyebrow: 'Alur kunjungan',
  title: 'Enam langkah dari reservasi sampai kontrol.',
  subtitle:
    'Gambaran singkat apa yang terjadi di setiap cabang, supaya Anda tahu apa yang diharapkan.',
}

export const doctorsIntro = {
  eyebrow: 'Tim dokter',
  title: 'Dokter yang praktik di cabang kami.',
}

export const doctorsCaption =
  'Inisial akan diganti foto profesional masing-masing dokter, bukan foto pasien.'

export const ctaBanner = {
  title: 'Reservasi jam kunjungan dalam beberapa langkah.',
  subtitle: 'Pilih cabang, layanan, tanggal, dan jam. Tanpa keluhan atau riwayat kesehatan pada tahap ini.',
  buttonLabel: 'Reservasi online',
}

export const visitSteps = [
  {
    number: '01',
    title: 'Janji temu',
    description: 'Pilih cabang, layanan, dan jam lewat reservasi online.',
    icon: 'calendar' as const,
  },
  {
    number: '02',
    title: 'Check-in & registrasi',
    description: 'Konfirmasi kedatangan di resepsionis cabang.',
    icon: 'clipboard-check' as const,
  },
  {
    number: '03',
    title: 'Pemeriksaan',
    description: 'Dokter memeriksa dan menanyakan kondisi Anda langsung.',
    icon: 'search' as const,
  },
  {
    number: '04',
    title: 'Diagnosis & persetujuan',
    description: 'Dokter menjelaskan rencana perawatan sebelum dimulai.',
    icon: 'file-check' as const,
  },
  {
    number: '05',
    title: 'Tindakan',
    description: 'Perawatan dilakukan sesuai yang telah disepakati.',
    icon: 'tool' as const,
  },
  {
    number: '06',
    title: 'Pembayaran & kontrol',
    description: 'Selesaikan administrasi dan atur jadwal kontrol.',
    icon: 'receipt' as const,
  },
]

export const footerDisclaimer =
  'Informasi di website ini bersifat edukatif dan bukan pengganti pemeriksaan oleh dokter gigi. © 2026 Klinik Gigi Arunika (nama dan data contoh).'

export const demoDataLabel = 'Demo: data contoh'

export const reservationWarning =
  'Jangan menulis keluhan atau riwayat kesehatan di sini. Dokter akan menanyakannya saat pemeriksaan.'
