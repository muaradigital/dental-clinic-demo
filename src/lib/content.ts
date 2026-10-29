import type { ContentItem, ContentStatus } from '@/types'

/**
 * TODO(Slice 6): full pipeline rules —
 * - 'cabang' content is always Draf -> Tayang, never gets a review step.
 * - When ClinicSettings.doctorReviewEnabled is false, every other type
 *   collapses to Draf -> Tayang too, with a liability warning shown.
 * - 'pengumuman' content can additionally reach a terminal 'berakhir'
 *   state once its expireAt date passes (list-view only, not a stepper step).
 */
export function getNextStatus(item: ContentItem, doctorReviewEnabled: boolean): ContentStatus {
  if (item.type === 'cabang') return 'tayang'
  return doctorReviewEnabled ? 'ditinjau' : 'tayang'
}

export function getContentSteps(type: ContentItem['type']): ContentStatus[] {
  return type === 'cabang' ? ['draf', 'tayang'] : ['draf', 'ditinjau', 'tayang']
}
