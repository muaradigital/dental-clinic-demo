import { useState } from 'react'
import { ContentEditorHeader } from '@/components/dashboard/content/ContentEditorHeader'
import { ContentListPanel } from '@/components/dashboard/content/ContentListPanel'
import { ContentWorkflowFooter } from '@/components/dashboard/content/ContentWorkflowFooter'
import { Button, NoticeBanner, TextAreaField, TextField } from '@/components/primitives'
import { getEffectiveStatus } from '@/lib/content'
import { formatDateRangeID, formatShortDateID, toISODate } from '@/lib/date'
import { useBranches } from '@/data/repositories/branchRepository'
import { useClinicSettings } from '@/data/repositories/clinicRepository'
import { saveDraft, useContentByType } from '@/data/repositories/contentRepository'
import type { PengumumanContent, PengumumanType } from '@/types'

const TYPE_LABEL: Record<PengumumanType, string> = {
  pengumuman: 'Pengumuman',
  artikel: 'Artikel',
  event_promo: 'Event promo',
}

const TYPE_FILTERS: ('Semua' | PengumumanType)[] = ['Semua', 'pengumuman', 'artikel', 'event_promo']

export function KontenPengumuman() {
  const clinic = useClinicSettings()
  const branches = useBranches()
  const items = useContentByType('pengumuman') as PengumumanContent[]

  const [typeFilter, setTypeFilter] = useState<'Semua' | PengumumanType>('Semua')
  const filteredItems = typeFilter === 'Semua' ? items : items.filter((i) => i.announcementType === typeFilter)

  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id ?? null)
  const selected = items.find((i) => i.id === selectedId) ?? null

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[13px] text-muted">Banner beranda, halaman artikel, dan event edukasi</p>
          <h1 className="mt-0.5 font-display text-[34px] font-medium leading-[1.15]">Pengumuman &amp; artikel</h1>
        </div>
        <Button variant="primary" size="sm" disabled title="Di luar lingkup demo ini">
          Tulis konten baru
        </Button>
      </div>

      <div className="flex flex-wrap items-start gap-[22px]">
        <ContentListPanel
          items={filteredItems.map((i) => ({
            id: i.id,
            title: i.title,
            status: getEffectiveStatus(i),
            meta:
              i.publishAt && i.expireAt
                ? formatDateRangeID(toISODate(new Date(i.publishAt)), toISODate(new Date(i.expireAt)))
                : `Terakhir diubah ${formatShortDateID(new Date(i.updatedAt))}`,
          }))}
          selectedId={selectedId}
          onSelect={setSelectedId}
          extraTabs={TYPE_FILTERS.map((t) => ({
            value: t,
            label: t === 'Semua' ? 'Semua' : TYPE_LABEL[t],
            active: typeFilter === t,
            onClick: () => setTypeFilter(t),
          }))}
        />

        {selected && (
          <PengumumanEditor key={selected.id} item={selected} branches={branches} doctorReviewEnabled={clinic.doctorReviewEnabled} />
        )}
      </div>
    </div>
  )
}

