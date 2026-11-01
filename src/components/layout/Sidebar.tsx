import { NavLink } from 'react-router-dom'
import { ROLE_CONFIG } from '@/lib/permissions'
import { useDemoStore } from '@/store/useDemoStore'
import { cn } from '@/lib/cn'
import { Logo } from './Logo'
import { BranchSwitcherDropdown } from './BranchSwitcherDropdown'
import { RoleSwitcherDropdown } from './RoleSwitcherDropdown'
import { CONTENT_NAV_ITEMS, OPERATIONAL_NAV_ITEMS } from './dashboardNavConfig'

export interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const SECTION_LABEL_CLASS = 'mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-on-dark-muted'

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const activeRole = useDemoStore((s) => s.activeRole)
  const config = activeRole ? ROLE_CONFIG[activeRole] : null

  const operationalItems = OPERATIONAL_NAV_ITEMS.filter((item) => config?.dashboardNav.operational.includes(item.key))
  const contentItems = CONTENT_NAV_ITEMS.filter((item) => config?.dashboardNav.content.includes(item.key))

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'block rounded-[12px] px-3.5 py-2.5 text-sm transition-colors duration-200',
      isActive ? 'bg-teal font-semibold text-white' : 'text-on-dark hover:bg-white/8 hover:text-white',
    )

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex w-[260px] shrink-0 flex-col bg-ink px-5 text-white transition-transform duration-300',
        'md:sticky md:top-0 md:h-screen md:translate-x-0 md:self-start',
        isOpen ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      {/* Fixed header: logo + branch switcher, never scrolls */}
      <div className="shrink-0 pb-5 pt-6">
        <Logo onDark />
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-on-dark-muted">Panel klinik</p>
        <div className="mt-6">
          <BranchSwitcherDropdown />
        </div>
      </div>

      {/* Scrollable middle: the only part that scrolls when the combined menu overflows */}
      <nav aria-label="Navigasi dasbor" className="flex-1 overflow-y-auto" onClick={onClose}>
        {operationalItems.length > 0 && (
          <div className="mb-5">
            <p className={SECTION_LABEL_CLASS}>Operasional</p>
            <ul className="flex flex-col gap-1">
              {operationalItems.map((item) => (
                <li key={item.key}>
                  <NavLink to={item.to} className={navLinkClass}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}

        {contentItems.length > 0 && (
          <div className="mb-5">
            <p className={SECTION_LABEL_CLASS}>Konten website</p>
            <ul className="flex flex-col gap-1">
              {contentItems.map((item) => (
                <li key={item.key}>
                  <NavLink to={item.to} className={navLinkClass}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* Fixed footer: role switcher, never scrolls (it supplies its own border-t/pt-4) */}
      <div className="shrink-0 pb-6">
        <RoleSwitcherDropdown />
      </div>
    </aside>
  )
}
