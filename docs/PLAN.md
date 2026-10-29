# Klinik Gigi Arunika — rencana implementasi (Langkah 0)

> Ini adalah demo klikable, bukan fondasi produksi. Tanpa backend, tanpa autentikasi sungguhan, tanpa SSR.

## 1. Inventaris animasi (`specs/klinik-mockup.html`) + keputusan

Mockup adalah SPA hash-router vanilla JS. Satu hook `useReveal` akan membungkus satu `IntersectionObserver` bersama (`threshold:.12, rootMargin:'0px 0px -40px 0px'`, reveal-once via `unobserve`), plus pengecekan `prefers-reduced-motion`.

**Dipertahankan** (diimplementasikan ulang di React/Tailwind, timing & easing sama):

| Animasi | Elemen | Trigger | Durasi/easing | Implementasi |
|---|---|---|---|---|
| Scroll reveal fade-up | class `.rv`, stagger `.d1/.d2/.d3` | `IntersectionObserver`, sekali | `opacity .9s`/`transform .9s cubic-bezier(.2,.8,.2,1)`, `translateY(34px)→0` | Hook `useReveal` + CSS transition |
| Card hover lift | `.card`/`.lift` (branch/service/doctor card) | hover | `transform .45s`, `translateY(-8px)` + shadow `rgba(15,60,60,.35)` | CSS transition |
| Button hover (lift + shine + icon nudge) | `.btn` | hover | lift `.3s`, shine sweep `.7s`, icon `.3s` | CSS pseudo-element + transition |
| Sticky header blur-on-scroll | `header.nav` → `.scrolled` | scroll listener, `scrollY>20` | `.4s` | `useStickyHeader` hook + CSS transition |
| FAQ accordion | native `<details>/<summary>` | native click | `.3s` border/shadow, `+`→`×` rotate | Native semantics, no JS |
| Segmented control checked state | radio + sibling label | native click | `.25s` | CSS, or controlled React state |
| Focus glow | input/select | focus | `.25s` | CSS `:focus` |
| WhatsApp FAB | `.fab` | load (pulse loop) + hover (scale/rotate) + hover (tooltip slide) | pulse `2.4s`, hover `.3s` | CSS `@keyframes` + transition |
| Ambient hero decor (blob drift, tooth float, counter-rotating rings, twinkling sparkles, chip float) | hero SVG/divs | load, infinite loop | `6–40s` various | Pure CSS `@keyframes` on `transform`/`opacity` only — all killed by `prefers-reduced-motion` since purely decorative |
| SPA route transition | page wrapper | route change | fade-slide-in `.6s`, paired with **instant** (not smooth) scroll-to-top | CSS `@keyframes` + router effect |
| Mobile menu slide-fade | `nav.links` → `.open` | burger click | `.35s` | CSS transition + JS toggle. **Gap fix**: mockup never wrote the hamburger→X icon morph rule despite having the transition hook — added in the rewrite. |

**Diadaptasi:**
- Hero headline SVG stroke "draw-on" underline (`stroke-dasharray/dashoffset`) — mekanisme sama, headline/layout baru.
- Map-marker radar pulse — mockup pakai SVG SMIL `<animate>` (dukungan browser tidak konsisten) → diganti CSS `@keyframes` (scale+opacity) pada elemen circle.

**Dibuang:**
- `.marquee` ticker — CSS ada tapi class tidak pernah dipakai di elemen manapun di seluruh file (dead code, bukan fitur yang pernah tayang). Tidak dihidupkan kembali.

**Aturan lintas-animasi**: hanya `transform`/`opacity` untuk performa; `useReveal` default **visible**, opt-in ke hidden (kebalikan dari mockup) supaya konten tidak pernah tersembunyi kalau JS gagal atau saat screenshot penuh halaman; semua animasi non-esensial masuk ke dalam `@media(prefers-reduced-motion:reduce)` kill-switch.

## 2. Inventaris layar → pemetaan route

| Layar (folder referensi) | Route | Layout |
|---|---|---|
| Beranda (desktop) | `/` | Publik |
| Halaman cabang | `/cabang/:slug` (+ `/cabang` index ditambahkan — nav "Cabang" butuh halaman tujuan) | Publik |
| Reservasi online | `/reservasi` | Publik |
| *(tanpa referensi desain — diporting dari mockup)* | `/layanan`, `/dokter`, `/tentang`, `/privasi` | Publik |
| Masuk panel (login) | `/masuk` | Auth (tanpa nav) |
| Dasbor resepsionis | `/dasbor/janji` | Dasbor (operasional) |
| Dasbor Jadwal & slot | `/dasbor/jadwal` | Dasbor (operasional) |
| Dasbor Dokter & cuti | `/dasbor/dokter-cuti` | Dasbor (operasional) |
| Dasbor Pengingat | `/dasbor/pengingat` | Dasbor (operasional) |
| Dasbor Ulasan Google | `/dasbor/ulasan` | Dasbor (operasional) |
| Dasbor Laporan | `/dasbor/laporan` | Dasbor (operasional) |
| Dasbor Pengguna & log audit | `/dasbor/pengguna` | Dasbor (operasional) |
| Konten Layanan/Cabang/Profil dokter/Pengumuman | `/dasbor/konten/{layanan,cabang,dokter,pengumuman}` | Dasbor (konten) |
| Konten Pratinjau & tinjauan | `/dasbor/konten/pratinjau/:contentId` | Dasbor, chromeless (tanpa sidebar, sesuai referensi) |

