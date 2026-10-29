import { useShallow } from 'zustand/react/shallow'
import { useDemoStore } from '@/store/useDemoStore'
import type { Branch } from '@/types'

export function getBranches(): Branch[] {
  return useDemoStore.getState().branches
}

export function getVisibleBranches(): Branch[] {
  const { branches, clinic } = useDemoStore.getState()
  if (!clinic.hasMultipleBranches) return []
  return branches.filter((b) => b.isVisible)
}

export function getBranchBySlug(slug: string): Branch | undefined {
  return useDemoStore.getState().branches.find((b) => b.slug === slug)
}

export function getBranchById(id: string): Branch | undefined {
  return useDemoStore.getState().branches.find((b) => b.id === id)
}

export function setBranchVisibility(branchId: string, visible: boolean): void {
  useDemoStore.getState().setBranchVisibility(branchId, visible)
}

export function useBranches(): Branch[] {
  return useDemoStore((s) => s.branches)
}

export function useVisibleBranches(): Branch[] {
  return useDemoStore(
    useShallow((s) => (s.clinic.hasMultipleBranches ? s.branches.filter((b) => b.isVisible) : [])),
  )
}
