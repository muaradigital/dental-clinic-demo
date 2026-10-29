import { cn } from '@/lib/cn'
import type { ServiceCategory } from '@/types'

export interface ServiceCategoryPickerProps {
  categories: ServiceCategory[]
  selectedId: string | null
  onSelect: (categoryId: string) => void
}

export function ServiceCategoryPicker({ categories, selectedId, onSelect }: ServiceCategoryPickerProps) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-muted">Kategori layanan</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Pilih kategori layanan">
        {categories.map((category) => {
          const isSelected = category.id === selectedId
          return (
            <button
              key={category.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(category.id)}
              className={cn(
                'rounded-pill border-[1.5px] px-4 py-[9px] text-[13px] font-semibold transition-colors duration-200',
                isSelected ? 'border-teal bg-teal text-white' : 'border-[#cfd8d4] bg-white text-ink hover:border-teal-bright',
              )}
            >
              {category.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
