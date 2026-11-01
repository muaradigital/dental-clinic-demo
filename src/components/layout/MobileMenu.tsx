import { NavLink } from 'react-router-dom'
import { Button } from '@/components/primitives'
import { cn } from '@/lib/cn'

export interface MobileMenuProps {
  isOpen: boolean
  links: { to: string; label: string }[]
  onNavigate: () => void
}

export function MobileMenu({ isOpen, links, onNavigate }: MobileMenuProps) {
  return (
    <nav
      aria-label="Navigasi mobile"
      className={cn(
        'mt-2 origin-top rounded-card-sm border border-border bg-white p-3 shadow-lift transition-all duration-350 md:hidden',
        isOpen ? 'pointer-events-auto scale-100 opacity-100' : 'pointer-events-none -translate-y-3.5 scale-[0.98] opacity-0',
      )}
    >
      <ul className="flex flex-col gap-1">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'block rounded-input px-3.5 py-2.5 text-sm font-medium',
                  isActive ? 'bg-mint text-ink' : 'text-muted hover:bg-mint/60 hover:text-ink',
                )
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex flex-col gap-2 border-t border-border pt-2">
        <Button to="/reservasi" size="sm" fullWidth onClick={onNavigate}>
          Reservasi
        </Button>
        <Button to="/login" variant="outline-light" size="sm" fullWidth onClick={onNavigate}>
          Demo dashboard
        </Button>
      </div>
    </nav>
  )
}
