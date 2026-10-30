import { useState } from 'react'
import { Button, TextField } from '@/components/primitives'
import { addClosure, removeClosure, useClosures } from '@/data/repositories/scheduleRepository'
import { formatDateRangeID } from '@/lib/date'
import { isNonEmpty } from '@/lib/validation'

export interface ClosuresCardProps {
  branchId: string
}

export function ClosuresCard({ branchId }: ClosuresCardProps) {
  const closures = useClosures(branchId)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const isValid = isNonEmpty(name) && isNonEmpty(startDate) && isNonEmpty(endDate) && endDate >= startDate

  function handleAdd() {
    if (!isValid) return
    addClosure({ branchId, name: name.trim(), startDate, endDate })
    setName('')
    setStartDate('')
    setEndDate('')
    setShowForm(false)
  }

  return (
    <div className="rounded-card border border-border bg-surface p-5">
      <p className="mb-2.5 font-display text-lg">Libur &amp; penutupan</p>
      {closures.length === 0 && <p className="py-1 text-sm text-muted">Belum ada libur terjadwal untuk cabang ini.</p>}
      {closures.map((closure) => (
        <div key={closure.id} className="flex items-start justify-between gap-2.5 border-t border-[#efece3] py-2.5 text-[13px] first:border-t-0">
          <div>
            <p className="font-semibold">{closure.name}</p>
            <p className="text-xs text-muted">{formatDateRangeID(closure.startDate, closure.endDate)}</p>
          </div>
          <button type="button" onClick={() => removeClosure(closure.id)} className="shrink-0 text-xs font-semibold text-danger-text">
            Hapus
          </button>
        </div>
      ))}

      {showForm ? (
        <div className="mt-3 flex flex-col gap-2.5 border-t border-[#efece3] pt-3.5">
          <TextField label="Nama libur" value={name} onChange={(e) => setName(e.target.value)} placeholder="mis. Libur Nasional" />
          <div className="grid grid-cols-2 gap-2.5">
            <TextField label="Mulai" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <TextField label="Selesai" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button variant="primary" size="sm" disabled={!isValid} onClick={handleAdd}>
              Simpan libur
            </Button>
            <Button variant="outline-light" size="sm" onClick={() => setShowForm(false)}>
              Batal
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="secondary" size="sm" fullWidth className="mt-3" onClick={() => setShowForm(true)}>
          Tambah libur
        </Button>
      )}
    </div>
  )
}