function PengumumanEditor({
  item,
  branches,
  doctorReviewEnabled,
}: {
  item: PengumumanContent
  branches: ReturnType<typeof useBranches>
  doctorReviewEnabled: boolean
}) {
  const [jenis, setJenis] = useState<PengumumanType>(item.announcementType)
  const [title, setTitle] = useState(item.title)
  const [body, setBody] = useState(item.body)
  const [publishAt, setPublishAt] = useState(item.publishAt ? toISODate(new Date(item.publishAt)) : '')
  const [expireAt, setExpireAt] = useState(item.expireAt ? toISODate(new Date(item.expireAt)) : '')
  const [showAsHomepageBanner, setShowAsHomepageBanner] = useState(item.showAsHomepageBanner)
  const [showOnArticlesPage, setShowOnArticlesPage] = useState(item.showOnArticlesPage)
  const [branchIds, setBranchIds] = useState<string[]>(item.branchIds)

  function toggleBranch(id: string) {
    setBranchIds((prev) => (prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]))
  }

  function handleSaveDraft() {
    saveDraft(item.id, {
      announcementType: jenis,
      title,
      body,
      publishAt: publishAt ? new Date(`${publishAt}T00:00:00`).toISOString() : undefined,
      expireAt: expireAt ? new Date(`${expireAt}T23:59:59`).toISOString() : undefined,
      showAsHomepageBanner,
      showOnArticlesPage,
      branchIds,
      status: 'draf',
    })
  }

  return (
    <div className="min-w-0 flex-1 basis-[520px] rounded-card-lg border border-border bg-surface p-6">
      <ContentEditorHeader title={item.title} item={item} />

      <div className="mb-3.5 flex flex-wrap gap-3.5">
        <div className="flex-none basis-[180px]">
          <label className="mb-1.5 block text-xs font-semibold text-muted">Jenis</label>
          <select
            value={jenis}
            onChange={(e) => setJenis(e.target.value as PengumumanType)}
            className="w-full rounded-input border-[1.5px] border-border bg-ivory-input px-3.5 py-3 text-sm text-ink focus:border-teal-bright focus:outline-none"
          >
            <option value="event_promo">Event promo</option>
            <option value="pengumuman">Pengumuman</option>
            <option value="artikel">Artikel</option>
          </select>
        </div>
        <div className="min-w-0 flex-1 basis-[260px]">
          <TextField label="Judul" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
      </div>

      <div className="mb-3.5">
        <TextAreaField label="Isi" rows={4} value={body} onChange={(e) => setBody(e.target.value)} />
      </div>

      <div className="mb-3.5 flex flex-wrap gap-3.5">
        <div className="min-w-0 flex-1 basis-[150px]">
          <TextField label="Mulai tayang" type="date" value={publishAt} onChange={(e) => setPublishAt(e.target.value)} />
        </div>
        <div className="min-w-0 flex-1 basis-[150px]">
          <TextField label="Selesai tayang" type="date" value={expireAt} onChange={(e) => setExpireAt(e.target.value)} />
        </div>
      </div>

      <p className="mb-2 text-xs font-semibold text-muted">Tampil di</p>
      <div className="mb-3.5 flex flex-wrap gap-2">
        <PillToggle active={showAsHomepageBanner} onClick={() => setShowAsHomepageBanner((v) => !v)} label="Banner beranda" />
        <PillToggle active={showOnArticlesPage} onClick={() => setShowOnArticlesPage((v) => !v)} label="Halaman artikel" />
        <PillToggle active={branchIds.length > 0} label="Halaman cabang" disabled />
      </div>
      <p className="mb-2 text-xs font-semibold text-muted">Berlaku di cabang</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {branches.map((b) => (
          <PillToggle key={b.id} active={branchIds.includes(b.id)} onClick={() => toggleBranch(b.id)} label={b.name} />
        ))}
      </div>

      {jenis === 'event_promo' && (
        <NoticeBanner tone="warning" title="Aturan khusus event promo" className="mb-4">
          <ul className="list-disc space-y-1 pl-4">
            <li>Jangan gunakan label diskon besar atau harga coret.</li>
            <li>Hindari "terbaik", "termurah", "dijamin", dan klaim hasil perawatan.</li>
            <li>Tonjolkan edukasi atau pemeriksaan, bukan potongan harga.</li>
            <li>Wajib ditinjau dokter sebelum tayang.</li>
          </ul>
        </NoticeBanner>
      )}

      <ContentWorkflowFooter
        item={item}
        doctorReviewEnabled={doctorReviewEnabled}
        metaLabel="Peninjau: drg. Anindya Prameswari"
        onSaveDraft={handleSaveDraft}
      />
    </div>
  )
}

function PillToggle({ active, onClick, label, disabled }: { active: boolean; onClick?: () => void; label: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-pill px-3.5 py-1.5 text-sm font-semibold transition-colors ${
        active ? 'bg-mint-3 text-teal-soft' : 'border-[1.5px] border-dashed border-border text-muted'
      } ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
    >
      {label}
    </button>
  )
}
