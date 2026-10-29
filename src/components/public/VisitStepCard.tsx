import { useReveal, type UseRevealOptions } from '@/hooks/useReveal'
import type { visitSteps } from '@/data/seed/homepage'
import { Icon } from './icons'

export interface VisitStepCardProps {
  step: (typeof visitSteps)[number]
  delay?: UseRevealOptions['delay']
}

export function VisitStepCard({ step, delay }: VisitStepCardProps) {
  const { ref, revealProps } = useReveal<HTMLDivElement>({ delay })

  return (
    <div
      ref={ref}
      {...revealProps}
      className={`${revealProps.className} rounded-card border border-white/12 bg-white/5 p-6`}
    >
      <div className="flex items-center gap-4">
        <span className="font-display text-3xl font-medium text-teal-on-dark">{step.number}</span>
        <span className="flex h-10 w-10 items-center justify-center rounded-input bg-white/10 text-teal-on-dark">
          <Icon name={step.icon} width={20} height={20} />
        </span>
      </div>
      <h3 className="mt-4 font-display text-lg font-medium text-white">{step.title}</h3>
      <p className="mt-1.5 text-sm text-on-dark">{step.description}</p>
    </div>
  )
}
