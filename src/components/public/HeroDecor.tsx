import { hero } from '@/data/seed/homepage'
import { Icon } from './icons'

const TOOTH_PATH =
  'M100 30C70 10 30 25 35 70c3 30 15 45 20 80 3 25 17 35 25 10 6-20 14-25 20-25s14 5 20 25c8 25 22 15 25-10 5-35 17-50 20-80 5-45-35-60-65-40z'

/** Ambient background blobs — transform/opacity only, decorative, killed by prefers-reduced-motion globally. */
export function HeroBlobs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute -right-24 -top-28 h-[420px] w-[420px] rounded-full opacity-50 blur-[70px]"
        style={{ background: '#bdeee2', animation: 'hero-drift 18s ease-in-out infinite alternate' }}
      />
      <div
        className="absolute -left-20 bottom-[-120px] h-[320px] w-[320px] rounded-full opacity-50 blur-[70px]"
        style={{
          background: '#f4e6c8',
          animation: 'hero-drift 18s ease-in-out infinite alternate',
          animationDelay: '-6s',
        }}
      />
      <div
        className="absolute left-[38%] top-[35%] h-[220px] w-[220px] rounded-full opacity-30 blur-[70px]"
        style={{
          background: '#cfe7ff',
          animation: 'hero-drift 18s ease-in-out infinite alternate',
          animationDelay: '-11s',
        }}
      />
    </div>
  )
}

/** Bottom-center "Scroll" cue, ported from the mockup — hidden under ~900px since the
 * stacked mobile hero has nothing useful directly below the fold to cue toward. */
export function HeroScrollCue() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: window.innerHeight - 20, behavior: 'smooth' })}
      className="absolute bottom-[22px] left-1/2 z-[2] hidden -translate-x-1/2 flex-col items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted min-[901px]:flex"
      aria-label="Gulir ke bagian berikutnya"
    >
      <span className="relative h-9 w-[22px] rounded-full border-[1.5px] border-teal">
        <span
          className="absolute left-1/2 top-[6px] h-[7px] w-[3px] -translate-x-1/2 rounded-full bg-teal-bright"
          style={{ animation: 'hero-wheel 1.8s infinite' }}
        />
      </span>
      Scroll
    </button>
  )
}

export function HeroArt() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[380px]" aria-hidden>
      <div
        className="absolute inset-[4%] rounded-full border-[1.5px] border-dashed border-teal/35"
        style={{ animation: 'hero-spin 40s linear infinite' }}
      />
      <div
        className="absolute inset-[18%] rounded-full border-[1.5px] border-dashed border-teal/35"
        style={{ animation: 'hero-spin-reverse 30s linear infinite' }}
      />

      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 m-auto h-[58%] w-[58%] drop-shadow-[0_30px_40px_rgba(15,118,110,0.28)]"
        style={{ animation: 'hero-float 6s ease-in-out infinite' }}
      >
        <defs>
          <linearGradient id="tooth-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#cdeee6" />
          </linearGradient>
        </defs>
        <path d={TOOTH_PATH} fill="url(#tooth-gradient)" stroke="#0f766e" strokeWidth={2.5} />
        <path
          d="M62 52c8-8 20-8 28-2"
          stroke="#14b8a6"
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
          opacity={0.7}
        />
      </svg>

      <Icon
        name="sparkles"
        className="absolute right-[14%] top-[10%] text-teal-bright"
        style={{ animation: 'hero-twinkle 3s ease-in-out infinite' }}
        width={22}
        height={22}
      />
      <Icon
        name="sparkles"
        className="absolute bottom-[18%] left-[8%] text-teal-bright"
        style={{ animation: 'hero-twinkle 3s ease-in-out infinite', animationDelay: '-1s' }}
        width={22}
        height={22}
      />
      <Icon
        name="sparkles"
        className="absolute left-[2%] top-[38%] text-teal-bright"
        style={{ animation: 'hero-twinkle 3s ease-in-out infinite', animationDelay: '-2s', scale: 0.7 }}
        width={18}
        height={18}
      />

      {hero.floatingChips.map((chip, i) => (
        <div
          key={chip.label}
          className={
            'absolute flex items-center gap-2.5 rounded-chip bg-white px-4 py-3 text-[0.82rem] font-medium text-ink shadow-lift ' +
            (i === 0 ? '-left-[6%] top-[8%]' : '-right-[4%] bottom-[10%]')
          }
          style={{ animation: 'hero-float 7s ease-in-out infinite', animationDelay: i === 1 ? '-3s' : undefined }}
        >
          {chip.icon === 'dot' ? (
            <span
              className="h-2.5 w-2.5 rounded-full bg-whatsapp"
              style={{ animation: 'wa-pulse 2s infinite' }}
            />
          ) : (
            <Icon name="check" className="text-teal" width={18} height={18} />
          )}
          {chip.label}
        </div>
      ))}
    </div>
  )
}
