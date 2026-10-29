import { hashToIndex } from '@/lib/hash'
import { cn } from '@/lib/cn'

const PLACEHOLDER_GRADIENTS = [
  'linear-gradient(135deg,#0f766e,#14b8a6)',
  'linear-gradient(135deg,#0b5a53,#134e4a)',
  'linear-gradient(135deg,#a8925a,#e6d3a0)',
]

const ASPECT_CLASSES = {
  square: 'aspect-square',
  video: 'aspect-video',
  wide: 'aspect-[16/7]',
}

export interface PhotoProps {
  label: string
  aspect?: keyof typeof ASPECT_CLASSES
  variant?: 'gradient' | 'map'
  src?: string
  className?: string
}

/**
 * Placeholder with a labeled, deterministic gradient fallback — no real
 * clinic photos exist yet. Swap in `src` later without touching callers.
 */
export function Photo({ label, aspect = 'video', variant = 'gradient', src, className }: PhotoProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={label}
        className={cn('w-full rounded-card-sm object-cover', ASPECT_CLASSES[aspect], className)}
      />
    )
  }

  const gradient =
    variant === 'map'
      ? 'linear-gradient(135deg,#e4f3ee,#cdeee6)'
      : PLACEHOLDER_GRADIENTS[hashToIndex(label, PLACEHOLDER_GRADIENTS.length)]

  return (
    <div
      role="img"
      aria-label={`${label} (contoh, bukan foto pasien)`}
      className={cn(
        'relative flex items-end rounded-card-sm p-4',
        ASPECT_CLASSES[aspect],
        variant === 'map' ? 'text-ink' : 'text-white',
        className,
      )}
      style={{ background: gradient }}
    >
      <span className="rounded-pill bg-black/10 px-3 py-1 text-xs font-semibold backdrop-blur-sm">{label}</span>
    </div>
  )
}
