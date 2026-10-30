import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Avatar, Button, Photo } from '@/components/primitives'
import { CtaBanner } from '@/components/public/CtaBanner'
import { Icon } from '@/components/public/icons'
import { MapDecoration } from '@/components/public/MapDecoration'
import { getBranchBySlug, useVisibleBranches } from '@/data/repositories/branchRepository'
import { useClinicSettings } from '@/data/repositories/clinicRepository'
import { getDoctorsByBranch } from '@/data/repositories/doctorRepository'
import { getPracticeHours, getTodayHours, isBranchOpenNow } from '@/data/repositories/scheduleRepository'
import { useReveal } from '@/hooks/useReveal'
import { getWeekdayLong, getWeekdayShort } from '@/lib/date'
import { cn } from '@/lib/cn'
import type { DayHours, Weekday } from '@/types'

const DISPLAY_ORDER: Weekday[] = [1, 2, 3, 4, 5, 6, 0]

function groupPracticeHoursRows(days: DayHours[]): { label: string; value: string }[] {
  const ordered = DISPLAY_ORDER.map((wd) => days.find((d) => d.weekday === wd)).filter(
    (d): d is DayHours => !!d,
  )
  const rows: { label: string; value: string }[] = []
  let i = 0
  while (i < ordered.length) {
    const valueOf = (d: DayHours) => (d.isClosed ? 'Tutup' : `${d.open} – ${d.close}`)
    const startValue = valueOf(ordered[i])
    let j = i
    while (j + 1 < ordered.length && valueOf(ordered[j + 1]) === startValue) j++

    const isSundayOnly = j === i && ordered[i].weekday === 0
    const label = isSundayOnly
      ? 'Minggu & hari libur'
      : i === j
        ? getWeekdayLong(ordered[i].weekday)
        : `${getWeekdayLong(ordered[i].weekday)} – ${getWeekdayLong(ordered[j].weekday)}`
    rows.push({ label, value: startValue })
    i = j + 1
  }
  return rows
}

