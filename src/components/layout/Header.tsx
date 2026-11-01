import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Button } from '@/components/primitives'
import { useClinicSettings } from '@/data/repositories/clinicRepository'
import { useStickyHeader } from '@/hooks/useStickyHeader'
import { cn } from '@/lib/cn'
import { Logo } from './Logo'
import { MobileMenu } from './MobileMenu'

const BASE_NAV_LINKS = [
  { to: '/', label: 'Beranda' },
  { to: '/layanan', label: 'Layanan' },
  { to: '/dokter', label: 'Dokter' },
  { to: '/cabang', label: 'Cabang' },
  { to: '/tentang', label: 'Tentang & FAQ' },
]

export function Header() {
  const isScrolled = useStickyHeader(20)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const clinic = useClinicSettings()
  // "Satu lokasi" hides the Cabang nav item — its page/picker have nothing to show.
  const NAV_LINKS = clinic.hasMultipleBranches ? BASE_NAV_LINKS : BASE_NAV_LINKS.filter((l) => l.to !== '/cabang')

  return (
    <header className={cn('fixed inset-x-0 top-0 z-50 transition-all duration-400')}>
      <div className="mx-auto max-w-[1200px] px-5 pt-4 md:px-10">
        <div
          className={cn(
            'flex items-center justify-between rounded-pill border border-transparent px-4 py-2.5 transition-all duration-400 md:px-5',
            isScrolled && 'border-white/60 bg-white/80 shadow-lift backdrop-blur-md',
          )}
        >
          <NavLink to="/" aria-label="Beranda Klinik Gigi Arunika">
            <Logo />
          </NavLink>

          <nav aria-label="Navigasi utama" className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-pill px-3.5 py-2 text-sm font-medium transition-colors duration-200',
                    isActive ? 'bg-mint text-ink' : 'text-muted hover:bg-mint/60 hover:text-ink',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Button to="/login" variant="outline-light" size="sm">
              Demo dashboard
            </Button>
            <Button to="/reservasi" size="sm">
              Reservasi
            </Button>
          </div>

          <button
            type="button"
            aria-label={isMenuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="relative flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span
              className={cn(
                'h-[1.5px] w-5 bg-ink transition-all duration-300',
                isMenuOpen && 'translate-y-[3px] rotate-45',
              )}
            />
            <span
              className={cn(
                'h-[1.5px] w-5 bg-ink transition-all duration-300',
                isMenuOpen && '-translate-y-[3px] -rotate-45',
              )}
            />
          </button>
        </div>

        <MobileMenu isOpen={isMenuOpen} links={NAV_LINKS} onNavigate={() => setIsMenuOpen(false)} />
      </div>
    </header>
  )
}
