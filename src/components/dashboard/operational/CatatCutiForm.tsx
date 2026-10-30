import { useState } from 'react'
import { Button, TextField } from '@/components/primitives'
import { createLeaveRequest } from '@/data/repositories/leaveRepository'
import { getDoctors } from '@/data/repositories/doctorRepository'
import { isNonEmpty } from '@/lib/validation'

export interface CatatCutiFormProps {
  onCreated: (leaveId: string) => void
}

export function CatatCutiForm({ onCreated }: CatatCutiFormProps) {
  const doctors = getDoctors()
  const [doctorId, setDoctorId] = useState(doctors[0]?.id ?? '')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [note, setNote] = useState('')

  const isValid = !!doctorId && isNonEmpty(startDate) && isNonEmpty(endDate) && endDate >= startDate

  function handleSubmit() {
    if (!isValid) return
    const leave = createLeaveRequest({ doctorId, startDate, endDate, note: note.trim() || undefined, status: 'menunggu' })
    setStartDate('')
    setEndDate('')
    setNote('')
    onCreated(leave.id)
  }

  return (
    <div className="rounded-card border border-border bg-surface p-5">
      <p className="mb-3 font-display text-lg">Catat cuti</p>
      <label htmlFor="cd" className="mb-1.5 block text-xs font-semibold text-muted">
        Dokter
      </label>
      <select
        id="cd"
        value={doctorId}
        onChange={(e) => setDoctorId(e.target.value)}
        className="mb-3 w-full rounded-input border-[1.5px] border-border bg-ivory-input px-3.5 py-3 text-sm text-ink focus:border-teal-bright focus:outline-none"
      >
        {doctors.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>
      <div className="mb-3 grid grid-cols-2 gap-2.5">
        <TextField label="Mulai" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <TextField label="Selesai" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>
      <div className="mb-3.5">
        <TextField label="Catatan administratif" value={note} onChange={(e) => setNote(e.target.value)} placeholder="mis. Keperluan pribadi" />
      </div>
      <Button variant="primary" size="sm" fullWidth disabled={!isValid} onClick={handleSubmit}>
        Simpan cuti
      </Button>
    </div>
  )
}
