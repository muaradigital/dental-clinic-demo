import type { ElementType, HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'static' | 'interactive'
  padding?: 'default' | 'compact'
  as?: ElementType
  children: ReactNode
  className?: string
}

export function Card({ variant = 'static', padding = 'default', as, children, className, ...rest }: CardProps) {
  const Component = as ?? 'div'
  return (
    <Component
      className={cn(
        'rounded-card-sm border border-border bg-surface',
        padding === 'default' ? 'p-6' : 'p-4',
        variant === 'interactive' &&
          'transition-[transform,box-shadow,border-color] duration-[450ms] ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-2 hover:border-teal-bright/40 hover:shadow-lift',
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  )
}
