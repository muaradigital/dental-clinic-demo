import { Button } from '@/components/primitives'
import { useReveal } from '@/hooks/useReveal'
import { Icon } from './icons'

export interface CtaBannerProps {
  title: string
  subtitle: string
  buttonLabel: string
  buttonTo?: string
}

export function CtaBanner({ title, subtitle, buttonLabel, buttonTo = '/reservasi' }: CtaBannerProps) {
  const { ref, revealProps } = useReveal<HTMLDivElement>()

  return (
    <div
      ref={ref}
      {...revealProps}
      className={`${revealProps.className} relative overflow-hidden rounded-banner px-8 py-[52px] text-center text-white md:px-14 md:py-14`}
      style={{ background: 'linear-gradient(140deg,#0c3b3a,#0f5f5a 60%,#117a70)' }}
    >
      <div
        className="pointer-events-none absolute -right-28 -top-40 h-[420px] w-[420px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(20,184,166,.45), transparent 65%)',
          animation: 'hero-drift 14s ease-in-out infinite alternate',
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-xl">
        <h2 className="font-display text-[1.9rem] font-medium md:text-[2.25rem]">{title}</h2>
        <p className="mt-3 text-[#b8dcd5]">{subtitle}</p>
        <div className="mt-8 flex justify-center">
          <Button to={buttonTo} variant="secondary" icon={<Icon name="arrow-right" width={16} height={16} />} className="border-white! bg-white! text-ink! hover:bg-white/90!">
            {buttonLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