Tidak menambahkan `/syarat` (terms of use) — ada di mockup lama tapi di luar daftar halaman eksplisit spec.

Semua `/dasbor/*` dibungkus guard `RequireRole` yang digerakkan oleh satu objek `ROLE_CONFIG`, supaya Sidebar, route guard, dan tabel hak akses di halaman Pengguna tidak pernah berbeda satu sama lain.

## 3. Token desain (dari design export, bukan hex berulang di komponen)

- Font: `Fraunces` (500/600, heading/angka besar), `Plus Jakarta Sans` (400–700, body/UI)
- ivory bg `#f7f5ef` (dasbor `#f1efe8`), surface `#fff` / border `#e3e0d5`
- ink `#0f2a2e` (teks + bg section gelap), muted `#5b7074`
- teal: `#0f766e` primer, `#14b8a6` terang, `#5eead4` di atas gelap, `#0b5a53` teks soft-success
- mint: `#d8f3ec` `#cdeee6` `#eaf8f4` `#e4f3ee`; sand: `#efe9dc` bg section, `#f4e6c8`/`#a8925a`/`#e6d3a0`
- gradient CTA `linear-gradient(140deg,#0c3b3a,#0f5f5a 60%,#117a70)`; panel login `linear-gradient(150deg,#0c2f30,#0f2a2e 55%,#0f5f5a)`
- status: sukses `#dcf2dd/#14532d`, soft-teal `#d8f3ec/#0b5a53`, **warning `#fff1d0/#6c4a00`** (dikanonisasi — referensi juga memakai `#fdecc8/#7a4b00` di dua layar secara inkonsisten, satu pasangan dipilih), danger `#fde0dc/#8a1c12`, netral `#ece9df/#3a4f53`, indigo `#e4e9fb/#2b3a8a`, berakhir `#e6e8ea/#475569`
- notice/banner peringatan: bg `#fff7e2`, border `#f0dca0`, teks `#6c5513`
- radius: pill `999px`, card `20–24px`, banner CTA `32px`, input `14px`, avatar `50%`
- shadow selalu bertinta `rgba(15,60,60,alpha)`, bukan hitam murni
- spacing: container `max-width:1200px; px:40px`; padding section `72–96px`; padding card `22–28px`; gap `16–22px`

## 4. Struktur folder, model data, urutan pengerjaan

```
src/
  app/            router.tsx, RequireRole.tsx, ScrollRestoration.tsx
  pages/public/   pages/auth/   pages/dashboard/{operational,content}/
  layouts/        PublicLayout, AuthLayout, DashboardLayout(mode, chromeless?)
  components/
    primitives/   Button, StatusChip, Card, Stepper, Toggle, Tabs, Photo, Avatar, Section, NoticeBanner, TextField
    layout/       Header, MobileMenu, Footer, WhatsAppFab, Sidebar, BranchSwitcherDropdown, RoleSwitcherDropdown
    public/ reservation/ dashboard/{shared,operational,content}/
  data/seed/*.ts  data/repositories/*.ts   (komponen memanggil repository, tidak pernah impor array seed langsung)
  store/useDemoStore.ts     (zustand + persist)
  hooks/          useReveal, usePrefersReducedMotion, useStickyHeader, useBranchScope
  lib/            date, slots, status, permissions, content, csv, validation
  types/
```

