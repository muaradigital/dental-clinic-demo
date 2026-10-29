import { getWeekdayHoursLabel } from '@/data/repositories/scheduleRepository'
import { cn } from '@/lib/cn'
import type { Branch } from '@/types'

export interface BranchPickerProps {
  branches: Branch[]
  selectedId: string | null
  onSelect: (branchId: string) => void
}

export function BranchPicker({ branches, selectedId, onSelect }: BranchPickerProps) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-muted">Cabang</p>
      <div className="mb-5 flex flex-wrap gap-2.5" role="group" aria-label="Pilih cabang">
        {branches.map((branch) => {
          const isSelected = branch.id === selectedId
          return (
            <button
              key={branch.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(branch.id)}
              className={cn(
                'min-w-[160px] flex-1 rounded-input border-[1.5px] px-[18px] py-3 text-left transition-colors duration-200',
                isSelected ? 'border-teal bg-teal text-white' : 'border-[#cfd8d4] bg-white text-ink hover:border-teal-bright',
              )}
            >
              <span className="block text-sm font-semibold">{branch.name}</span>
              <span className={cn('block text-xs', isSelected ? 'opacity-80' : 'text-muted')}>
                {getWeekdayHoursLabel(branch.id)}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
