import { Card } from '@/components/primitives'
import { useReveal, type UseRevealOptions } from '@/hooks/useReveal'
import type { Service } from '@/types'
import { Icon, type IconKey } from './icons'

export interface ServiceCardProps {
  service: Service
  delay?: UseRevealOptions['delay']
}

export function ServiceCard({ service, delay }: ServiceCardProps) {
  const { ref, revealProps } = useReveal<HTMLDivElement>({ delay })

  return (
    <div ref={ref} {...revealProps}>
      <Card variant="interactive" className="group h-full">
        <span className="mb-[18px] flex h-[54px] w-[54px] items-center justify-center rounded-input bg-mint text-teal transition-[background-color] duration-400 group-hover:bg-teal group-hover:[&>svg]:rotate-[-8deg] group-hover:[&>svg]:scale-[1.06] group-hover:[&>svg]:stroke-white">
          <Icon name={service.icon as IconKey} className="transition-transform duration-300" />
        </span>
        <h3 className="mb-2 text-[1.3rem] font-display font-medium">{service.name}</h3>
        <p className="text-[0.93rem] text-muted">{service.shortDescription}</p>
      </Card>
    </div>
  )
}
