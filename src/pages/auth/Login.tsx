import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, NoticeBanner } from '@/components/primitives'
import { Logo } from '@/components/layout/Logo'
import { getBranchById } from '@/data/repositories/branchRepository'
import { users } from '@/data/seed/users'
import { ROLE_CONFIG, ROLE_ORDER } from '@/lib/permissions'
import { cn } from '@/lib/cn'
import { formatLongDateID, formatTimeID } from '@/lib/date'
import { useDemoStore } from '@/store/useDemoStore'
import type { RoleId } from '@/types'

const ROUTE_LABELS: Record<string, string> = {
  '/dasbor/janji': 'Janji hari ini',
  '/dasbor/konten/pratinjau': 'Antrean tinjauan konten',
}

const VALUE_PROPS = [
  {
    d: 'M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM5 21c0-4 3-6 7-6s7 2 7 6',
    title: 'Akses sesuai peran',
    desc: 'Admin cabang hanya melihat data cabangnya sendiri.',
  },
  {
    d: 'M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z',
    title: 'Verifikasi dua langkah',
    desc: 'Wajib untuk pemilik dan peninjau konten.',
  },
  {
    d: 'M5 4h14v16H5zM9 9h6M9 13h6',
    title: 'Aktivitas tercatat',
    desc: 'Log audit hanya memuat nomor janji, bukan nama atau nomor pasien.',
  },
] as const

const OTP_DIGITS = ['4', '8', '1', '7', '0', '2']

type Step = 'form' | 'otp' | 'done'

const inputClasses =
  'w-full rounded-input border-[1.5px] border-border bg-ivory-input px-3.5 py-3 text-sm text-ink transition-colors duration-200 focus:border-teal-bright focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-bright/15'

