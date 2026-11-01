import { useState } from 'react'
import { ContentEditorHeader } from '@/components/dashboard/content/ContentEditorHeader'
import { ContentWorkflowFooter } from '@/components/dashboard/content/ContentWorkflowFooter'
import { Button, Photo, StatusChip, Tabs, TextField, Toggle } from '@/components/primitives'
import { saveDraft, useContentByType } from '@/data/repositories/contentRepository'
import { setBranchVisibility, updateBranch, useBranches } from '@/data/repositories/branchRepository'
import { useClinicSettings, updateClinicSettings } from '@/data/repositories/clinicRepository'
import type { Branch, CabangContent } from '@/types'

export function KontenCabang() {
  const clinic = useClinicSettings()
  const branches = useBranches()
  const items = useContentByType('cabang') as CabangContent[]

  const [selectedBranchId, setSelectedBranchId] = useState(branches[0]?.id ?? null)
  const branch = branches.find((b) => b.id === selectedBranchId) ?? null
  const content = items.find((c) => c.branchId === selectedBranchId) ?? null

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[13px] text-muted">Alamat, kontak, dan foto fasilitas</p>
          <h1 className="mt-0.5 font-display text-[34px] font-medium leading-[1.15]">
            {clinic.hasMultipleBranches ? 'Cabang' : 'Lokasi klinik'}
          </h1>
        </div>
        {clinic.hasMultipleBranches && (
          <Button variant="primary" size="sm" disabled title="Di luar lingkup demo ini">
            Tambah cabang
          </Button>
        )}
      </div>

      <div className="mb-[22px] flex flex-wrap items-center justify-between gap-5 rounded-card-lg border border-border bg-surface p-5">
        <div className="min-w-0 flex-1 basis-[340px]">
          <p className="font-display text-lg">Struktur lokasi klinik</p>
          <p className="text-[13px] text-muted">
            {clinic.hasMultipleBranches
              ? 'Website menampilkan pilihan cabang, halaman tiap cabang, dan pilihan cabang di reservasi.'
              : 'Untuk klinik tanpa cabang. Halaman dan pilihan cabang disembunyikan, alamat tampil langsung.'}
          </p>
        </div>
        <Tabs
          aria-label="Struktur lokasi klinik"
          options={[
            { value: 'multi', label: 'Beberapa cabang' },
            { value: 'single', label: 'Satu lokasi' },
          ]}
          value={clinic.hasMultipleBranches ? 'multi' : 'single'}
          onChange={(v) => updateClinicSettings({ hasMultipleBranches: v === 'multi' })}
        />
      </div>

      <div className="flex flex-wrap items-start gap-[22px]">
        <div className="flex min-w-0 flex-1 basis-[320px] flex-col gap-[18px]" style={{ maxWidth: 420 }}>
          {clinic.hasMultipleBranches ? (
            <div className="overflow-hidden rounded-card-lg border border-border bg-surface">
              <div className="border-b border-border px-5 py-4 font-display text-lg">Daftar cabang</div>
              <ul>
                {branches.map((b) => (
                  <li
                    key={b.id}
                    className={`flex items-center gap-2.5 border-t border-[#efece3] px-5 py-3.5 ${selectedBranchId === b.id ? 'border-l-4 border-l-teal bg-mint-3 pl-4' : ''}`}
                  >
                    <button type="button" onClick={() => setSelectedBranchId(b.id)} className="min-w-0 flex-1 text-left">
                      <span className="block truncate text-sm font-semibold">{b.name}</span>
                      <span className="block truncate text-xs text-muted">{b.address.split(',')[0]}</span>
                    </button>
                    <StatusChip tone={b.isVisible ? 'success' : 'neutral'} label={b.isVisible ? 'Tampil' : 'Disembunyikan'} />
                    <Toggle
                      checked={b.isVisible}
                      onChange={(v) => setBranchVisibility(b.id, v)}
                      id={`vis-${b.id}`}
                      ariaLabel={`Tampilkan ${b.name} di website`}
                    />
                  </li>
                ))}
              </ul>
              <p className="border-t border-[#efece3] px-5 py-3 text-xs text-muted">
                Saklar mengatur apakah cabang tampil di website dan di pilihan reservasi. Berguna untuk cabang yang
                belum dibuka.
              </p>
            </div>
          ) : (
            <div className="rounded-card-lg border border-border bg-surface p-5">
              <p className="mb-2.5 font-display text-lg">Yang disembunyikan di website</p>
              <ul className="list-disc space-y-1.5 pl-5 text-[13.5px] text-[#3a4f53]">
                <li>Menu dan halaman Cabang</li>
                <li>Pilihan cabang di form reservasi</li>
                <li>Kartu cabang di beranda</li>
              </ul>
              <p className="mb-2.5 mt-4 font-display text-lg">Yang tetap tampil</p>
              <ul className="list-disc space-y-1.5 pl-5 text-[13.5px] text-[#3a4f53]">
                <li>Alamat, peta, dan jam buka langsung di beranda dan Kontak</li>
                <li>Satu nomor WhatsApp untuk booking</li>
              </ul>
              <p className="mt-3.5 text-xs text-muted">
                Data ketiga cabang tidak dihapus. Anda bisa kembali ke "Beberapa cabang" kapan saja.
              </p>
            </div>
          )}
        </div>

        {clinic.hasMultipleBranches ? (
          branch && content ? (
            <BranchEditor key={branch.id} branch={branch} content={content} doctorReviewEnabled={clinic.doctorReviewEnabled} />
          ) : (
            <div className="min-w-0 flex-1 basis-[520px] rounded-card-lg border border-border bg-surface p-6">
              <p className="text-sm text-muted">Pilih cabang di sebelah kiri.</p>
            </div>
          )
        ) : (
          <SingleLocationEditor
            address={clinic.singleLocationAddress?.address ?? ''}
            whatsappNumber={clinic.singleLocationAddress?.whatsappNumber ?? ''}
          />
        )}
      </div>
    </div>
  )
}

