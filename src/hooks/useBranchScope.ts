import { ROLE_CONFIG } from '@/lib/permissions'
import { useDemoStore } from '@/store/useDemoStore'

export interface BranchScope {
  scope: 'all' | 'locked'
  lockedBranchId?: string
  effectiveBranchId: string | null
}

export function useBranchScope(): BranchScope {
  const role = useDemoStore((s) => s.activeRole)
  const activeBranchId = useDemoStore((s) => s.activeBranchId)

  if (!role) {
    return { scope: 'all', effectiveBranchId: activeBranchId }
  }

  const config = ROLE_CONFIG[role]
  if (config.branchScope === 'locked') {
    return { scope: 'locked', lockedBranchId: activeBranchId ?? undefined, effectiveBranchId: activeBranchId }
  }
  return { scope: 'all', effectiveBranchId: activeBranchId }
}
