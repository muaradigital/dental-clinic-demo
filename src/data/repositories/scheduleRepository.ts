import { useShallow } from 'zustand/react/shallow'
import { getWeekday, now, parseTimeToMinutes } from '@/lib/date'
import { getAvailableSlots as computeAvailableSlots, getWeekSlotGrid as computeWeekGrid } from '@/lib/slots'
import { practiceHours } from '@/data/seed/practiceHours'
import { useDemoStore } from '@/store/useDemoStore'
import type { Closure, DayHours, PracticeHours, SlotSettings } from '@/types'

/**
 * Single source read by the homepage branch cards, the Reservasi slot
 * picker, and the dashboard — never duplicated per feature.
 */
export function getPracticeHours(branchId: string): PracticeHours | undefined {
  return practiceHours.find((p) => p.branchId === branchId)
}

export function getTodayHours(branchId: string, date: Date = now()): DayHours | undefined {
  const hours = getPracticeHours(branchId)
  const weekday = getWeekday(date)
  return hours?.days.find((d) => d.weekday === weekday)
}

export function isBranchOpenNow(branchId: string, date: Date = now()): boolean {
  const today = getTodayHours(branchId, date)
  if (!today || today.isClosed || !today.open || !today.close) return false
  const nowMinutes = date.getHours() * 60 + date.getMinutes()
  return nowMinutes >= parseTimeToMinutes(today.open) && nowMinutes < parseTimeToMinutes(today.close)
}

export function getAvailableSlots(branchId: string, date: string) {
  return computeAvailableSlots(branchId, date)
}

export function getWeekSlotGrid(branchId: string, weekStartDate: string) {
  return computeWeekGrid(branchId, weekStartDate)
}

export function getClosures(branchId: string): Closure[] {
  return useDemoStore.getState().closures.filter((c) => c.branchId === branchId)
}

export function addClosure(closure: Omit<Closure, 'id'>): void {
  useDemoStore.getState().addClosure(closure)
}

export function removeClosure(id: string): void {
  useDemoStore.getState().removeClosure(id)
}

export function getSlotSettings(branchId: string): SlotSettings | undefined {
  return useDemoStore.getState().slotSettings.find((s) => s.branchId === branchId)
}

export function updateSlotSettings(branchId: string, patch: Partial<Omit<SlotSettings, 'branchId'>>): void {
  useDemoStore.getState().updateSlotSettings(branchId, patch)
}

export function useClosures(branchId: string): Closure[] {
  return useDemoStore(useShallow((s) => s.closures.filter((c) => c.branchId === branchId)))
}