function BranchEditor({
  branch,
  content,
  doctorReviewEnabled,
}: {
  branch: Branch
  content: CabangContent
  doctorReviewEnabled: boolean
}) {
  const [name, setName] = useState(branch.name)
  const [whatsapp, setWhatsapp] = useState(branch.whatsappNumber)
  const [address, setAddress] = useState(branch.address)
  const [photoConfirmed, setPhotoConfirmed] = useState(true)

  function handleSaveDraft() {
    updateBranch(branch.id, { name, whatsappNumber: whatsapp, address })
    saveDraft(content.id, { title: name, body: `${name} berlokasi di ${address}.`, status: 'draf' })
  }

  return (
    <div className="min-w-0 flex-1 basis-[520px] rounded-card-lg border border-border bg-surface p-6">
      <ContentEditorHeader title={branch.name} item={content} />
      <div className="mb-3.5 flex flex-wrap gap-3.5">
        <div className="min-w-0 flex-1 basis-[200px]">
          <TextField label="Nama lokasi" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="min-w-0 flex-1 basis-[200px]">
          <TextField label="Nomor WhatsApp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
        </div>
      </div>
      <div className="mb-1.5">
        <TextField label="Alamat" value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>
      <p className="mb-4 text-xs text-muted">
        Harus sama persis dengan Google Business Profile. Tombol rute Google Maps dibuat otomatis dari alamat ini.
      </p>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-chip border border-mint-2 bg-mint-3 px-3.5 py-3 text-[13px]">
        <span>
          <b>Jam praktik</b> tersinkron dari Jadwal &amp; slot.
        </span>
        <a href="/dashboard/jadwal" className="text-[12.5px] font-semibold text-teal">
          Ubah di Jadwal →
        </a>
      </div>

      <p className="mb-2 text-xs font-semibold text-muted">Foto fasilitas</p>
      <div className="mb-2.5 flex flex-wrap gap-2.5">
        {branch.photoLabels.map((label) => (
          <Photo key={label} label={label} className="!aspect-auto h-[84px] flex-1 basis-[110px]" />
        ))}
        <button
          type="button"
          disabled
          title="Di luar lingkup demo ini"
          className="h-[84px] flex-1 basis-[110px] rounded-card-sm border-[1.5px] border-dashed border-border bg-ivory text-sm font-semibold text-teal-soft"
        >
          + Tambah foto
        </button>
      </div>
      <div className="mb-5 flex items-start gap-2.5 text-xs text-muted">
        <input
          type="checkbox"
          id="photo-confirm"
          checked={photoConfirmed}
          onChange={(e) => setPhotoConfirmed(e.target.checked)}
          className="mt-0.5 h-[17px] w-[17px] accent-teal"
        />
        <label htmlFor="photo-confirm">
          Saya memastikan foto hanya menampilkan fasilitas. Bukan foto pasien dan bukan foto sebelum-sesudah
          perawatan.
        </label>
      </div>

      <ContentWorkflowFooter
        item={content}
        doctorReviewEnabled={doctorReviewEnabled}
        metaLabel="Tanpa tinjauan dokter karena berisi data faktual. Setiap perubahan tercatat di log audit."
        onSaveDraft={handleSaveDraft}
        canPublish={photoConfirmed}
      />
    </div>
  )
}

function SingleLocationEditor({ address: initialAddress, whatsappNumber: initialWhatsapp }: { address: string; whatsappNumber: string }) {
  const [address, setAddress] = useState(initialAddress)
  const [whatsapp, setWhatsapp] = useState(initialWhatsapp)

  return (
    <div className="min-w-0 flex-1 basis-[520px] rounded-card-lg border border-border bg-surface p-6">
      <p className="mb-[18px] font-display text-xl">Klinik Gigi Arunika</p>
      <div className="mb-3.5">
        <TextField label="Alamat" value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>
      <div className="mb-5">
        <TextField label="Nomor WhatsApp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
      </div>
      <p className="mb-4 text-xs text-muted">
        Klinik satu lokasi tidak memakai alur Draf/Ditinjau/Tayang terpisah — perubahan tersimpan langsung.
      </p>
      <Button
        variant="primary"
        size="sm"
        onClick={() => updateClinicSettings({ singleLocationAddress: { address, whatsappNumber: whatsapp } })}
      >
        Simpan perubahan
      </Button>
    </div>
  )
}
