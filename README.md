# Klinik Gigi Arunika — demo

Demo klikable untuk website + dasbor klinik gigi multi-cabang. Semua nama, alamat, dokter, dan data lain adalah **contoh**, dipakai untuk presentasi klien dan portofolio. Ini bukan fondasi produksi: tidak ada backend, tidak ada autentikasi sungguhan, tidak ada SSR.

## Menjalankan proyek

```bash
npm install
npm run dev      # dev server, default http://localhost:5173
npm run build    # typecheck (tsc -b) + build produksi ke dist/
npm run preview  # pratinjau hasil build
npm run lint      # oxlint
```

## Struktur proyek

```
src/
  app/            router.tsx (semua route), RequireRole.tsx (guard peran), ScrollRestoration.tsx
  layouts/        PublicLayout, AuthLayout, DashboardLayout (mode operasional/konten, bisa chromeless)
  pages/          satu file per layar: public/, auth/, dashboard/operational/, dashboard/content/
  components/
    primitives/   Button, StatusChip, Card, Stepper, Toggle, Tabs, Photo, Avatar, Section, NoticeBanner, TextField
    layout/       Header, Sidebar, Footer, WhatsAppFab, BranchSwitcherDropdown, RoleSwitcherDropdown, dll.
    public/       komponen khusus situs publik (BranchCard, ServiceCard, DoctorCard, FaqAccordion, dll.)
    reservation/  komponen alur reservasi
    dashboard/    komponen khusus dasbor (tabel, grafik, panel editor konten)
  data/
    seed/         data contoh (TypeScript, bukan JSON) — basis "Reset data demo"
    repositories/ satu-satunya cara komponen mengakses data (lihat di bawah)
  store/          useDemoStore.ts — Zustand + persist (localStorage), state sesi/demo yang bisa berubah
  hooks/          useReveal (scroll-reveal), usePrefersReducedMotion, useStickyHeader, useBranchScope
  lib/            permissions (ROLE_CONFIG), slots, status, content (alur status), date, csv, validation, dll.
  types/          semua tipe TypeScript, model data
docs/
  PLAN.md         rencana implementasi awal (Langkah 0)
  ASUMSI.md       setiap asumsi/keputusan yang menyimpang dari referensi desain
```

## Mengganti data contoh dengan API sungguhan

Komponen **tidak pernah** mengimpor `src/data/seed/*` secara langsung — semua akses data lewat fungsi di `src/data/repositories/*` (mis. `getBranches()`, `useAppointments()`, `createAppointment()`). Ini adalah titik seam yang disengaja: untuk memasang backend sungguhan nanti,

1. Buka file repository yang relevan (mis. `src/data/repositories/branchRepository.ts`).
2. Ganti isi fungsi `get*`/`use*` yang sekarang membaca `src/data/seed/*.ts` atau `useDemoStore` agar memanggil `fetch`/klien API Anda sebagai gantinya (untuk versi `use*` yang reaktif, bungkus dengan hook data-fetching pilihan Anda, mis. React Query).
3. Ganti fungsi penulis (`create*`, `update*`, `approve*`, dll.) agar memanggil endpoint API alih-alih `useDemoStore.getState().set(...)`.
4. **Komponen tidak perlu diubah sama sekali** — mereka hanya memanggil nama fungsi repository yang sama.

Pengecualian: teks statis murni (salinan pemasaran di `data/seed/homepage.ts` dan `data/seed/staticPages.ts`) diimpor langsung oleh halaman karena tidak difilter/diubah/di-overlay sesi — ini juga titik wajar untuk diganti dengan CMS/API konten nanti.

State sesi (peran aktif, cabang aktif, reservasi yang dibuat, status konten, log audit, dst.) hidup di `src/store/useDemoStore.ts`, dipersist ke `localStorage`. Tombol "Reset data demo" (halaman Pengguna & log audit, khusus Pemilik) mengembalikan semua ke `src/data/seed/*` dan menghapus `localStorage`.

## Catatan kepatuhan

Lihat `docs/ASUMSI.md` untuk daftar lengkap keputusan desain/implementasi yang menyimpang dari referensi. Aturan kepatuhan dari spesifikasi (tanpa kolom keluhan/riwayat kesehatan, tanpa testimoni/superlatif, harga tersembunyi, log audit tanpa nama/nomor pasien, laporan agregat saja) ditegakkan secara struktural di level tipe TypeScript di `src/types/`, bukan sekadar konvensi UI — lihat `AuditPayload` di `src/types/auditLog.ts` dan `Service` di `src/types/service.ts` sebagai contoh.
