import { hashToIndex } from '@/lib/hash'
import { cn } from '@/lib/cn'

const GRADIENTS = [
  'linear-gradient(135deg,#0f766e,#14b8a6)',
  'linear-gradient(135deg,#134e4a,#5eead4)',
  'linear-gradient(135deg,#0b5a53,#2bb3a3)',
  'linear-gradient(135deg,#a8925a,#e6d3a0)',
]

const SIZE_CLASSES = {
  sm: 'h-10 w-10 text-sm',
  md: 'h-[76px] w-[76px] text-xl',
  lg: 'h-[92px] w-[92px] text-2xl',
}

export interface AvatarProps {
  initials: string
  seed: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  /** Slowly rotating dashed ring, ported from the mockup's `.avatar::after` — opt-in
   * since it's only meant for the public marketing doctor card, not denser dashboard
   * avatar usages (schedule tables, reviewer cards, content editors). */
  ring?: boolean
}

export function Avatar({ initials, seed, size = 'md', className, ring }: AvatarProps) {
  const gradient = GRADIENTS[hashToIndex(seed, GRADIENTS.length)]
  return (
    <span className={cn('relative inline-flex', className)}>
      {ring && (
        <span
          className="absolute -inset-[7px] rounded-full border-[1.5px] border-dashed"
          style={{ borderColor: 'rgba(15,118,110,.4)', animation: 'hero-spin 20s linear infinite' }}
          aria-hidden
        />
      )}
      <span
        className={cn(
          'inline-flex items-center justify-center rounded-full font-display font-medium text-white',
          SIZE_CLASSES[size],
        )}
        style={{ background: gradient }}
        aria-hidden
      >
        {initials}
      </span>
    </span>
  )
}
