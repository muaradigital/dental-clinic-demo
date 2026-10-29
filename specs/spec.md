# Tugas: Bangun website demo klinik gigi (React)

## Konteks

Demo klikable untuk klinik gigi multi-cabang "Klinik Gigi Arunika" (semua nama, alamat, dan data adalah contoh). Demo ini dipakai untuk presentasi ke klien dan portofolio. Ini BUKAN fondasi produksi. Jangan menambah backend, autentikasi sungguhan, atau SSR.

## Input (baca semuanya dulu sebelum menulis kode)

1. `specs/klinik-mockup.html`: mockup satu file. SUMBER ANIMASI. Tema dan fiturnya sudah usang.
2. `specs/references/`: hasil ekspor desain terbaru (HTML per layar). SUMBER TEMA, LAYOUT, DAN FITUR. Kalau bentuk file-nya tidak lazim (custom element, placeholder `{{ }}`), perlakukan sebagai acuan visual dan struktur, bukan kode untuk dijalankan.
3. Jika dua sumber bertentangan, desain terbaru menang. Pengecualian: animasi dari mockup tetap dipakai.

## Langkah 0 (wajib, sebelum coding)

Buat `docs/PLAN.md` berisi:

- Inventaris animasi di `klinik-mockup.html` (nama, elemen, trigger, durasi/easing, cara implementasi: CSS/JS) dan keputusan tiap animasi: dipertahankan, diadaptasi ke layout baru, atau dibuang (beri alasan).
- Inventaris layar dari design export dan pemetaan ke route.
- Daftar token desain (warna, font, radius, spacing) yang diambil dari design export.
- Struktur folder, model data, dan urutan pengerjaan.
  Berhenti dan tunjukkan ringkasannya ke saya sebelum lanjut ke implementasi.

## Stack

Vite + React + TypeScript + Tailwind CSS + React Router. State bersama dengan Zustand atau Context, disimpan ke `localStorage`. Tanpa backend. Deploy statis (Vercel/Netlify/Cloudflare Pages). Font: Fraunces (heading) dan Plus Jakarta Sans (isi).

## Tema dan visual

Ikuti design export: palet teal + pasir + ivory, satu aksen teal (tanpa hijau kedua), dark `#0f2a2e` untuk sidebar/footer/section kontras. Definisikan sebagai token di konfigurasi Tailwind, jangan hardcode hex berulang. Avatar/thumbnail placeholder harus dalam palet yang sama. Sediakan tempat foto (komponen `Photo` dengan fallback) supaya foto asli bisa dipasang nanti.

## Animasi

Pertahankan animasi dari mockup (hasil inventaris Langkah 0), diadaptasi ke komponen React:

- Scroll-reveal dengan `IntersectionObserver` (satu hook `useReveal`, jangan duplikasi per komponen).
- Hormati `prefers-reduced-motion`: matikan animasi non-esensial.
- Animasi tidak boleh membuat konten tersembunyi saat JS gagal atau saat screenshot penuh halaman.
- Jaga performa: animasi hanya `transform` dan `opacity`.

## Aplikasi dan route

**Situs publik** (layout publik, navigasi: Beranda, Layanan, Dokter, Cabang, Tentang & FAQ, Reservasi):

- `/` Beranda: hero, kartu cabang (jam hari ini dan status "Buka sekarang" dihitung dari data), alur kunjungan 6 langkah (grid 3x2), layanan (grid 4 kolom), dokter, banner reservasi, footer.
- `/cabang/:slug` Halaman cabang: peta placeholder, foto fasilitas, jam praktik, dokter yang praktik, tombol rute Google Maps.
- `/reservasi` Reservasi online: pilih cabang, kategori layanan, tanggal (7 hari), slot jam, data kontak (nama + nomor WhatsApp), checkbox persetujuan penyimpanan data, tombol aktif hanya jika valid. Aturan slot: Minggu tutup, jam per cabang mengikuti jam praktik, sebagian slot berstatus "penuh" (dihitung deterministik dari data, bukan acak), slot yang sudah dipesan di sesi ini ikut jadi penuh.
- Halaman Layanan, Dokter, Tentang & FAQ, Kebijakan privasi.

**Dasbor operasional** (layout dasbor, sidebar gelap, ada pemilih cabang):

- Janji hari ini (resepsionis), Jadwal & slot, Dokter & cuti, Pengingat, Ulasan Google, Laporan (agregat), Pengguna & log audit.
- Dasbor menampilkan reservasi yang dibuat dari `/reservasi` (alur ujung ke ujung): janji baru muncul, statusnya bisa diubah, dan perubahan tercatat di log audit.

**Dasbor konten website** (Tahap 1):

