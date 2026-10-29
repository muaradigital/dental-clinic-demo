import { useDemoStore } from '@/store/useDemoStore'

export function resetDemoData(): void {
  useDemoStore.getState().resetDemoData()
}
