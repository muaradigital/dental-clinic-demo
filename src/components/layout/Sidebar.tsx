import { NavLink } from 'react-router-dom'
import { ROLE_CONFIG } from '@/lib/permissions'
import { useDemoStore } from '@/store/useDemoStore'
import { cn } from '@/lib/cn'
import { Logo } from './Logo'
import { BranchSwitcherDropdown } from './BranchSwitcherDropdown'
import { RoleSwitcherDropdown } from './RoleSwitcherDropdown'
import { CONTENT_NAV_ITEMS, OPERATIONAL_NAV_ITEMS } from './dashboardNavConfig'

export interface SidebarProps {
  mode: 'operational' | 'content'
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ mode, isOpen, onClose }: SidebarProps) {
  const activeRole = useDemoStore((s) => s.activeRole)
  const config = activeRole ? ROLE_CONFIG[activeRole] : null

  const items =
    mode === 'operational'
      ? OPERATIONAL_NAV_ITEMS.filter((item) => config?.dashboardNav.operational.includes(item.key))
      : CONTENT_NAV_ITEMS.filter((item) => config?.dashboardNav.content.includes(item.key))

  const canSwitchToContent = (config?.dashboardNav.content.length ?? 0) > 0
  const canSwitchToOperational = (config?.dashboardNav.operational.length ?? 0) > 0

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex w-[260px] shrink-0 flex-col overflow-y-auto bg-ink px-5 py-6 text-white transition-transform duration-300 md:static md:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      <div className="mb-6">
        <Logo onDark />
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-on-dark-muted">
          {mode === 'operational' ? 'Panel klinik' : 'Konten website'}
        </p>
      </div>

      {mode === 'operational' && (
        <div className="mb-6">
          <BranchSwitcherDropdown />
        </div>
      )}

      <nav aria-label="Navigasi dasbor" className="flex-1" onClick={onClose}>
        <ul className="flex flex-col gap-1">
          {items.map((item) => (
            <li key={item.key}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'block rounded-[12px] px-3.5 py-2.5 text-sm transition-colors duration-200',
                    isActive ? 'bg-teal font-semibold text-white' : 'text-on-dark hover:bg-white/8 hover:text-white',
                  )
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {mode === 'content' && canSwitchToOperational && (
          <NavLink to="/dashboard/janji" className="mt-4 inline-block text-[13px] text-on-dark-muted hover:text-white">
            ← Panel operasional
          </NavLink>
        )}
        {mode === 'operational' && canSwitchToContent && (
          <NavLink
            to="/dashboard/content/layanan"
            className="mt-4 inline-block text-[13px] text-on-dark-muted hover:text-white"
          >
            Konten website →
          </NavLink>
        )}
      </nav>

      <RoleSwitcherDropdown />
    </aside>
  )
}
