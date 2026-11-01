import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, NoticeBanner, StatusChip, Tabs, Toggle } from '@/components/primitives'
import { useAuditLog } from '@/data/repositories/auditRepository'
import { getBranchById } from '@/data/repositories/branchRepository'
import { useClinicSettings, updateClinicSettings } from '@/data/repositories/clinicRepository'
import { resetDemoData } from '@/data/repositories/metaRepository'
import { getDesignatedReviewers, getRolePermissionMatrix, getUserById, getUsers } from '@/data/repositories/userRepository'
import { formatLongDateID, formatRelativeDay, formatTimeID, now } from '@/lib/date'
import { ROLE_CONFIG, ROLE_ORDER } from '@/lib/permissions'
import { AUDIT_CATEGORY, AUDIT_CATEGORY_TONE, type AuditCategory } from '@/lib/status'
import { useDemoStore } from '@/store/useDemoStore'

const CONTENT_FLOW_ROWS = [
  { key: 'layanan', label: 'Layanan', alwaysDirect: false },
  { key: 'dokter', label: 'Profil dokter', alwaysDirect: false },
  { key: 'pengumuman', label: 'Pengumuman, artikel, event promo', alwaysDirect: false },
  { key: 'cabang', label: 'Cabang', alwaysDirect: true },
] as const

const FILTER_OPTIONS: { value: 'Semua' | AuditCategory; label: string }[] = [
  { value: 'Semua', label: 'Semua' },
  { value: 'Perubahan', label: 'Perubahan' },
  { value: 'Melihat data', label: 'Melihat data' },
  { value: 'Keamanan', label: 'Keamanan' },
]