**Keputusan model data kunci:**
- `PracticeHours` adalah **satu sumber tunggal** yang dibaca kartu cabang beranda, pemilih slot reservasi, dan dasbor — tidak pernah diduplikasi.
- `Doctor.branchIds` tidak pernah disimpan — selalu diturunkan dari `doctor.schedule`.
- Fakta statis (Branch/Service/Doctor) dipisah dari konten yang bisa diedit (`ContentItem`, union diskriminasi per tipe konten dengan status Draf/Ditinjau/Tayang). Setiap entitas disemai dengan `ContentItem` dasar yang sudah `'tayang'`, agar situs publik tidak terlihat kosong sebelum dasbor konten disentuh.
- Keamanan PII log audit bersifat struktural: `addAuditLog()` hanya menerima union `AuditPayload` bertipe (tidak ada parameter teks bebas yang bisa membawa nama pasien). Ekspor CSV memetakan ke tipe baris yang secara struktur tidak memiliki field nama/nomor.
- `Service` tidak memiliki field harga sama sekali di tipenya — "harga tersembunyi secara default" ditegakkan dengan tidak pernah memodelkan harga yang bisa dirender, bukan dengan flag UI.
- Zustand store = state sesi/demo yang bisa berubah (peran, cabang aktif, janji, status konten, pengingat terkirim, balasan ulasan, log audit), dipersist ke localStorage; `data/seed/*` = baseline beku yang dipulihkan oleh `resetDemoData()`.

**Model peran/hak akses** — satu `ROLE_CONFIG` di `lib/permissions.ts`:

| Peran | Lingkup cabang | 2FA | Landing |
|---|---|---|---|
| Pemilik | semua (switcher aktif) | ya | `/dasbor/janji` |
| Admin cabang | terkunci ke cabang sendiri | tidak | `/dasbor/janji` |
| Resepsionis | terkunci ke cabang sendiri | tidak | `/dasbor/janji` |
| Peninjau (dokter) | semua (switcher aktif) | ya | `/dasbor/konten/pratinjau` |

Login (per referensi: pilih peran cepat, email/password terisi, OTP untuk peran ber-MFA, langkah sukses) mengatur peran/cabang aktif ke store. Dasbor juga menyimpan switcher peran+cabang permanen di sidebar (mengganti pill statis read-only di referensi dengan dropdown sungguhan) agar peran bisa diganti instan tanpa logout ulang — ini realisasi dari "Pemilih peran ... di dasbor" pada spec baris 62; halaman login adalah pintu masuk yang diminta terpisah pada baris 63.

Kolom **Peninjau ditambahkan** sebagai kolom ke-4 pada tabel hak akses di halaman Pengguna (referensi hanya punya 3 kolom), supaya tabel tidak kontradiktif dengan `ROLE_CONFIG`.

**Urutan pengerjaan (7 potongan vertikal, commit per potongan):**
1. Kerangka + token + layout + data — init Vite/React/TS/Tailwind, `git init`, token Tailwind, font, semua `types/*`, `data/seed/*` lengkap, repository baca-saja, skeleton store, semua primitive, 3 layout, router dengan semua route (termasuk 4 halaman publik yang kontennya diporting nanti, supaya nav tidak pernah 404).
2. Beranda + animasi — hook animasi, hero, kartu cabang status live, alur 6 langkah, grid layanan/dokter, banner CTA, footer (disclaimer + "Demo: data contoh"), header + menu mobile dengan morph ikon, FAB WhatsApp.
3. Reservasi + store — formula slot penuh deterministik + overlay sesi, banner peringatan keluhan, status Minggu/penuh nonaktif, submit tergate.
4. Dasbor janji + log audit (potongan integrasi kritis) — AuthLayout + Login lengkap, DashboardLayout final (switcher cabang terkunci/aktif, switcher peran), `RequireRole`, Janji hari ini (`<table>` sungguhan, ekspor CSV aman-PII), Pengguna & log audit (tabel pengguna, matriks 4 kolom, toggle Tinjauan dokter, log audit). Cek ujung-ke-ujung: reservasi dari potongan 3 muncul di sini, perubahan status menghasilkan entri audit berisi hanya nomor janji.
5. Dasbor operasional lain — Jadwal & slot, Dokter & cuti (+ dampak cuti terhitung), Pengingat, Ulasan Google, Laporan (agregat saja).
6. Dasbor konten + pratinjau — logika pipeline konten (koleps tinjauan dokter, Cabang permanen 2 langkah, status "Berakhir" Pengumuman), 4 editor konten, Pratinjau chromeless dengan checklist 4 poin yang menggerbang tayang. Pengumuman banner beranda yang tayang harus benar-benar muncul di Beranda. Saklar "Satu lokasi" mengubah nav publik + pemilih cabang di reservasi.
7. Polesan — porting + re-skin 4 halaman publik tanpa referensi dari mockup lama, responsif/keyboard/reduced-motion penuh, "Reset data demo", `README.md` dan `docs/ASUMSI.md`.

**Verifikasi per potongan**: `npm run build && eslint && tsc --noEmit` bersih, tanpa error konsol; screenshot Playwright 1440px & 390px dibandingkan referensi yang sesuai (self-consistency saja untuk 4 halaman porting, karena tidak ada referensi untuk dibandingkan); khusus potongan 4, pengecekan langsung bahwa tidak ada entri audit/ekspor CSV yang memuat nama atau nomor pasien.
