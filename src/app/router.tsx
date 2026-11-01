import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PublicLayout } from '@/layouts/PublicLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Beranda } from '@/pages/public/Beranda'
import { Layanan } from '@/pages/public/Layanan'
import { Dokter } from '@/pages/public/Dokter'
import { CabangIndex } from '@/pages/public/CabangIndex'
import { CabangDetail } from '@/pages/public/CabangDetail'
import { Tentang } from '@/pages/public/Tentang'
import { Privasi } from '@/pages/public/Privasi'
import { Reservasi } from '@/pages/public/Reservasi'
import { NotFound } from '@/pages/public/NotFound'
import { Login } from '@/pages/auth/Login'
import { JanjiHariIni } from '@/pages/dashboard/operational/JanjiHariIni'
import { JadwalSlot } from '@/pages/dashboard/operational/JadwalSlot'
import { DokterCuti } from '@/pages/dashboard/operational/DokterCuti'
import { Pengingat } from '@/pages/dashboard/operational/Pengingat'
import { UlasanGoogle } from '@/pages/dashboard/operational/UlasanGoogle'
import { Laporan } from '@/pages/dashboard/operational/Laporan'
import { PenggunaAudit } from '@/pages/dashboard/operational/PenggunaAudit'
import { KontenLayanan } from '@/pages/dashboard/content/KontenLayanan'
import { KontenCabang } from '@/pages/dashboard/content/KontenCabang'
import { KontenDokter } from '@/pages/dashboard/content/KontenDokter'
import { KontenPengumuman } from '@/pages/dashboard/content/KontenPengumuman'
import { KontenPratinjau } from '@/pages/dashboard/content/KontenPratinjau'
import { PratinjauQueue } from '@/pages/dashboard/content/PratinjauQueue'
import { RequireRole } from './RequireRole'
import { ScrollRestoration } from './ScrollRestoration'
import { DashboardIndexRedirect } from './DashboardIndexRedirect'

export const router = createBrowserRouter([
  {
    element: <ScrollRestoration />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { path: '/', element: <Beranda /> },
          { path: '/layanan', element: <Layanan /> },
          { path: '/dokter', element: <Dokter /> },
          { path: '/cabang', element: <CabangIndex /> },
          { path: '/cabang/:slug', element: <CabangDetail /> },
          { path: '/tentang', element: <Tentang /> },
          { path: '/privasi', element: <Privasi /> },
          { path: '/reservasi', element: <Reservasi /> },
          { path: '*', element: <NotFound /> },
        ],
      },
      {
        element: <AuthLayout />,
        children: [{ path: '/login', element: <Login /> }],
      },
      {
        path: '/dashboard',
        element: (
          <RequireRole>
            <DashboardLayout mode="operational" />
          </RequireRole>
        ),
        children: [
          { index: true, element: <DashboardIndexRedirect /> },
          {
            path: 'janji',
            element: (
              <RequireRole nav={{ mode: 'operational', key: 'janji' }}>
                <JanjiHariIni />
              </RequireRole>
            ),
          },
          {
            path: 'jadwal',
            element: (
              <RequireRole nav={{ mode: 'operational', key: 'jadwal' }}>
                <JadwalSlot />
              </RequireRole>
            ),
          },
          {
            path: 'dokter-cuti',
            element: (
              <RequireRole nav={{ mode: 'operational', key: 'dokter-cuti' }}>
                <DokterCuti />
              </RequireRole>
            ),
          },
          {
            path: 'pengingat',
            element: (
              <RequireRole nav={{ mode: 'operational', key: 'pengingat' }}>
                <Pengingat />
              </RequireRole>
            ),
          },
          {
            path: 'ulasan',
            element: (
              <RequireRole nav={{ mode: 'operational', key: 'ulasan' }}>
                <UlasanGoogle />
              </RequireRole>
            ),
          },
          {
            path: 'laporan',
            element: (
              <RequireRole nav={{ mode: 'operational', key: 'laporan' }}>
                <Laporan />
              </RequireRole>
            ),
          },
          {
            path: 'pengguna',
            element: (
              <RequireRole nav={{ mode: 'operational', key: 'pengguna' }}>
                <PenggunaAudit />
              </RequireRole>
            ),
          },
        ],
      },
      {
        path: '/dashboard/content',
        element: (
          <RequireRole>
            <DashboardLayout mode="content" />
          </RequireRole>
        ),
        children: [
          { index: true, element: <Navigate to="/dashboard/content/layanan" replace /> },
          {
            path: 'layanan',
            element: (
              <RequireRole nav={{ mode: 'content', key: 'layanan' }}>
                <KontenLayanan />
              </RequireRole>
            ),
          },
          {
            path: 'cabang',
            element: (
              <RequireRole nav={{ mode: 'content', key: 'cabang' }}>
                <KontenCabang />
              </RequireRole>
            ),
          },
          {
            path: 'dokter',
            element: (
              <RequireRole nav={{ mode: 'content', key: 'dokter' }}>
                <KontenDokter />
              </RequireRole>
            ),
          },
          {
            path: 'pengumuman',
            element: (
              <RequireRole nav={{ mode: 'content', key: 'pengumuman' }}>
                <KontenPengumuman />
              </RequireRole>
            ),
          },
          {
            path: 'pratinjau',
            element: (
              <RequireRole nav={{ mode: 'content', key: 'pratinjau' }}>
                <PratinjauQueue />
              </RequireRole>
            ),
          },
        ],
      },
      {
        path: '/dashboard/content/pratinjau/:contentId',
        element: (
          <RequireRole nav={{ mode: 'content', key: 'pratinjau' }}>
            <DashboardLayout mode="content" chromeless />
          </RequireRole>
        ),
        children: [{ index: true, element: <KontenPratinjau /> }],
      },
    ],
  },
])
