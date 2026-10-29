import { cn } from '@/lib/cn'
import { Icon } from './icons'

export interface MapDecorationProps {
  className?: string
  height?: number
}

/** Decorative placeholder map: mint background, route lines, a pulsing pin. No real geodata. */
export function MapDecoration({ className, height = 150 }: MapDecorationProps) {
  return (
    <div className={cn('relative overflow-hidden bg-mint-4', className)} style={{ height }} aria-hidden>
      <svg viewBox="0 0 400 150" className="h-full w-full" preserveAspectRatio="none">
        <path d="M-10 40 C 80 10, 160 70, 260 30 S 380 60, 420 20" stroke="#fff" strokeWidth={3} fill="none" opacity={0.8} />
        <path d="M-10 110 C 90 130, 180 80, 280 120 S 380 90, 420 130" stroke="#fff" strokeWidth={3} fill="none" opacity={0.6} />
      </svg>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span
          className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal/40"
          style={{ animation: 'map-pulse 2.4s ease-out infinite' }}
        />
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-teal text-white shadow-lift">
          <Icon name="pin" width={18} height={18} />
        </span>
      </div>
    </div>
  )
}