export function PenggunaAudit() {
  const navigate = useNavigate()
  const activeUserId = useDemoStore((s) => s.activeUserId)
  const addAuditLog = useDemoStore((s) => s.addAuditLog)
  const clinic = useClinicSettings()
  const auditLog = useAuditLog()
  const users = getUsers()
  const permissionMatrix = getRolePermissionMatrix()
  const reviewers = getDesignatedReviewers()

  const [filter, setFilter] = useState<'Semua' | AuditCategory>('Semua')
  const [showInviteNotice, setShowInviteNotice] = useState(false)
  const [confirmingReset, setConfirmingReset] = useState(false)

  function handleResetDemo() {
    resetDemoData()
    navigate('/login', { replace: true })
  }

  const filteredLog = filter === 'Semua' ? auditLog : auditLog.filter((e) => AUDIT_CATEGORY[e.actionType] === filter)

  function handleToggleReview(checked: boolean) {
    updateClinicSettings({ doctorReviewEnabled: checked })
    if (activeUserId) {
      addAuditLog({ type: 'settings_change', setting: `Tinjauan dokter: ${checked ? 'aktif' : 'nonaktif'}` }, activeUserId)
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[13px] text-muted">Hanya pemilik yang dapat membuka halaman ini</p>
          <h1 className="mt-0.5 font-display text-[34px] font-medium leading-[1.15]">Pengguna &amp; log audit</h1>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowInviteNotice(true)}>
          Undang pengguna
        </Button>
      </div>
      {showInviteNotice && (
        <NoticeBanner tone="info" className="mb-5">
          Mengundang pengguna baru berada di luar lingkup demo ini — di produk sebenarnya ini akan mengirim tautan aktivasi
          ke email yang dimasukkan.
        </NoticeBanner>
      )}

      <div className="mb-[22px] flex flex-wrap items-start gap-[22px]">
        <div className="min-w-0 flex-1 basis-[560px] overflow-hidden rounded-card border border-border bg-surface">
          <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border px-[22px] py-[18px]">
            <p className="font-display text-lg">Pengguna</p>
            <p className="text-xs text-muted">Verifikasi dua langkah disarankan untuk pemilik</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-[13.5px]">
              <thead>
                <tr className="bg-[#faf9f4] text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                  <th className="px-[22px] py-2.5">Nama</th>
                  <th className="px-2 py-2.5">Peran</th>
                  <th className="px-2 py-2.5">Cabang</th>
                  <th className="px-2 py-2.5">2 langkah</th>
                  <th className="px-[22px] py-2.5">Terakhir masuk</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-[#efece3]">
                    <td className="px-[22px] py-3.5">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-muted">{user.email}</p>
                    </td>
                    <td className="px-2 py-3.5 text-[13px] font-semibold">{ROLE_CONFIG[user.role].label}</td>
                    <td className="px-2 py-3.5 text-[13px]">{user.branchId ? getBranchById(user.branchId)?.name : 'Semua'}</td>
                    <td className="px-2 py-3.5">
                      <StatusChip tone={user.mfaEnabled ? 'success' : 'warning'} label={user.mfaEnabled ? 'Aktif' : 'Belum aktif'} />
                    </td>
                    <td className="px-[22px] py-3.5 text-xs text-muted">
                      {user.lastLoginAt ? formatRelativeDay(user.lastLoginAt) : '–'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="min-w-0 flex-1 basis-[360px] rounded-card border border-border bg-surface p-[22px] lg:max-w-[460px]">
          <p className="mb-3.5 font-display text-lg">Hak akses per peran</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-[12.5px]">
              <thead>
                <tr className="text-[11px] font-semibold text-muted">
                  <th className="py-1.5"></th>
                  {ROLE_ORDER.map((role) => (
                    <th key={role} className="py-1.5 text-center">
                      {ROLE_CONFIG[role].label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissionMatrix.map((row) => (
                  <tr key={row.permission} className="border-t border-[#efece3]">
                    <td className="py-2.5 pr-2">{row.permission}</td>
                    {ROLE_ORDER.map((role) => (
                      <td
                        key={role}
                        className={`py-2.5 text-center font-bold ${row.byRole[role] ? 'text-teal-soft' : 'text-muted font-normal'}`}
                      >
                        {row.byRole[role] ? 'Ya' : '–'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted">Admin cabang tidak dapat membuka data cabang lain.</p>
        </div>
      </div>

      <div className="mb-[22px] rounded-card border border-border bg-surface p-[22px]">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="min-w-0 flex-1 basis-[360px]">
            <p className="mb-0.5 font-display text-lg">Alur konten website</p>
            <p className="mb-3.5 text-[13px] text-muted">
              {clinic.doctorReviewEnabled
                ? 'Konten yang memuat narasi perawatan harus disetujui dokter peninjau sebelum tayang.'
                : 'Konten langsung tayang setelah disimpan. Cocok jika pemilik sekaligus dokter dan satu-satunya editor.'}
            </p>
            <div className="flex flex-col gap-2 text-[13px]">
              {CONTENT_FLOW_ROWS.map((row) => {
                const direct = row.alwaysDirect || !clinic.doctorReviewEnabled
                return (
                  <div key={row.key} className="flex flex-wrap items-center gap-2.5">
                    <span className="flex-none basis-[190px] font-semibold">{row.label}</span>
                    <StatusChip tone={direct ? 'soft-teal' : 'warning'} label={direct ? 'Draf → Tayang' : 'Draf → Ditinjau → Tayang'} />
                  </div>
                )
              })}
            </div>
          </div>
          <div className="min-w-0 flex-1 basis-[300px] lg:max-w-[420px]">
            <Toggle
              checked={clinic.doctorReviewEnabled}
              onChange={handleToggleReview}
              label="Tinjauan dokter"
              description="Untuk layanan, profil dokter, dan pengumuman. Cabang selalu tanpa tinjauan."
            />
            <p className="mb-1.5 mt-4 text-xs text-muted">Peninjau yang ditunjuk</p>
            <div className="flex flex-wrap gap-2">
              {reviewers.map((reviewer) => (
                <span key={reviewer.id} className="rounded-pill bg-mint px-3.5 py-1.5 text-sm font-semibold text-teal-soft">
                  {reviewer.name}
                </span>
              ))}
            </div>
            {!clinic.doctorReviewEnabled && (
              <NoticeBanner tone="warning" className="mt-3">
                Dengan tinjauan nonaktif, kepatuhan isi konten sepenuhnya menjadi tanggung jawab klinik. Perubahan pengaturan
                ini dicatat di log audit.
              </NoticeBanner>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-card border border-border bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-[22px] py-[18px]">
          <div>
            <p className="font-display text-lg">Log audit</p>
            <p className="text-xs text-muted">
              Siapa melihat atau mengubah data janji. Log tidak memuat nama atau nomor pasien, hanya nomor janji.
            </p>
          </div>
          <Tabs options={FILTER_OPTIONS} value={filter} onChange={setFilter} size="sm" aria-label="Filter jenis log" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-[13px]">
            <thead>
              <tr className="bg-[#faf9f4] text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                <th className="px-[22px] py-2.5">Waktu</th>
                <th className="px-2 py-2.5">Pengguna</th>
                <th className="px-2 py-2.5">Jenis</th>
                <th className="px-2 py-2.5">Aktivitas</th>
                <th className="px-[22px] py-2.5">Cabang</th>
              </tr>
            </thead>
            <tbody>
              {filteredLog.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-[22px] py-6 text-center text-muted">
                    Tidak ada entri untuk filter ini.
                  </td>
                </tr>
              )}
              {filteredLog.map((entry) => {
                const category = AUDIT_CATEGORY[entry.actionType]
                return (
                  <tr key={entry.id} className="border-t border-[#efece3] align-top">
                    <td className="px-[22px] py-3 font-bold">{formatTimeID(new Date(entry.timestamp))}</td>
                    <td className="px-2 py-3 font-semibold">{getUserById(entry.userId)?.name ?? entry.userId}</td>
                    <td className="px-2 py-3">
                      <StatusChip tone={AUDIT_CATEGORY_TONE[category]} label={category} />
                    </td>
                    <td className="px-2 py-3">{entry.description}</td>
                    <td className="px-[22px] py-3 text-[12.5px]">
                      {entry.branchId ? getBranchById(entry.branchId)?.name ?? entry.branchId : 'Semua'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="border-t border-[#efece3] px-[22px] py-3 text-xs text-muted">
          Menampilkan sesi demo ini, {formatLongDateID(now())}. Log disimpan sesuai kebijakan retensi.
        </div>
      </div>

      <div className="mt-[22px] flex flex-wrap items-center justify-between gap-4 rounded-card border border-border bg-surface p-[22px]">
        <div>
          <p className="font-display text-lg">Reset data demo</p>
          <p className="mt-1 text-xs text-muted">
            Mengembalikan semua reservasi, konten, ulasan, pengingat, dan log audit ke keadaan awal, lalu keluar dari sesi
            ini. Hanya memengaruhi data demo di perangkat ini.
          </p>
        </div>
        {confirmingReset ? (
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold text-danger-text">Yakin? Ini tidak bisa dibatalkan.</span>
            <Button variant="outline-light" size="sm" onClick={() => setConfirmingReset(false)}>
              Batal
            </Button>
            <Button variant="danger-text" size="sm" onClick={handleResetDemo}>
              Ya, reset sekarang
            </Button>
          </div>
        ) : (
          <Button variant="outline-light" size="sm" onClick={() => setConfirmingReset(true)}>
            Reset data demo
          </Button>
        )}
      </div>
    </div>
  )
}
