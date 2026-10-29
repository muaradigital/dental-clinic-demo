import { cn } from '@/lib/cn'

export function Logo({ size = 'md', onDark }: { size?: 'sm' | 'md' | 'lg'; onDark?: boolean }) {
  const boxSize = size === 'lg' ? 'h-10 w-10' : 'h-[38px] w-[38px]'
  const wordmarkSize = size === 'lg' ? 'text-2xl' : 'text-[22px]'
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className={cn('flex items-center justify-center rounded-[12px]', boxSize)}
        style={{ background: 'linear-gradient(135deg,#0f766e,#14b8a6)' }}
        aria-hidden
      >
        <svg viewBox="0 0 200 200" className="h-5 w-5 fill-white">
          <path d="M100 30C70 10 30 25 35 70c3 30 15 45 20 80 3 25 17 35 25 10 6-20 14-25 20-25s14 5 20 25c8 25 22 15 25-10 5-35 17-50 20-80 5-45-35-60-65-40z" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn('font-display font-semibold', wordmarkSize, onDark ? 'text-white' : 'text-ink')}>
          Arunika
        </span>
        <span
          className={cn(
            'text-[10px] font-semibold uppercase tracking-[0.16em]',
            onDark ? 'text-on-dark-muted' : 'text-muted',
          )}
        >
          Klinik Gigi
        </span>
      </span>
    </span>
  )
}
