import type { RoleId } from './role'

export interface User {
  id: string
  name: string
  email: string
  role: RoleId
  branchId?: string
  mfaEnabled: boolean
  lastLoginAt?: string
}
