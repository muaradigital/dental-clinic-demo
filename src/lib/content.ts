import type { ContentItem, ContentStatus } from '@/types'

/**
 * 'cabang' content is always Draf -> Tayang, never gets a review step.
 * Every other type collapses to Draf -> Tayang too when doctor review is
 * switched off on the Pengguna page (with a liability warning shown there).
 */
export function getNextStatus(item: ContentItem, doctorReviewEnabled: boolean): ContentStatus {
  if (item.type === 'cabang') return 'tayang'
  return doctorReviewEnabled ? 'ditinjau' : 'tayang'
}

/** The step sequence an editor's Stepper renders for this content type + review setting. */
export function getContentSteps(type: ContentItem['type'], doctorReviewEnabled: boolean): ContentStatus[] {
  if (type === 'cabang') return ['draf', 'tayang']
  return doctorReviewEnabled ? ['draf', 'ditinjau', 'tayang'] : ['draf', 'tayang']
}

const STEP_LABELS: Record<ContentStatus, string> = {
  draf: 'Draf',
  ditinjau: 'Ditinjau',
  tayang: 'Tayang',
  berakhir: 'Berakhir',
}

export function getStepperSteps(steps: ContentStatus[]): { key: string; label: string }[] {
  return steps.map((s) => ({ key: s, label: STEP_LABELS[s] }))
}

/** 'berakhir' is display-only on the stepper — it maps back onto the 'tayang' dot. */
export function getCurrentStepIndex(status: ContentStatus, steps: ContentStatus[]): number {
  const idx = steps.indexOf(status === 'berakhir' ? 'tayang' : status)
  return idx === -1 ? 0 : idx
}

/**
 * A 'pengumuman' reaching its expireAt becomes 'berakhir' — computed on
 * read, never persisted, so it always reflects the current clock rather
 * than going stale.
 */
export function isContentExpired(item: ContentItem, at: Date = new Date()): boolean {
  return item.type === 'pengumuman' && item.status === 'tayang' && !!item.expireAt && new Date(item.expireAt) < at
}

export function getEffectiveStatus(item: ContentItem, at: Date = new Date()): ContentStatus {
  return isContentExpired(item, at) ? 'berakhir' : item.status
}
