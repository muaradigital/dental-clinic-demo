import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Avatar, NoticeBanner, Stepper, Tabs } from '@/components/primitives'
import { getContentSteps, getCurrentStepIndex, getStepperSteps } from '@/lib/content'
import { formatShortDateID, formatTimeID } from '@/lib/date'
import { getInitialsFromName } from '@/lib/hash'
import { useClinicSettings } from '@/data/repositories/clinicRepository'
import { approveAndPublish, requestRevision, useContentById } from '@/data/repositories/contentRepository'
import { getDesignatedReviewers, getUserById } from '@/data/repositories/userRepository'
import { useDemoStore } from '@/store/useDemoStore'

const CHECKLIST_LABELS = [
  'Teks sudah disetujui dokter',
  'Foto bukan pasien dan bukan sebelum-sesudah',
  'Tidak ada klaim berlebihan atau kata superlatif',
  'Jam, alamat, dan nomor WhatsApp sudah sesuai',
]

const TYPE_EYEBROW: Record<string, string> = {
  layanan: 'Layanan',
  cabang: 'Cabang',
  dokter: 'Profil dokter',
  pengumuman: 'Pengumuman',
}

const EDITOR_ROUTE: Record<string, string> = {
  layanan: '/dasbor/konten/layanan',
  cabang: '/dasbor/konten/cabang',
  dokter: '/dasbor/konten/dokter',
  pengumuman: '/dasbor/konten/pengumuman',
}

