import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/primitives'
import { useReveal } from '@/hooks/useReveal'
import { BranchPicker } from '@/components/reservation/BranchPicker'
import { ConfirmationPanel } from '@/components/reservation/ConfirmationPanel'
import { ContactForm } from '@/components/reservation/ContactForm'
import { DatePicker7Day } from '@/components/reservation/DatePicker7Day'
import { ServiceCategoryPicker } from '@/components/reservation/ServiceCategoryPicker'
import { SlotGrid } from '@/components/reservation/SlotGrid'
import { SummaryPanel } from '@/components/reservation/SummaryPanel'
import { getPrimaryBranch, useVisibleBranches } from '@/data/repositories/branchRepository'
import { useClinicSettings } from '@/data/repositories/clinicRepository'
import { createAppointment } from '@/data/repositories/appointmentRepository'
import { isDateClosedForBranch } from '@/data/repositories/scheduleRepository'
import { getServiceCategories } from '@/data/repositories/serviceRepository'
import { cn } from '@/lib/cn'
import { formatLongDateID, getNext7Days, now, toISODate } from '@/lib/date'
import { isNonEmpty, isValidWhatsappNumber } from '@/lib/validation'
import type { Appointment } from '@/types'

function StepHeader({ number, title }: { number: number; title: string }) {
  return (
    <div className="mb-[18px] flex items-center gap-2.5">
      <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-teal text-[13px] font-bold text-white">
        {number}
      </span>
      <h2 className="font-display text-xl font-medium">{title}</h2>
    </div>
  )
}

