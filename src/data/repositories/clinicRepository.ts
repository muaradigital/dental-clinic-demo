import { useDemoStore } from '@/store/useDemoStore'
import type { ClinicSettings } from '@/types'

export function getClinicSettings(): ClinicSettings {
  return useDemoStore.getState().clinic
}

export function updateClinicSettings(patch: Partial<ClinicSettings>): void {
  useDemoStore.getState().updateClinicSettings(patch)
}

export function useClinicSettings(): ClinicSettings {
  return useDemoStore((s) => s.clinic)
}
