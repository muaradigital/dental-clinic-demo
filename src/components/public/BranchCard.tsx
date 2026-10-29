import { Link } from 'react-router-dom'
import { getTodayHours, isBranchOpenNow } from '@/data/repositories/scheduleRepository'
import { useReveal, type UseRevealOptions } from '@/hooks/useReveal'
import { cn } from '@/lib/cn'
import type { Branch } from '@/types'
import { Icon } from './icons'
import { MapDecoration } from './MapDecoration'

export interface BranchCardProps {
  branch: Branch
  delay?: UseRevealOptions['delay']
}

export function BranchCard({ branch, delay }: BranchCardProps) {
  const { ref, revealProps } = useReveal<HTMLDivElement>({ delay })
  const today = getTodayHours(branch.id)
  const isOpen = isBranchOpenNow(branch.id)
  const hoursLabel = today && !today.isClosed ? `Hari ini ${today.open} – ${today.close}` : 'Tutup hari ini'

  return (
    <div ref={ref} {...revealProps}>
      <Link
        to={`/cabang/${branch.slug}`}
        className="group block overflow-hidden rounded-card-sm border border-border bg-surface transition-[transform,box-shadow,border-color] duration-450 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-2 hover:border-teal-bright/40 hover:shadow-lift"
      >
        <MapDecoration />
        <div className="p-6 pt-5">
          <div className="mb-2 flex items-center justify-between gap-3 text-[0.78rem] font-semibold">
            <span className={cn(isOpen ? 'inline-flex items-center gap-1.5 text-teal' : 'text-muted')}>
              {isOpen && <span className="h-2 w-2 rounded-full bg-open-dot" />}
              {isOpen ? 'Buka sekarang' : 'Tutup sekarang'}
            </span>
            <span className="text-muted">{hoursLabel}</span>
          </div>
          <h3 className="font-display text-2xl font-medium">{branch.name}</h3>
          <p className="mt-1 text-sm text-muted">{branch.address}</p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-teal">
            Lihat cabang
            <Icon
              name="arrow-right"
              width={16}
              height={16}
              className="transition-transform duration-300 group-hover:translate-x-1.5"
            />
          </span>
        </div>
      </Link>
    </div>
  )
}
