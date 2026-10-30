import { useWeekSlotGrid } from '@/data/repositories/scheduleRepository'
import type { SlotStatus } from '@/lib/slots'
import { STATUS_TONE_CLASSES, type StatusTone } from '@/lib/status'
import { cn } from '@/lib/cn'

const LEGEND: { label: string; tone: StatusTone }[] = [
  { label: 'Tersedia', tone: 'soft-teal' },
  { label: 'Hampir penuh', tone: 'warning' },
  { label: 'Penuh', tone: 'danger' },
  { label: 'Ditutup', tone: 'neutral' },
]

const STATUS_TONE: Record<SlotStatus, StatusTone> = {
  tersedia: 'soft-teal',
  hampir_penuh: 'warning',
  penuh: 'danger',
  ditutup: 'neutral',
}

export interface WeekSlotGridTableProps {
  branchId: string
  weekStartDate: string
}

export function WeekSlotGridTable({ branchId, weekStartDate }: WeekSlotGridTableProps) {
  const grid = useWeekSlotGrid(branchId, weekStartDate)

  return (
    <div className="min-w-0 flex-1 basis-[640px] rounded-card border border-border bg-surface p-[22px]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2.5">
        <p className="font-display text-lg">Terisi / kuota per slot</p>
        <div className="flex flex-wrap gap-3.5 text-xs text-muted">
          {LEGEND.map((item) => (
            <span key={item.label} className="inline-flex items-center gap-1.5">
              <span className={cn('inline-block h-2.5 w-2.5 rounded-[3px]', STATUS_TONE_CLASSES[item.tone])} />
              {item.label}
            </span>
          ))}
        </div>
      </div>
      {grid && (
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="mb-1.5 flex gap-1.5">
              <div className="flex-none basis-14" />
              {grid.days.map((day) => (
                <div key={day.date} className="min-w-0 flex-1 text-center text-xs font-semibold text-muted">
                  {day.label}
                </div>
              ))}
            </div>
            {grid.times.map((time) => (
              <div key={time} className="mb-1.5 flex items-stretch gap-1.5">
                <div className="flex flex-none basis-14 items-center text-xs font-semibold text-muted">{time}</div>
                {grid.days.map((day) => {
                  const cell = day.cellsByTime.get(time)
                  const closureLabel = day.isClosed ? (day.closureName ? 'libur' : 'tutup') : null
                  const tone = closureLabel || !cell ? 'neutral' : STATUS_TONE[cell.status]
                  return (
                    <div
                      key={day.date}
                      className={cn(
                        'min-w-0 flex-1 rounded-input py-2 text-center text-[12.5px] font-semibold',
                        STATUS_TONE_CLASSES[tone],
                      )}
                    >
                      {closureLabel ?? (cell ? `${cell.filled}/${cell.quota}` : 'tutup')}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )}
      <p className="mt-3 text-xs text-muted">Minggu tutup. Kuota dan durasi slot diatur di kartu &quot;Aturan kuota&quot;.</p>
    </div>
  )
}
