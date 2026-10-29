import { getWeekday, getWeekdayShort, toISODate } from '@/lib/date'
import { isDateClosedForBranch } from '@/data/repositories/scheduleRepository'
import { cn } from '@/lib/cn'

export interface DatePicker7DayProps {
  branchId: string
  dates: Date[]
  selectedDate: string
  onSelect: (dateISO: string) => void
}

export function DatePicker7Day({ branchId, dates, selectedDate, onSelect }: DatePicker7DayProps) {
  return (
    <div
      className="mb-5 flex flex-wrap gap-2"
      role="group"
      aria-label="Pilih tanggal"
    >
      {dates.map((date) => {
        const iso = toISODate(date)
        const closed = isDateClosedForBranch(branchId, iso)
        const isSelected = iso === selectedDate
        return (
          <button
            key={iso}
            type="button"
            disabled={closed}
            aria-pressed={isSelected}
            onClick={() => onSelect(iso)}
            className={cn(
              'w-[76px] rounded-input px-0 py-2.5 text-center transition-colors duration-200',
              closed
                ? 'cursor-not-allowed border-[1.5px] border-sand-disabled bg-sand-neutral text-muted'
                : isSelected
                  ? 'border-[1.5px] border-teal bg-teal text-white'
                  : 'border-[1.5px] border-[#cfd8d4] bg-white text-ink hover:border-teal-bright',
            )}
          >
            <span className="block text-xs font-semibold">{getWeekdayShort(getWeekday(date))}</span>
            <span className="block font-display text-[22px] leading-tight">{date.getDate()}</span>
            <span className="block text-[11px]">{closed ? 'Tutup' : 'Buka'}</span>
          </button>
        )
      })}
    </div>
  )
}
