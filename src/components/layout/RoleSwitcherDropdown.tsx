import { useNavigate } from 'react-router-dom'
import { users } from '@/data/seed/users'
import { ROLE_CONFIG, ROLE_ORDER } from '@/lib/permissions'
import { useDemoStore } from '@/store/useDemoStore'
import type { RoleId } from '@/types'

export function RoleSwitcherDropdown() {
  const navigate = useNavigate()
  const activeRole = useDemoStore((s) => s.activeRole)
  const activeUserId = useDemoStore((s) => s.activeUserId)
  const login = useDemoStore((s) => s.login)

  const activeUser = users.find((u) => u.id === activeUserId)

  function handleRoleChange(role: RoleId) {
    const representativeUser = users.find((u) => u.role === role)
    if (!representativeUser) return
    login(representativeUser.id)
    navigate(ROLE_CONFIG[role].defaultLandingRoute)
  }

  return (
    <div className="border-t border-white/12 pt-4">
      {activeUser && (
        <p className="mb-2 truncate text-sm font-semibold text-white" title={activeUser.name}>
          {activeUser.name}
        </p>
      )}
      <label htmlFor="role-switcher" className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-on-dark-muted">
        Peran (pengganti login)
      </label>
      <select
        id="role-switcher"
        value={activeRole ?? ''}
        onChange={(e) => handleRoleChange(e.target.value as RoleId)}
        className="w-full rounded-input border border-white/14 bg-white/8 px-3.5 py-2 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-teal-bright"
      >
        {ROLE_ORDER.map((role) => (
          <option key={role} value={role} className="text-ink">
            {ROLE_CONFIG[role].label}
          </option>
        ))}
      </select>
    </div>
  )
}
