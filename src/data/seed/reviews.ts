import { addDays, now } from '@/lib/date'
import type { Review } from '@/types'

function daysAgoISO(days: number): string {
  return addDays(now(), -days).toISOString()
}

/** Populated with realistic sample rows in Slice 5 (Ulasan Google). */
export const reviews: Review[] = [
  {
    id: 'review-1',
    branchId: 'branch-pusat-kota',
    authorInitial: 'Rina A.',
    rating: 5,
    text: 'Pelayanan ramah, dokter menjelaskan dengan jelas sebelum tindakan. Ruang tunggu juga nyaman.',
    createdAt: daysAgoISO(4),
    replyStatus: 'belum dibalas', // > 48h, counts as terlambat
  },
  {
    id: 'review-2',
    branchId: 'branch-pusat-kota',
    authorInitial: 'Budi S.',
    rating: 4,
    text: 'Booking online praktis, tidak perlu antre lama di tempat. Terima kasih.',
    createdAt: daysAgoISO(1),
    replyStatus: 'belum dibalas', // < 48h, not yet late
  },
  {
    id: 'review-3',
    branchId: 'branch-timur',
    authorInitial: 'Maya P.',
    rating: 5,
    text: 'Dokter anak di sini sabar sekali menghadapi anak saya yang takut ke dokter gigi.',
    createdAt: daysAgoISO(6),
    replyStatus: 'sudah dibalas',
    replyText: 'Terima kasih atas ulasannya. Senang mendengar pengalaman yang nyaman di cabang kami.',
  },
  {
    id: 'review-4',
    branchId: 'branch-timur',
    authorInitial: 'Andi R.',
    rating: 3,
    text: 'Waktu tunggu agak lama dari jam yang dijadwalkan, tapi hasil pemeriksaan cukup memuaskan.',
    createdAt: daysAgoISO(3),
    replyStatus: 'draf balasan',
    replyText: 'Terima kasih atas masukannya. Kami akan terus memperbaiki ketepatan waktu pelayanan.',
  },
  {
    id: 'review-5',
    branchId: 'branch-barat',
    authorInitial: 'Dewi K.',
    rating: 5,
    text: 'Lokasinya mudah dijangkau dan parkirnya luas. Prosesnya juga cepat.',
    createdAt: daysAgoISO(0),
    replyStatus: 'belum dibalas',
  },
  {
    id: 'review-6',
    branchId: 'branch-barat',
    authorInitial: 'Tono W.',
    rating: 4,
    text: 'Reservasi lewat website gampang, konfirmasi lewat WhatsApp juga cepat dibalas.',
    createdAt: daysAgoISO(5),
    replyStatus: 'sudah dibalas',
    replyText: 'Terima kasih sudah mempercayakan jadwal kunjungan Anda kepada kami.',
  },
  {
    id: 'review-7',
    branchId: 'branch-pusat-kota',
    authorInitial: 'Lia N.',
    rating: 4,
    text: 'Fasilitas bersih dan staf cukup informatif soal alur kunjungan.',
    createdAt: daysAgoISO(2),
    replyStatus: 'belum dibalas',
  },
]