export function KontenPratinjau() {
  const { contentId } = useParams()
  const navigate = useNavigate()
  const clinic = useClinicSettings()
  const item = useContentById(contentId)
  const activeUserId = useDemoStore((s) => s.activeUserId)
  const activeUserName = (activeUserId && getUserById(activeUserId)?.name) || 'Peninjau demo'

  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [checked, setChecked] = useState([false, false, false, false])
  const [justPublished, setJustPublished] = useState(false)
  const [justRevised, setJustRevised] = useState(false)

  if (!item) {
    return <p className="text-sm text-muted">Konten tidak ditemukan.</p>
  }

  const reviewer = (item.reviewerId && getUserById(item.reviewerId)) || getDesignatedReviewers()[0]
  const steps = getContentSteps(item.type, clinic.doctorReviewEnabled)
  const currentIndex = getCurrentStepIndex(item.status, steps)
  const done = checked.filter(Boolean).length
  const allChecked = done === checked.length
  const reviewApplicable = item.type !== 'cabang' && clinic.doctorReviewEnabled
  const isReviewable = reviewApplicable && item.status === 'ditinjau'
  const alreadyLive = item.status === 'tayang' || item.status === 'berakhir'

  function toggleCheck(i: number) {
    if (!isReviewable) return
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
  }

  function handleApprove() {
    if (!allChecked || !isReviewable || !activeUserId) return
    approveAndPublish(item!.id, activeUserId)
    setJustPublished(true)
  }

  function handleRevise() {
    if (!isReviewable) return
    requestRevision(item!.id)
    setJustRevised(true)
  }

  const frameMaxWidth = device === 'mobile' ? 340 : 760

  return (
    <div className="min-h-screen bg-ivory px-5 py-7 md:px-9">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[13px] text-muted">
            Konten website · {TYPE_EYEBROW[item.type]}
          </p>
          <h1 className="mt-0.5 font-display text-[32px] font-medium leading-[1.15]">
            Pratinjau &amp; tinjauan: {item.title}
          </h1>
        </div>
        <button
          type="button"
          onClick={() => navigate(EDITOR_ROUTE[item.type])}
          className="text-[13px] font-semibold text-teal"
        >
          ← Kembali ke editor
        </button>
      </div>

      <div className="flex flex-wrap items-start gap-[22px]">
        <div className="min-w-0 flex-1 basis-[600px] rounded-card-lg border border-border bg-surface p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="font-display text-xl">Pratinjau tampilan</p>
            <Tabs
              aria-label="Desktop atau mobile"
              options={[
                { value: 'desktop', label: 'Desktop' },
                { value: 'mobile', label: 'Mobile' },
              ]}
              value={device}
              onChange={setDevice}
            />
          </div>

          <div className="flex justify-center overflow-hidden rounded-card-sm bg-[#e9e6dc] p-6">
            <div className="w-full overflow-hidden rounded-card-sm bg-white shadow-lift" style={{ maxWidth: frameMaxWidth }}>
              <div className="flex items-center gap-2 border-b border-border bg-ivory-input px-3.5 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#f0a8a0]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#f0dca0]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#a8d8b0]" />
                <span className="ml-2 text-[11px] text-muted">arunika.example/{item.type}</span>
              </div>
              <div className="p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-teal">{TYPE_EYEBROW[item.type]}</p>
                <p className="my-1.5 font-display text-2xl leading-tight">{item.title}</p>
                <p className="mb-3.5 text-sm text-[#3a4f53]">{item.body}</p>
              </div>
            </div>
          </div>
          <p className="mt-2.5 text-xs text-muted">
            Tampilan {device === 'mobile' ? 'mobile (390 px)' : 'desktop'}. Pratinjau memakai data dan gaya yang sama
            dengan website tayang.
          </p>
        </div>

        <div className="flex min-w-0 flex-1 basis-[340px] flex-col gap-[18px]" style={{ maxWidth: 440 }}>
          <div className="rounded-card-lg border border-border bg-surface p-[22px]">
            <Stepper steps={getStepperSteps(steps)} currentIndex={currentIndex} className="mb-4 flex-wrap" />
            {reviewer && (
              <div className="flex items-center gap-3 rounded-chip bg-ivory px-3.5 py-3">
                <Avatar initials={getInitialsFromName(reviewer.name)} seed={reviewer.id} size="sm" />
                <div className="text-sm">
                  <p className="font-semibold">{reviewer.name}</p>
                  <p className="text-muted">
                    Peninjau · diajukan {item.updatedBy}, {formatShortDateID(new Date(item.updatedAt))}{' '}
                    {formatTimeID(new Date(item.updatedAt))}
                  </p>
                </div>
              </div>
            )}
          </div>

          {!reviewApplicable ? (
            <div className="rounded-card-lg border border-border bg-surface p-[22px] text-sm text-muted">
              {item.type === 'cabang'
                ? 'Konten cabang tidak melalui tinjauan — gunakan "Tayangkan perubahan" di halaman editor.'
                : 'Tinjauan dokter sedang nonaktif. Gunakan tombol "Tayangkan" di halaman editor.'}
            </div>
          ) : (
            <div className="rounded-card-lg border border-border bg-surface p-[22px]">
              <p className="mb-1 font-display text-xl">Daftar periksa peninjau</p>
              <p className="mb-3 text-[12.5px] text-muted">Semua poin wajib dicentang sebelum bisa ditayangkan.</p>
              <ul>
                {CHECKLIST_LABELS.map((label, i) => (
                  <li key={label} className="border-t border-[#efece3]">
                    <button
                      type="button"
                      onClick={() => toggleCheck(i)}
                      disabled={!isReviewable}
                      className="flex w-full items-center gap-3 py-2.5 text-left disabled:cursor-default"
                    >
                      <span
                        className={`flex h-[22px] w-[22px] flex-none items-center justify-center rounded-[7px] border-[1.5px] text-sm font-bold text-white ${
                          checked[i] ? 'border-teal bg-teal' : 'border-[#b8c4c0] bg-white'
                        }`}
                      >
                        {checked[i] ? '✓' : ''}
                      </span>
                      <span className="text-[13.5px] text-ink">{label}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <p className="my-3 text-[12.5px] text-muted">
                {done} dari {checked.length} poin terpenuhi
              </p>
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={handleRevise}
                  disabled={!isReviewable}
                  className="rounded-pill border-[1.5px] border-border bg-white px-[18px] py-[9.5px] text-sm font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Minta revisi
                </button>
                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={!allChecked || !isReviewable}
                  className="rounded-pill px-5 py-[11px] text-sm font-semibold text-white disabled:cursor-not-allowed"
                  style={{ background: !allChecked || !isReviewable ? '#d9e0dd' : '#0f766e', color: !allChecked || !isReviewable ? '#7a8b88' : '#fff' }}
                >
                  {alreadyLive ? 'Sudah tayang' : 'Setujui & tayangkan'}
                </button>
              </div>
              {(justPublished || alreadyLive) && item.firstPublishedAt && (
                <NoticeBanner tone="info" className="mt-3.5">
                  Tayang {formatShortDateID(new Date(item.firstPublishedAt))}. Tercatat di log audit atas nama{' '}
                  {activeUserName}.
                </NoticeBanner>
              )}
              {justRevised && (
                <NoticeBanner tone="info" className="mt-3.5">
                  Dikembalikan ke Draf. Pengaju mendapat notifikasi untuk merevisi.
                </NoticeBanner>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
