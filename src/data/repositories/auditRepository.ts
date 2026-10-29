import { useShallow } from 'zustand/react/shallow'
import { useDemoStore } from '@/store/useDemoStore'
import type { AuditActionType, AuditLogEntry } from '@/types'

export function getAuditLog(filter?: { actionType?: AuditActionType; branchId?: string }): AuditLogEntry[] {
  let log = useDemoStore.getState().auditLog
  if (filter?.actionType) log = log.filter((e) => e.actionType === filter.actionType)
  if (filter?.branchId) log = log.filter((e) => e.branchId === filter.branchId)
  return log
}

export function useAuditLog(filter?: { actionType?: AuditActionType; branchId?: string }): AuditLogEntry[] {
  return useDemoStore(
    useShallow((s) => {
      let log = s.auditLog
      if (filter?.actionType) log = log.filter((e) => e.actionType === filter.actionType)
      if (filter?.branchId) log = log.filter((e) => e.branchId === filter.branchId)
      return log
    }),
  )
}
