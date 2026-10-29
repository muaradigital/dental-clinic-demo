import { useAvailableSlots } from '@/data/repositories/scheduleRepository'
import { cn } from '@/lib/cn'

export interface SlotGridProps {
  branchId: string
  date: string
  dateLabel: string
  selectedTime: string | null
  onSelect: (time: string) => void
}

const LEGEND = [
  { label: 'Dipilih', swatchClassName: 'bg-teal' },
  { label: 'Tersedia', swatchClassName: 'border-[1.5px] border-[#cfd8d4]' },
  { label: 'Penuh', swatchClassName: 'bg-sand-disabled' },
]

export function SlotGrid({ branchId, date, dateLabel, selectedTime, onSelect }: SlotGridProps) {
  const slots = useAvailableSlots(branchId, date)

  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-muted">Jam tersedia · {dateLabel}</p>
      {slots.length === 0 ? (
        <p className="rounded-input border border-border bg-sand-neutral px-4 py-3 text-sm text-muted">
          Cabang tutup pada tanggal ini.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2" role="group" aria-label={`Pilih jam untuk ${dateLabel}`}>
          {slots.map((slot) => {
            const isFull = slot.status === 'penuh'
            const isSelected = slot.time === selectedTime
            return (
              <button
                key={slot.time}
                type="button"
                disabled={isFull}
                aria-pressed={isSelected}
                onClick={() => onSelect(slot.time)}
                className={cn(
                  'min-w-[84px] rounded-input px-4 py-2.5 text-[13px] font-semibold transition-colors duration-200',
                  isFull
                    ? 'cursor-not-allowed border-[1.5px] border-sand-disabled bg-sand-disabled text-muted line-through'
                    : isSelected
                      ? 'border-[1.5px] border-teal bg-teal text-white'
                      : 'border-[1.5px] border-[#cfd8d4] bg-white text-ink hover:border-teal-bright',
                )}
              >
                {slot.time}
                {isFull && ' · penuh'}
              </button>
            )
          })}
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted">
        {LEGEND.map((item) => (
          <span key={item.label} className="inline-flex items-center gap-1.5">
            <span className={cn('inline-block h-2.5 w-2.5 rounded-[3px]', item.swatchClassName)} />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  )
}
