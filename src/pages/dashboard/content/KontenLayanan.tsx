import { useState } from 'react'
import { ContentEditorHeader } from '@/components/dashboard/content/ContentEditorHeader'
import { ContentListPanel } from '@/components/dashboard/content/ContentListPanel'
import { ContentWorkflowFooter } from '@/components/dashboard/content/ContentWorkflowFooter'
import { NoticeBanner, TextAreaField, TextField, Toggle } from '@/components/primitives'
import { getEffectiveStatus } from '@/lib/content'
import { formatDateTimeID } from '@/lib/date'
import { saveDraft, useContentByType } from '@/data/repositories/contentRepository'
import { useClinicSettings } from '@/data/repositories/clinicRepository'
import type { LayananContent } from '@/types'

export function KontenLayanan() {
  const clinic = useClinicSettings()
  const items = useContentByType('layanan') as LayananContent[]

  const [selectedId, setSelectedId] = useState<string | null>(
    items.find((i) => i.status === 'draf')?.id ?? items[0]?.id ?? null,
  )
  const selected = items.find((i) => i.id === selectedId) ?? null

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[13px] text-muted">Tampil di halaman Layanan dan pilihan reservasi</p>
          <h1 className="mt-0.5 font-display text-[34px] font-medium leading-[1.15]">Layanan</h1>
        </div>
      </div>

      <div className="flex flex-wrap items-start gap-[22px]">
        <ContentListPanel
          items={items.map((i) => ({ id: i.id, title: i.title, status: getEffectiveStatus(i), meta: i.body.slice(0, 40) }))}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />

        {selected && <LayananEditor key={selected.id} item={selected} doctorReviewEnabled={clinic.doctorReviewEnabled} />}
      </div>
    </div>
  )
}

function LayananEditor({ item, doctorReviewEnabled }: { item: LayananContent; doctorReviewEnabled: boolean }) {
  const [title, setTitle] = useState(item.title)
  const [body, setBody] = useState(item.body)
  const [showOnWebsite, setShowOnWebsite] = useState(item.showOnWebsite)
  const [showInReservation, setShowInReservation] = useState(item.showInReservation)
  const [showPrice, setShowPrice] = useState(item.showPrice)

  function handleSaveDraft() {
    saveDraft(item.id, { title, body, showOnWebsite, showInReservation, showPrice, status: 'draf' })
  }

  return (
    <div className="min-w-0 flex-1 basis-[520px] rounded-card-lg border border-border bg-surface p-6">
      <ContentEditorHeader title={item.title} item={item} />

      <div className="mb-3.5">
        <TextField label="Nama layanan" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <TextAreaField label="Deskripsi edukatif" rows={4} maxLength={300} showCounter value={body} onChange={(e) => setBody(e.target.value)} />
      <p className="-mt-1 mb-4 text-xs text-muted">Netral dan tanpa janji hasil. Harus disetujui dokter.</p>

      <div className="mb-1.5 divide-y divide-[#efece3] border-t border-[#efece3]">
        <div className="py-2.5">
          <Toggle
            checked={showOnWebsite}
            onChange={setShowOnWebsite}
            label="Tampilkan di website"
            description="Muncul di halaman Layanan dan beranda"
          />
        </div>
        <div className="py-2.5">
          <Toggle
            checked={showInReservation}
            onChange={setShowInReservation}
            label="Tampilkan di pilihan reservasi"
            description="Menjadi kategori layanan di form reservasi"
          />
        </div>
        <div className="py-2.5">
          <Toggle
            checked={showPrice}
            onChange={setShowPrice}
            label="Tampilkan harga"
            description='Default tidak ditampilkan. Jika diaktifkan, tanpa label diskon atau "murah"'
          />
        </div>
      </div>
      {showPrice && (
        <NoticeBanner tone="info" className="mb-4 mt-3">
          Demo ini tidak menyimpan harga layanan di mana pun — mengaktifkan saklar ini tidak akan menampilkan angka
          apa pun, sesuai aturan "harga tersembunyi secara default".
        </NoticeBanner>
      )}

      <div className="mb-4 mt-3 flex flex-wrap justify-between gap-2.5 rounded-chip border border-border bg-ivory px-4 py-3.5 text-[13px]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">Peninjau</p>
          <p className="font-semibold">drg. Anindya Prameswari</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">Terakhir diubah</p>
          <p className="font-semibold">
            {item.updatedBy} · {formatDateTimeID(new Date(item.updatedAt))}
          </p>
        </div>
      </div>

      <ContentWorkflowFooter item={item} doctorReviewEnabled={doctorReviewEnabled} onSaveDraft={handleSaveDraft} />
    </div>
  )
}
