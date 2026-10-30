/**
 * Content for the four public pages with no design-export reference
 * (/layanan, /dokter, /tentang, /privasi) — ported from klinik-mockup.html's
 * old-themed equivalent routes and re-skinned to the current design system.
 * Static marketing/legal copy, not filtered or mutated, so no repository
 * wrapper — imported directly, same convention as homepage.ts.
 */
import { CITY_NAME } from './clinic'

export const layananPage = {
  eyebrow: 'Layanan',
  title: 'Layanan',
  lead: 'Informasi umum tentang layanan. Setiap tindakan ditentukan oleh dokter setelah pemeriksaan, dan hasil dapat berbeda pada tiap pasien.',
}

export const dokterPage = {
  eyebrow: 'Dokter',
  title: 'Dokter',
  lead: 'Jadwal praktik dapat berubah. Admin cabang akan mengonfirmasi saat Anda melakukan reservasi.',
}

export const tentangPage = {
  eyebrow: 'Tentang & FAQ',
  title: 'Tentang klinik',
  intro: `Klinik Gigi Arunika adalah klinik gigi dengan tiga cabang di ${CITY_NAME}. Kami berfokus pada pelayanan yang tertata, komunikasi yang jelas, dan privasi pasien.`,
  workingHeading: 'Cara kami bekerja',
  workingPoints: [
    'Reservasi dibuat langsung lewat website, lalu dikonfirmasi admin cabang.',
    'Website tidak menyimpan data kesehatan apa pun.',
    'Seluruh konten ditinjau dokter sebelum tayang.',
  ],
  summaryTitle: 'Ringkasan',
  summaryPoints: [
    { icon: 'pin' as const, text: '3 cabang dengan jam praktik masing-masing' },
    { icon: 'calendar' as const, text: 'Dokter umum dan spesialis' },
    { icon: 'whatsapp-check' as const, text: 'Konfirmasi melalui WhatsApp' },
  ],
  faqEyebrow: 'FAQ',
  faqTitle: 'Pertanyaan umum',
}

export const faq: { question: string; answer: string }[] = [
  {
    question: 'Bagaimana cara melakukan reservasi?',
    answer:
      'Buka halaman Reservasi, pilih cabang, kategori layanan, tanggal, dan jam. Isi nama serta nomor WhatsApp, lalu kirim. Admin cabang akan mengonfirmasi.',
  },
  {
    question: 'Apakah website menyimpan data saya?',
    answer:
      'Data yang Anda isi di formulir reservasi disimpan untuk keperluan konfirmasi dan pengingat janji sesuai masa retensi yang Anda setujui saat mengisi formulir.',
  },
  {
    question: 'Mengapa tidak ada kolom keluhan?',
    answer:
      'Demi privasi. Mohon tidak menuliskan keluhan atau riwayat kesehatan pada formulir reservasi. Dokter akan menanyakannya saat pemeriksaan.',
  },
  {
    question: 'Kapan reservasi saya dikonfirmasi?',
    answer: 'Admin cabang akan membalas pada jam kerja untuk mengonfirmasi ketersediaan jadwal.',
  },
  {
    question: 'Apakah jadwal dokter bisa berubah?',
    answer: 'Bisa. Jadwal praktik dapat berubah sewaktu-waktu. Admin cabang akan menginformasikan saat konfirmasi.',
  },
  {
    question: 'Apakah informasi di website ini pengganti pemeriksaan?',
    answer: 'Tidak. Seluruh informasi bersifat edukatif dan tidak menggantikan pemeriksaan oleh dokter gigi.',
  },
]

export const privasiPage = {
  title: 'Kebijakan privasi',
  intro: 'Ringkasan contoh (data demo, perlu ditinjau ahli hukum sebelum dipakai di situs sungguhan).',
  sections: [
    {
      heading: 'Data yang dikumpulkan',
      body: 'Formulir reservasi mengumpulkan nama dan nomor WhatsApp untuk keperluan konfirmasi dan pengingat janji, sesuai masa retensi yang Anda setujui.',
    },
    {
      heading: 'Data kesehatan',
      body: 'Website tidak menyediakan kolom keluhan, gejala, atau riwayat penyakit. Mohon tidak mengirimkannya melalui formulir reservasi maupun WhatsApp.',
    },
    {
      heading: 'Analitik',
      body: 'Kami hanya mencatat peristiwa agregat seperti jumlah reservasi per sumber, tanpa data pribadi di dalamnya.',
    },
    {
      heading: 'Pengendali data',
      body: 'Klinik bertindak sebagai pengendali data. Hubungi cabang untuk pertanyaan terkait data Anda.',
    },
  ],
}
