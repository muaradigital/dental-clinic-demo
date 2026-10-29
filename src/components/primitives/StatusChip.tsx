import { STATUS_TONE_CLASSES, type StatusTone } from '@/lib/status'
import { cn } from '@/lib/cn'

export interface StatusChipProps {
  tone: StatusTone
  label: string
  className?: string
}

export function StatusChip({ tone, label, className }: StatusChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill px-3 py-[3px] text-xs font-semibold',
        STATUS_TONE_CLASSES[tone],
        className,
      )}
    >
      {label}
    </span>
  )
}