- Layanan, Cabang, Profil dokter, Pengumuman & artikel, Pratinjau & tinjauan.
- Alur status konten: Draf → Ditinjau → Tayang. Konten dengan narasi kesehatan (layanan, profil dokter, pengumuman/artikel/event) memakai tiga tahap. Cabang hanya Draf → Tayang. Pengaturan "Tinjauan dokter" (aktif/nonaktif) ada di halaman Pengguna. Kalau nonaktif, semua jadi Draf → Tayang dan muncul peringatan tanggung jawab.
- Pratinjau: toggle Desktop/Mobile. Daftar periksa 4 poin; tombol "Setujui & tayangkan" aktif hanya jika semuanya dicentang. "Minta revisi" mengembalikan ke Draf.
- Konten yang berstatus Tayang benar-benar mengubah situs publik (mis. pengumuman tayang muncul sebagai banner di Beranda).
- Saklar "Klinik memiliki cabang": jika "Satu lokasi", menu/halaman cabang dan pilihan cabang di reservasi disembunyikan, alamat langsung tampil. Saklar per cabang mengatur apakah cabang tampil.

**Pemilih peran** (pengganti login) di dasbor: Pemilik, Admin cabang, Resepsionis, Peninjau (dokter). Menu dan hak akses menyesuaikan sesuai tabel di halaman Pengguna. Admin cabang hanya melihat cabangnya.
terdapat halaman login juga

## Data dummy

- Semua di `src/data/*.ts` dengan tipe TypeScript: klinik, cabang, layanan, dokter, jadwal praktik, cuti, janji, ulasan, konten, pengguna, log audit.
- Bentuknya meniru respons API masa depan. Akses lewat fungsi repository (mis. `getBranches()`), bukan impor langsung di komponen, supaya mudah diganti dengan fetch.
- Pertahankan data contoh dari design export (3 cabang, 4 dokter, 8 layanan, jam praktik, nama pengguna). Sumber tunggal untuk jam praktik dan hari praktik dokter: halaman publik, reservasi, dan dasbor harus membaca data yang sama, jangan ada salinan ganda.
- Tombol "Reset data demo" yang mengembalikan semua ke keadaan awal. Tanggal "hari ini" dihitung dari jam sistem, bukan di-hardcode.

## Aturan kepatuhan (jangan dilanggar)

- Tidak ada kolom keluhan atau riwayat kesehatan di mana pun. Tampilkan peringatan "jangan menulis keluhan" di form reservasi.
- Tidak ada testimoni, foto sebelum-sesudah, kata superlatif ("terbaik", "termurah", "dijamin"), atau label diskon besar. Event promo hanya edukasi/pemeriksaan.
- Harga layanan default tersembunyi.
- Log audit tidak memuat nama atau nomor pasien, hanya nomor janji.
- Laporan hanya agregat, tanpa nama dan nomor.
- Footer memuat disclaimer edukatif. Beri label "Demo: data contoh" yang tidak mengganggu.

## Kualitas

- Responsif dari 360 px sampai 1440 px. Tidak ada scroll horizontal di halaman.
- Aksesibilitas dasar: kontras cukup, teks isi minimal 14 px, fokus keyboard terlihat, `aria-*` pada saklar dan tab, semua kontrol bisa dioperasikan lewat keyboard.
- Satu istilah untuk aksi utama: "Reservasi" (nav) dan "Reservasi online" (tombol). Jangan campur dengan "Buat janji".
- Komponen bersama: Button, Chip, Card, Stepper, Toggle (role="switch"), Tabs, Photo, Section, Layout. Tidak ada blok markup besar yang diduplikasi.

## Cara kerja

- Kerjakan per potongan vertikal dan commit tiap potongan, urutan: (1) kerangka + token + layout + data; (2) Beranda dengan animasi; (3) Reservasi + store; (4) Dasbor janji + log audit; (5) dasbor lainnya; (6) dasbor konten + pratinjau; (7) polesan, responsif, aksesibilitas.
- Setelah tiap potongan: jalankan build, lint, dan type-check. Buka halamannya di browser (Playwright) pada lebar 1440 dan 390, ambil screenshot, dan bandingkan dengan design export. Perbaiki selisihnya sebelum lanjut.
- Jangan mengklaim selesai tanpa bukti (screenshot atau hasil perintah). Jika ada asumsi atau bagian yang tidak bisa dipenuhi, tulis di `docs/ASUMSI.md`.

## Definisi selesai

- Alur ujung ke ujung berjalan: buat reservasi di situs publik → muncul di dasbor → ubah status → tercatat di log audit.
- Alur konten berjalan: buat draf → ajukan tinjauan → peninjau menyetujui → tampil di situs publik; saklar "Satu lokasi" menyembunyikan fitur cabang.
- Animasi dari mockup aktif dan tidak merusak performa maupun aksesibilitas.
- `npm run build` bersih, tidak ada error TypeScript, tidak ada error konsol.
- `README.md` berisi cara menjalankan, struktur proyek, dan cara mengganti data dummy dengan API.
