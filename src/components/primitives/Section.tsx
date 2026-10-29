import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

const BACKGROUND_CLASSES = {
  ivory: 'bg-ivory text-ink',
  sand: 'bg-sand text-ink',
  dark: 'bg-ink text-white',
  white: 'bg-white text-ink',
}

export interface SectionProps {
  eyebrow?: string
  title?: ReactNode
  subtitle?: ReactNode
  background?: keyof typeof BACKGROUND_CLASSES
  children?: ReactNode
  className?: string
  containerClassName?: string
  id?: string
}

export function Section({
  eyebrow,
  title,
  subtitle,
  background = 'ivory',
  children,
  className,
  containerClassName,
  id,
}: SectionProps) {
  const isDark = background === 'dark'
  return (
    <section id={id} className={cn('py-18 md:py-24', BACKGROUND_CLASSES[background], className)}>
      <div className={cn('mx-auto max-w-[1200px] px-5 md:px-10', containerClassName)}>
        {(eyebrow || title || subtitle) && (
          <header className="mx-auto mb-10 max-w-2xl text-center">
            {eyebrow && (
              <p
                className={cn(
                  'mb-3 text-xs font-semibold uppercase tracking-[0.14em]',
                  isDark ? 'text-teal-on-dark' : 'text-teal',
                )}
              >
                {eyebrow}
              </p>
            )}
            {title && <h2 className="font-display text-3xl font-medium md:text-[42px]">{title}</h2>}
            {subtitle && (
              <p className={cn('mt-4 text-base', isDark ? 'text-on-dark' : 'text-muted')}>{subtitle}</p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  )
}