export function CabangDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const clinic = useClinicSettings()
  const visibleBranches = useVisibleBranches()
  const branch = slug ? getBranchBySlug(slug) : undefined

  const { ref: mapRef, revealProps: mapRevealProps } = useReveal<HTMLDivElement>()
  const { ref: infoRef, revealProps: infoRevealProps } = useReveal<HTMLDivElement>({ delay: 100 })
  const { ref: doctorsRef, revealProps: doctorsRevealProps } = useReveal<HTMLDivElement>()

  if (!clinic.hasMultipleBranches) return <Navigate to="/" replace />
  if (!branch || !branch.isVisible) return <Navigate to="/cabang" replace />

  const hours = getPracticeHours(branch.id)
  const today = getTodayHours(branch.id)
  const isOpen = isBranchOpenNow(branch.id)
  const hoursLabel = today && !today.isClosed ? `Hari ini ${today.open} – ${today.close}` : 'Tutup hari ini'
  const doctors = getDoctorsByBranch(branch.id)
  const rows = hours ? groupPracticeHoursRows(hours.days) : []
  const mapsUrl = branch.gmapsUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address)}`

  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-20 pt-2 md:px-10">
      <p className="text-sm text-muted">
        <Link to="/" className="font-semibold text-teal">
          Beranda
        </Link>{' '}
        / Cabang
      </p>

      <div className="mb-2 mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Pilih cabang">
        {visibleBranches.map((b) => {
          const isActive = b.id === branch.id
          return (
            <button
              key={b.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => navigate(`/cabang/${b.slug}`)}
              className={cn(
                'rounded-pill px-[18px] py-[9px] text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal',
                isActive ? 'bg-ink text-white' : 'border-[1.5px] border-ink bg-transparent text-ink hover:bg-ivory',
              )}
            >
              {b.name.replace('Cabang ', '')}
            </button>
          )
        })}
      </div>

      <h1 className="mb-2 mt-2 font-display text-4xl font-medium leading-tight md:text-[52px]">{branch.name}</h1>
      <div className="flex items-center gap-2 text-[13px] font-semibold text-teal">
        {isOpen && <span className="h-2 w-2 rounded-full bg-open-dot" />}
        {isOpen ? 'Buka sekarang' : 'Tutup sekarang'} · {hoursLabel}
      </div>

      <div className="mt-9 flex flex-wrap items-start gap-7">
        <div ref={mapRef} {...mapRevealProps} className={cn(mapRevealProps.className, 'min-w-0 flex-[1_1_620px]')}>
          <div className="overflow-hidden rounded-card-lg border border-border">
            <MapDecoration height={320} />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {branch.photoLabels.map((label) => (
              <Photo key={label} label={label} aspect="square" className="aspect-auto! h-[130px] min-w-[180px] flex-1" />
            ))}
          </div>
          <p className="mt-2.5 text-xs text-muted">Peta dan foto fasilitas adalah placeholder. Tanpa foto pasien.</p>
        </div>

        <div
          ref={infoRef}
          {...infoRevealProps}
          className={cn(infoRevealProps.className, 'min-w-0 flex-[1_1_340px] max-w-[420px] rounded-card-lg border border-border bg-surface p-7')}
        >
          <div className="mb-3.5 flex gap-3 text-sm">
            <Icon name="pin" width={22} height={22} className="mt-0.5 flex-none text-teal" />
            <span>{branch.address}</span>
          </div>
          <div className="flex gap-3 text-sm">
            <Icon name="whatsapp-check" width={22} height={22} className="mt-0.5 flex-none text-teal" />
            <span>WhatsApp cabang: {branch.whatsappNumber}</span>
          </div>

          <h2 className="mb-2 mt-6 font-display text-[19px]">Jam praktik</h2>
          <div className="text-sm">
            {rows.map((row, i) => (
              <div
                key={row.label}
                className={cn('flex justify-between py-2.5', i < rows.length - 1 && 'border-b border-dashed border-border')}
              >
                <span>{row.label}</span>
                <span className="font-semibold">{row.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <Button to={`/reservasi?cabang=${branch.slug}`}>Reservasi cabang ini</Button>
            <Button href={mapsUrl} target="_blank" rel="noopener noreferrer" variant="secondary">
              Rute Google Maps
            </Button>
          </div>
        </div>
      </div>

      {doctors.length > 0 && (
        <div ref={doctorsRef} {...doctorsRevealProps} className={cn(doctorsRevealProps.className, 'mt-4 -mx-5 bg-sand px-5 py-18 md:-mx-10 md:px-10 md:py-24')}>
          <div className="mx-auto max-w-[1200px]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal">Dokter di cabang ini</p>
            <h2 className="mb-7 mt-2.5 font-display text-[32px] font-medium md:text-[38px]">Jadwal praktik</h2>
            <div className="flex flex-wrap gap-5">
              {doctors.map((doctor) => {
                const days = Array.from(new Set(doctor.schedule.filter((e) => e.branchId === branch.id).map((e) => e.weekday)))
                return (
                  <div
                    key={doctor.id}
                    className="flex min-w-0 flex-[1_1_280px] max-w-[380px] items-center gap-[18px] rounded-card-sm border border-border bg-surface p-6"
                  >
                    <Avatar initials={doctor.initials} seed={doctor.avatarSeed} size="md" />
                    <div className="min-w-0">
                      <p className="font-display text-lg font-medium">{doctor.name}</p>
                      <p className="text-[13px] font-semibold text-teal">{doctor.specialty}</p>
                      <p className="mt-2 inline-block rounded-pill bg-mint px-3 py-[3px] text-xs font-semibold text-teal">
                        {days
                          .sort((a, b) => a - b)
                          .map((d) => getWeekdayShort(d))
                          .join(' · ')}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <div className="mt-18 md:mt-24">
        <CtaBanner
          title={`Reservasi di ${branch.name}.`}
          subtitle="Pilih layanan dan jam yang tersedia. Admin cabang mengonfirmasi lewat WhatsApp."
          buttonLabel="Reservasi online"
          buttonTo={`/reservasi?cabang=${branch.slug}`}
        />
      </div>
    </div>
  )
}
