import { Navigate } from 'react-router-dom'
import { ROLE_CONFIG } from '@/lib/permissions'
import { useDemoStore } from '@/store/useDemoStore'

export function DashboardIndexRedirect() {
  const activeRole = useDemoStore((s) => s.activeRole)
  if (!activeRole) return <Navigate to="/login" replace />
  return <Navigate to={ROLE_CONFIG[activeRole].defaultLandingRoute} replace />
}
