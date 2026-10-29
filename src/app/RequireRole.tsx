import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { ROLE_CONFIG } from '@/lib/permissions'
import { useDemoStore } from '@/store/useDemoStore'
import type { ContentNavKey, OperationalNavKey } from '@/types'

export interface RequireRoleProps {
  children: ReactNode
  nav?: { mode: 'operational'; key: OperationalNavKey } | { mode: 'content'; key: ContentNavKey }
}

/**
 * Two-tier guard: unauthenticated users bounce to /masuk; authenticated
 * users whose role doesn't include the given nav key bounce to their own
 * default landing route. Driven entirely by ROLE_CONFIG so this can never
 * disagree with what the Sidebar shows or the Pengguna page's matrix claims.
 */
export function RequireRole({ children, nav }: RequireRoleProps) {
  const isAuthenticated = useDemoStore((s) => s.isAuthenticated)
  const activeRole = useDemoStore((s) => s.activeRole)
  const location = useLocation()

  if (!isAuthenticated || !activeRole) {
    return <Navigate to="/masuk" state={{ from: location }} replace />
  }

  if (nav) {
    const config = ROLE_CONFIG[activeRole]
    const allowed =
      nav.mode === 'operational'
        ? config.dashboardNav.operational.includes(nav.key)
        : config.dashboardNav.content.includes(nav.key)
    if (!allowed) {
      return <Navigate to={config.defaultLandingRoute} replace />
    }
  }

  return children
}
