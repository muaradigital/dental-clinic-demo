import { cn } from '@/lib/cn'

export interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
  id?: string
  /** Accessible name for toggles with no visible label text (e.g. an inline table-row switch). */
  ariaLabel?: string
}

export function Toggle({ checked, onChange, label, description, disabled, id, ariaLabel }: ToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      {(label || description) && (
        <div>
          {label && (
            <label htmlFor={id} className="text-sm font-semibold text-ink">
              {label}
            </label>
          )}
          {description && <p className="mt-0.5 text-xs text-muted">{description}</p>}
        </div>
      )}
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel ?? label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-[42px] shrink-0 rounded-pill transition-colors duration-300',
          checked ? 'bg-teal' : 'bg-border',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        <span
          aria-hidden
          className={cn(
            'absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white transition-[left] duration-300',
            checked ? 'left-[21px]' : 'left-[3px]',
          )}
        />
      </button>
    </div>
  )
}
