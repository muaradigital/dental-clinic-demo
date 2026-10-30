import { useState } from 'react'
import { Button } from '@/components/primitives'
import { getSlotSettings, updateSlotSettings } from '@/data/repositories/scheduleRepository'

export interface SlotSettingsCardProps {
  branchId: string
}

/** The parent mounts this with `key={branchId}` so switching branches remounts fresh — see JadwalSlot.tsx. */
export function SlotSettingsCard({ branchId }: SlotSettingsCardProps) {
  const saved = getSlotSettings(branchId)

  const [quota, setQuota] = useState(saved?.defaultQuotaPerSlot ?? 3)
  const [duration, setDuration] = useState(saved?.slotDurationMinutes ?? 60)
  const [justSaved, setJustSaved] = useState(false)

  const isDirty = quota !== (saved?.defaultQuotaPerSlot ?? 3) || duration !== (saved?.slotDurationMinutes ?? 60)

  function handleSave() {
    updateSlotSettings(branchId, { defaultQuotaPerSlot: quota, slotDurationMinutes: duration })
    setJustSaved(true)
  }

  return (
    <div className="rounded-card border border-border bg-surface p-5">
      <p className="mb-3 font-display text-lg">Aturan kuota</p>
      <label htmlFor="jk" className="mb-1.5 block text-xs font-semibold text-muted">
        Kuota default per slot
      </label>
      <div className="mb-3 flex items-center gap-2">
        <input
          id="jk"
          type="number"
          min={1}
          value={quota}
          onChange={(e) => setQuota(Math.max(1, Number(e.target.value) || 1))}
          className="w-full rounded-input border-[1.5px] border-border bg-ivory-input px-3.5 py-3 text-sm text-ink focus:border-teal-bright focus:outline-none"
        />
        <span className="shrink-0 text-xs text-muted">pasien</span>
      </div>
      <label htmlFor="jd" className="mb-1.5 block text-xs font-semibold text-muted">
        Durasi slot
      </label>
      <div className="flex items-center gap-2">
        <input
          id="jd"
          type="number"
          min={15}
          step={15}
          value={duration}
          onChange={(e) => setDuration(Math.max(15, Number(e.target.value) || 15))}
          className="w-full rounded-input border-[1.5px] border-border bg-ivory-input px-3.5 py-3 text-sm text-ink focus:border-teal-bright focus:outline-none"
        />
        <span className="shrink-0 text-xs text-muted">menit</span>
      </div>
      <p className="mt-3 text-xs text-muted">Kuota bisa dikecualikan per dokter di halaman Dokter &amp; cuti.</p>
      <div className="mt-3.5 flex items-center gap-3">
        <Button variant="primary" size="sm" disabled={!isDirty} onClick={handleSave}>
          Simpan perubahan
        </Button>
        {justSaved && !isDirty && <p className="text-xs font-semibold text-teal-soft">Tersimpan.</p>}
      </div>
    </div>
  )
}
