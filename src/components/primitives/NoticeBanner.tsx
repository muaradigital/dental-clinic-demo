import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface NoticeBannerProps {
  tone?: 'warning' | 'info' | 'danger'
  title?: string
  children: ReactNode
  className?: string
}

const TONE_CLASSES = {
  warning: 'bg-notice-bg border-notice-border text-notice-text',
  info: 'bg-mint-3 border-mint-2 text-teal-soft',
  danger: 'bg-danger-bg border-danger-text/30 text-danger-text',
}

export function NoticeBanner({ tone = 'warning', title, children, className }: NoticeBannerProps) {
  return (
    <div className={cn('rounded-chip border px-3.5 py-2.5 text-xs', TONE_CLASSES[tone], className)} role="note">
      {title && <p className="mb-1 font-semibold">{title}</p>}
      <p>{children}</p>
    </div>
  )
}