export function Login() {
  const navigate = useNavigate()
  const login = useDemoStore((s) => s.login)
  const logout = useDemoStore((s) => s.logout)
  const latestAuditEntry = useDemoStore((s) => s.auditLog[0])

  const [step, setStep] = useState<Step>('form')
  const [selectedRole, setSelectedRole] = useState<RoleId>('pemilik')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberDevice, setRememberDevice] = useState(false)

  const selectedUser = users.find((u) => u.role === selectedRole)
  const roleConfig = ROLE_CONFIG[selectedRole]
  const landingLabel = ROUTE_LABELS[roleConfig.defaultLandingRoute] ?? roleConfig.defaultLandingRoute
  const scopeLabel =
    roleConfig.branchScope === 'all' ? 'Semua cabang' : getBranchById(selectedUser?.branchId ?? '')?.name ?? 'Cabang tidak diketahui'

  useEffect(() => {
    if (step !== 'done') return
    const timer = window.setTimeout(() => navigate(roleConfig.defaultLandingRoute), 1600)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  function handleSubmit() {
    if (!selectedUser) return
    if (roleConfig.mfaRequired) {
      setStep('otp')
    } else {
      login(selectedUser.id)
      setStep('done')
    }
  }

  function handleVerifyOtp() {
    if (!selectedUser) return
    login(selectedUser.id)
    setStep('done')
  }

  function handleRestartDemo() {
    logout()
    setStep('form')
    setSelectedRole('pemilik')
    setShowPassword(false)
    setRememberDevice(false)
  }

  return (
    <div className="flex min-h-screen flex-wrap">
      {/* Panel kiri */}
      <div
        className="relative flex min-w-0 flex-1 basis-[520px] flex-col overflow-hidden px-8 py-10 text-white md:px-14 md:py-12"
        style={{ background: 'linear-gradient(150deg,#0c2f30,#0f2a2e 55%,#0f5f5a)' }}
      >
        <div
          aria-hidden
          className="absolute -bottom-32 -right-36 h-[420px] w-[420px] rounded-full opacity-20 blur-[90px]"
          style={{ background: '#14b8a6' }}
        />
        <div className="relative">
          <Logo onDark size="lg" />
          <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-on-dark-muted">Panel klinik</p>
        </div>

        <div className="relative my-auto max-w-[460px] py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-on-dark">Khusus staf klinik</p>
          <h1 className="my-3 font-display text-[40px] font-medium leading-[1.1] md:text-[46px]">
            Masuk untuk mengelola janji dan konten.
          </h1>
          <div className="mt-7 flex max-w-[440px] flex-col gap-4">
            {VALUE_PROPS.map((point) => (
              <div key={point.title} className="flex items-start gap-3.5">
                <span className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[11px] border border-white/16 bg-white/10">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5eead4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={point.d} />
                  </svg>
                </span>
                <div>
                  <p className="text-[15px] font-semibold">{point.title}</p>
                  <p className="text-sm text-on-dark">{point.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-on-dark-muted">Demo dengan data contoh. Tidak ada data pasien yang sebenarnya.</p>
      </div>

      {/* Panel kanan */}
      <div className="flex min-w-0 flex-1 basis-[480px] items-center justify-center px-5 py-10 md:px-8">
        <div className="w-full max-w-[420px]">
          {step === 'form' && (
            <div>
              <h2 className="mb-1.5 font-display text-[34px] font-medium leading-[1.15]">Masuk</h2>
              <p className="mb-5 text-[14.5px] text-muted">Gunakan akun yang diberikan pemilik klinik.</p>

              <div className="mb-5 rounded-chip border border-mint-2 bg-mint-3 p-4">
                <p className="mb-2 text-xs font-semibold text-teal-soft">Masuk cepat untuk demo, pilih peran</p>
                <div className="flex flex-wrap gap-2">
                  {ROLE_ORDER.map((role) => {
                    const isActive = role === selectedRole
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setSelectedRole(role)}
                        className={cn(
                          'rounded-pill border-[1.5px] px-3.5 py-[7px] text-[13px] font-semibold transition-colors duration-200',
                          isActive ? 'border-teal bg-teal text-white' : 'border-mint-2 bg-white text-teal-soft',
                        )}
                      >
                        {ROLE_CONFIG[role].label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <label htmlFor="login-email" className="mb-1.5 block text-xs font-semibold text-muted">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                readOnly
                value={selectedUser?.email ?? ''}
                autoComplete="username"
                className={cn(inputClasses, 'mb-4')}
              />

              <div className="mb-1.5 flex items-baseline justify-between">
                <label htmlFor="login-password" className="text-xs font-semibold text-muted">
                  Kata sandi
                </label>
                <a href="#" className="text-xs font-semibold text-teal" onClick={(e) => e.preventDefault()}>
                  Lupa kata sandi?
                </a>
              </div>
              <div className="relative mb-4">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  readOnly
                  value="rahasia123"
                  autoComplete="current-password"
                  className={cn(inputClasses, 'pr-[84px]')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-pill bg-sand-neutral px-3 py-1.5 text-xs font-semibold text-neutral-text"
                >
                  {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>

              <div className="mb-5 flex items-center gap-2.5 text-[13.5px] text-ink">
                <input
                  id="login-remember"
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="h-[17px] w-[17px] accent-teal"
                />
                <label htmlFor="login-remember">Ingat perangkat ini selama 30 hari</label>
              </div>

              <Button variant="primary" fullWidth onClick={handleSubmit}>
                Masuk
              </Button>

              <NoticeBanner tone="warning" className="mt-5">
                Setiap aktivitas di panel tercatat di log audit. Jangan membagikan akun dengan orang lain.
              </NoticeBanner>

              <p className="mt-5 text-center text-[13px]">
                <Link to="/" className="font-semibold text-teal">
                  ← Kembali ke website
                </Link>
              </p>
            </div>
          )}

          {step === 'otp' && (
            <div>
              <div className="mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-chip bg-mint">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <h2 className="mb-1.5 font-display text-[32px] font-medium leading-[1.15]">Verifikasi dua langkah</h2>
              <p className="mb-5 text-[14.5px] text-muted">
                Masukkan 6 digit kode dari aplikasi autentikator untuk {selectedUser?.email}.
              </p>
              <div className="mb-3 flex gap-2">
                {OTP_DIGITS.map((digit, i) => (
                  <div
                    key={i}
                    className="flex h-14 min-w-0 flex-1 items-center justify-center rounded-input border-[1.5px] border-border bg-white font-display text-2xl"
                  >
                    {digit}
                  </div>
                ))}
              </div>
              <p className="mb-5 text-xs text-muted">Kode berganti tiap 30 detik. Kehilangan perangkat? Hubungi pemilik klinik.</p>
              <Button variant="primary" fullWidth onClick={handleVerifyOtp}>
                Verifikasi dan masuk
              </Button>
              <div className="mt-4 text-center">
                <button type="button" onClick={() => setStep('form')} className="text-[13.5px] font-semibold text-teal">
                  ← Gunakan akun lain
                </button>
              </div>
            </div>
          )}

          {step === 'done' && (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-mint">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m5 12 5 5L20 7" />
                </svg>
              </div>
              <h2 className="mb-1.5 font-display text-[32px] font-medium leading-[1.15]">Berhasil masuk</h2>
              <p className="mb-1.5 text-[14.5px] text-muted">
                {roleConfig.label} · {scopeLabel}
              </p>
              <p className="mb-6 text-[13.5px] text-muted">Anda akan diarahkan ke {landingLabel}.</p>

              {latestAuditEntry && (
                <div className="mb-5 rounded-chip border border-border bg-white p-4 text-left text-[13px]">
                  <p className="mb-0.5 font-semibold">Tercatat di log audit</p>
                  <p className="text-muted">
                    Masuk · {formatLongDateID(new Date(latestAuditEntry.timestamp))},{' '}
                    {formatTimeID(new Date(latestAuditEntry.timestamp))} · Perangkat baru
                  </p>
                </div>
              )}

              <Button variant="primary" fullWidth to={roleConfig.defaultLandingRoute} className="mb-3">
                Lanjutkan sekarang
              </Button>
              <Button variant="secondary" fullWidth onClick={handleRestartDemo}>
                Keluar dan ulangi demo
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
