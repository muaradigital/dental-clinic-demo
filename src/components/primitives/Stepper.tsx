import { cn } from '@/lib/cn'

export interface StepperStep {
  key: string
  label: string
}

export interface StepperProps {
  steps: StepperStep[]
  currentIndex: number
  className?: string
}

export function Stepper({ steps, currentIndex, className }: StepperProps) {
  return (
    <ol className={cn('flex items-center gap-2', className)}>
      {steps.map((step, index) => {
        const isCurrent = index === currentIndex
        const isPast = index < currentIndex
        return (
          <li key={step.key} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'flex h-[26px] w-[26px] items-center justify-center rounded-full text-xs font-semibold',
                  isCurrent && 'bg-teal text-white',
                  isPast && 'bg-teal-soft text-white',
                  !isCurrent && !isPast && 'bg-sand-disabled text-muted',
                )}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {index + 1}
              </span>
              <span className={cn('text-sm', isCurrent ? 'font-semibold text-ink' : 'text-muted')}>{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <span className={cn('h-px w-6', isPast ? 'bg-teal-soft' : 'bg-border')} aria-hidden />
            )}
          </li>
        )
      })}
    </ol>
  )
}
