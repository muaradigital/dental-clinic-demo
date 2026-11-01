import { useState } from 'react'
import { ContentEditorHeader } from '@/components/dashboard/content/ContentEditorHeader'
import { ContentListPanel } from '@/components/dashboard/content/ContentListPanel'
import { ContentWorkflowFooter } from '@/components/dashboard/content/ContentWorkflowFooter'
import { Avatar, Button, NoticeBanner, TextAreaField, TextField, Toggle } from '@/components/primitives'
import { getEffectiveStatus } from '@/lib/content'
import { useBranches } from '@/data/repositories/branchRepository'
import { useClinicSettings } from '@/data/repositories/clinicRepository'
import { saveDraft, useContentByType } from '@/data/repositories/contentRepository'
import { getDoctorById } from '@/data/repositories/doctorRepository'
import type { Doctor, DokterContent } from '@/types'

export function KontenDokter() {
  const clinic = useClinicSettings()
  const branches = useBranches()
  const items = useContentByType('dokter') as DokterContent[]

  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id ?? null)
  const selected = items.find((i) => i.id === selectedId) ?? null
  const doctor = selected ? getDoctorById(selected.doctorId) : undefined

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[13px] text-muted">Profil yang tampil di halaman Dokter</p>
          <h1 className="mt-0.5 font-display text-[34px] font-medium leading-[1.15]">Profil dokter</h1>
        </div>
        <Button variant="primary" size="sm" disabled title="Di luar lingkup demo ini">
          Tambah dokter
        </Button>
      </div>

      <div className="flex flex-wrap items-start gap-[22px]">
        <ContentListPanel
          listHeaderLabel="Daftar dokter"
          items={items.map((i) => ({ id: i.id, title: i.title, status: getEffectiveStatus(i), meta: getDoctorById(i.doctorId)?.specialty ?? '' }))}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />

        {selected && doctor && (
          <DokterEditor key={selected.id} item={selected} doctor={doctor} branches={branches} doctorReviewEnabled={clinic.doctorReviewEnabled} />
        )}
      </div>
    </div>
  )
}

function DokterEditor({
  item,
  doctor,
  branches,
  doctorReviewEnabled,
}: {
  item: DokterContent
  doctor: Doctor
  branches: ReturnType<typeof useBranches>
  doctorReviewEnabled: boolean
}) {
  const [title, setTitle] = useState(item.title)
  const [body, setBody] = useState(item.body)
  const [showCredentialNumber, setShowCredentialNumber] = useState(item.showCredentialNumber)
  const assignedBranchIds = new Set(doctor.schedule.map((s) => s.branchId))

  function handleSaveDraft() {
    saveDraft(item.id, { title, body, showCredentialNumber, status: 'draf' })
  }

  return (
    <div className="min-w-0 flex-1 basis-[520px] rounded-card-lg border border-border bg-surface p-6">
      <ContentEditorHeader title={doctor.name} item={item} />

      <div className="mb-4 flex flex-wrap gap-[18px]">
        <div className="flex-none">
          <Avatar initials={doctor.initials} seed={doctor.id} size="lg" />
          <Button variant="outline-light" size="sm" disabled title="Di luar lingkup demo ini" className="mt-2 w-[120px]">
            Ganti foto
          </Button>
        </div>
        <div className="min-w-0 flex-1 basis-[260px]">
          <div className="mb-3">
            <TextField label="Nama dan gelar" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <label className="mb-1.5 block text-xs font-semibold text-muted">Bidang</label>
          <p className="rounded-input border-[1.5px] border-border bg-ivory px-3.5 py-3 text-sm text-ink">{doctor.specialty}</p>
          <p className="mt-1 text-xs text-muted">Diatur di Dokter &amp; cuti, bukan di sini.</p>
        </div>
      </div>

      <p className="mb-2 text-xs font-semibold text-muted">Praktik di cabang</p>
      <div className="mb-3.5 flex flex-wrap gap-2">
        {branches.map((b) =>
          assignedBranchIds.has(b.id) ? (
            <span key={b.id} className="rounded-pill bg-mint-3 px-3.5 py-1.5 text-sm font-semibold text-teal-soft">
              {b.name}
            </span>
          ) : (
            <span key={b.id} className="rounded-pill border-[1.5px] border-dashed border-border px-3.5 py-1.5 text-sm font-semibold text-muted">
              {b.name}
            </span>
          ),
        )}
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-chip border border-mint-2 bg-mint-3 px-3.5 py-3 text-[13px]">
        <span>
          <b>Hari praktik</b> tersinkron dari Dokter &amp; cuti.
        </span>
        <a href="/dashboard/dokter-cuti" className="text-[12.5px] font-semibold text-teal">
          Ubah di Dokter &amp; cuti →
        </a>
      </div>

      <TextAreaField label="Profil singkat" rows={4} maxLength={400} showCounter value={body} onChange={(e) => setBody(e.target.value)} />
      <p className="-mt-1 mb-4 text-xs text-muted">Tanpa klaim hasil, peringkat, atau kata seperti "terbaik".</p>

      <div className="mb-3.5 flex items-center gap-3.5 border-t border-[#efece3] py-3.5">
        <Toggle
          checked={showCredentialNumber}
          onChange={setShowCredentialNumber}
          label="Tampilkan nomor STR/SIP"
          description="Default mati. Aktifkan hanya jika klinik memintanya."
        />
      </div>

      <NoticeBanner tone="warning" className="mb-4">
        Profil harus disetujui dokter yang bersangkutan sebelum tayang. Foto wajib foto profesional dokter, bukan
        foto pasien.
      </NoticeBanner>

      <ContentWorkflowFooter
        item={item}
        doctorReviewEnabled={doctorReviewEnabled}
        metaLabel={`Peninjau: ${doctor.name}`}
        onSaveDraft={handleSaveDraft}
      />
    </div>
  )
}
