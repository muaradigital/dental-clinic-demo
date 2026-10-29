import { useState } from 'react'
import { Button, Card, TextField } from '@/components/primitives'
import { createAppointment } from '@/data/repositories/appointmentRepository'
import { useAvailableSlots } from '@/data/repositories/scheduleRepository'
import { getServiceCategories } from '@/data/repositories/serviceRepository'
import { isNonEmpty, isValidWhatsappNumber } from '@/lib/validation'

export interface ManualAppointmentFormProps {
  branchId: string
  date: string
  onDone: () => void
}

export function ManualAppointmentForm({ branchId, date, onDone }: ManualAppointmentFormProps) {
  const categories = getServiceCategories()
  const slots = useAvailableSlots(branchId, date)
  const availableSlots = slots.filter((s) => s.status === 'tersedia')

  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '')
  const [time, setTime] = useState(availableSlots[0]?.time ?? '')

  const isValid = isNonEmpty(name) && isValidWhatsappNumber(whatsapp) && !!categoryId && !!time

  function handleSubmit() {
    if (!isValid) return
    createAppointment({
      branchId,
      serviceCategoryId: categoryId,
      date,
      timeSlot: time,
      patientName: name.trim(),
      patientWhatsapp: whatsapp.trim(),
      status: 'baru',
      source: 'lainnya',
      consentGiven: true,
      isSessionCreated: true,
    })
    onDone()
  }

  return (
    <Card className="mb-5">
      <p className="mb-4 font-display text-lg font-medium">Tambah janji manual</p>
      <div className="grid gap-3.5 sm:grid-cols-2">
        <TextField label="Nama" value={name} onChange={(e) => setName(e.target.value)} placeholder="mis. Rina" />
        <TextField
          label="Nomor WhatsApp"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="08xx xxxx xxxx"
        />
        <div>
          <label htmlFor="manual-service" className="mb-1.5 block text-xs font-semibold text-muted">
            Layanan
          </label>
          <select
            id="manual-service"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-input border-[1.5px] border-border bg-ivory-input px-3.5 py-3 text-sm text-ink focus:border-teal-bright focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="manual-time" className="mb-1.5 block text-xs font-semibold text-muted">
            Jam
          </label>
          <select
            id="manual-time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            disabled={availableSlots.length === 0}
            className="w-full rounded-input border-[1.5px] border-border bg-ivory-input px-3.5 py-3 text-sm text-ink focus:border-teal-bright focus:outline-none disabled:cursor-not-allowed disabled:text-muted"
          >
            {availableSlots.length === 0 && <option>Tidak ada slot tersedia hari ini</option>}
            {availableSlots.map((s) => (
              <option key={s.time} value={s.time}>
                {s.time}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-4 flex gap-2.5">
        <Button variant="primary" size="sm" disabled={!isValid} onClick={handleSubmit}>
          Simpan janji
        </Button>
        <Button variant="outline-light" size="sm" onClick={onDone}>
          Batal
        </Button>
      </div>
    </Card>
  )
}