export function Reservasi() {
  const clinic = useClinicSettings()
  const visibleBranches = useVisibleBranches()
  // "Satu lokasi" hides the picker, but a branch's PracticeHours still has
  // to drive the slot grid — the first branch stands in silently for it.
  const primaryBranch = getPrimaryBranch()
  const branches = clinic.hasMultipleBranches ? visibleBranches : primaryBranch ? [primaryBranch] : []
  const categories = getServiceCategories()
  const dates = getNext7Days(now())

  const [branchId, setBranchId] = useState<string | null>(branches[0]?.id ?? null)
  const [categoryId, setCategoryId] = useState<string | null>(categories[0]?.id ?? null)
  const [dateISO, setDateISO] = useState<string>(toISODate(now()))
  const [time, setTime] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [consent, setConsent] = useState(false)
  const [appointment, setAppointment] = useState<Appointment | null>(null)

  const { ref: step1Ref, revealProps: step1RevealProps } = useReveal<HTMLDivElement>()
  const { ref: step2Ref, revealProps: step2RevealProps } = useReveal<HTMLDivElement>({ delay: 100 })
  const { ref: step3Ref, revealProps: step3RevealProps } = useReveal<HTMLDivElement>({ delay: 200 })

  const selectedBranch = branches.find((b) => b.id === branchId) ?? null
  const selectedCategory = categories.find((c) => c.id === categoryId) ?? null
  const dateClosed = branchId ? isDateClosedForBranch(branchId, dateISO) : true
  const dateLabelBase = formatLongDateID(new Date(`${dateISO}T00:00:00`))
  const dateLabel = dateClosed ? `${dateLabelBase} (cabang tutup)` : dateLabelBase

  const whatsappError =
    whatsapp.length > 0 && !isValidWhatsappNumber(whatsapp) ? 'Gunakan format nomor Indonesia, mis. 08xxxxxxxxxx.' : undefined

  const isValid =
    !!branchId &&
    !!categoryId &&
    !!time &&
    !dateClosed &&
    isNonEmpty(name) &&
    isValidWhatsappNumber(whatsapp) &&
    consent

  function handleSelectBranch(id: string) {
    setBranchId(id)
    setTime(null)
  }

  function handleSelectDate(iso: string) {
    setDateISO(iso)
    setTime(null)
  }

  function handleSubmit() {
    if (!isValid || !selectedBranch || !selectedCategory || !time) return
    const created = createAppointment({
      branchId: selectedBranch.id,
      serviceCategoryId: selectedCategory.id,
      date: dateISO,
      timeSlot: time,
      patientName: name.trim(),
      patientWhatsapp: whatsapp.trim(),
      status: 'baru',
      source: 'online',
      consentGiven: true,
      isSessionCreated: true,
    })
    setAppointment(created)
  }

  function handleReset() {
    setAppointment(null)
    setTime(null)
    setName('')
    setWhatsapp('')
    setConsent(false)
  }

  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-20 pt-2 md:px-10">
      <p className="text-sm text-muted">
        <Link to="/" className="font-semibold text-teal">
          Beranda
        </Link>{' '}
        / Reservasi
      </p>
      <h1 className="mb-2.5 mt-3 font-display text-4xl font-medium leading-tight md:text-5xl">Reservasi online</h1>
      <p className="mb-8 max-w-xl text-muted">
        Pilih cabang, layanan, dan jam yang tersedia. Admin cabang akan mengonfirmasi lewat WhatsApp.
      </p>

      <div className="flex flex-wrap items-start gap-7">
        <div className="flex min-w-0 flex-1 basis-[620px] flex-col gap-[22px]">
          <div
            ref={step1Ref}
            {...step1RevealProps}
            className={cn(step1RevealProps.className, 'rounded-card-lg border border-border bg-surface p-7')}
          >
            <StepHeader number={1} title="Cabang dan layanan" />
            {clinic.hasMultipleBranches ? (
              <BranchPicker branches={branches} selectedId={branchId} onSelect={handleSelectBranch} />
            ) : (
              clinic.singleLocationAddress && (
                <div className="mb-5 rounded-chip border border-border bg-ivory-input px-4 py-3 text-sm">
                  <p className="font-semibold text-ink">{clinic.singleLocationAddress.address}</p>
                  <p className="mt-1 text-muted">WhatsApp {clinic.singleLocationAddress.whatsappNumber}</p>
                </div>
              )
            )}
            <ServiceCategoryPicker categories={categories} selectedId={categoryId} onSelect={setCategoryId} />
          </div>

          <div
            ref={step2Ref}
            {...step2RevealProps}
            className={cn(step2RevealProps.className, 'rounded-card-lg border border-border bg-surface p-7')}
          >
            <StepHeader number={2} title="Tanggal dan jam" />
            {branchId && (
              <>
                <DatePicker7Day branchId={branchId} dates={dates} selectedDate={dateISO} onSelect={handleSelectDate} />
                <SlotGrid branchId={branchId} date={dateISO} dateLabel={dateLabel} selectedTime={time} onSelect={setTime} />
              </>
            )}
          </div>
        </div>

        <div
          ref={step3Ref}
          {...step3RevealProps}
          className={cn(
            step3RevealProps.className,
            'min-w-0 flex-1 basis-[340px] rounded-card-lg border border-border bg-surface p-7 shadow-elevated md:max-w-[400px]',
          )}
        >
          {appointment && selectedBranch && selectedCategory ? (
            <ConfirmationPanel
              appointment={appointment}
              branchName={selectedBranch.name}
              serviceName={selectedCategory.name}
              onReset={handleReset}
            />
          ) : (
            <>
              <StepHeader number={3} title="Data kontak" />
              <SummaryPanel
                branchName={selectedBranch?.name ?? '—'}
                serviceName={selectedCategory?.name ?? '—'}
                timeSummary={time && !dateClosed ? `${dateLabelBase} · ${time}` : null}
              />
              <ContactForm
                name={name}
                whatsapp={whatsapp}
                consent={consent}
                onNameChange={setName}
                onWhatsappChange={setWhatsapp}
                onConsentChange={setConsent}
                whatsappError={whatsappError}
              />
              <Button
                variant="primary"
                fullWidth
                size="lg"
                disabled={!isValid}
                onClick={handleSubmit}
                className="mt-5"
              >
                Konfirmasi reservasi
              </Button>
              <p className="mt-3 text-center text-xs text-muted">
                Reservasi baru berlaku setelah dikonfirmasi admin cabang lewat WhatsApp.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
