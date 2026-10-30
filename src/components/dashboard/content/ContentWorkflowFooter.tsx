import { useNavigate } from 'react-router-dom'
import { Button, Stepper } from '@/components/primitives'
import { getContentSteps, getCurrentStepIndex, getStepperSteps } from '@/lib/content'
import { submitForReview, publishDirect } from '@/data/repositories/contentRepository'
import type { ContentItem } from '@/types'

export interface ContentWorkflowFooterProps {
  item: ContentItem
  doctorReviewEnabled: boolean
  /** Left-aligned meta line next to the action buttons, e.g. "Peninjau: drg. Anindya Prameswari". */
  metaLabel?: string
  /**
   * Commits the editor's locally-edited fields into the store (as a 'draf'
   * version) — field values live in each page's own form state, so the
   * generic footer can't build the patch itself.
   */
  onSaveDraft: () => void
  /** Extra gate on top of "must be in Draf" — e.g. Cabang's photo-prohibition checkbox. Default true. */
  canPublish?: boolean
}

/**
 * Shared stepper + action-bar for the 4 content editors. Cabang never shows
 * "Ajukan tinjauan" — publishContentDirect is its only path to 'tayang',
 * regardless of the doctorReviewEnabled toggle.
 */
export function ContentWorkflowFooter({
  item,
  doctorReviewEnabled,
  metaLabel,
  onSaveDraft,
  canPublish = true,
}: ContentWorkflowFooterProps) {
  const navigate = useNavigate()
  const steps = getContentSteps(item.type, doctorReviewEnabled)
  const currentIndex = getCurrentStepIndex(item.status, steps)
  const isDraft = item.status === 'draf'
  const isLive = item.status === 'tayang' || item.status === 'berakhir'
  const primaryLabel = item.type === 'cabang' ? 'Tayangkan perubahan' : doctorReviewEnabled ? 'Ajukan tinjauan' : 'Tayangkan'

  function handlePrimary() {
    onSaveDraft()
    if (item.type === 'cabang') publishDirect(item.id)
    else submitForReview(item.id)
  }

  function handlePreview() {
    navigate(`/dasbor/konten/pratinjau/${item.id}`)
  }

  return (
    <div>
      <Stepper steps={getStepperSteps(steps)} currentIndex={currentIndex} className="mb-6 flex-wrap" />
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-[#efece3] pt-4">
        {metaLabel ? <p className="max-w-[280px] text-xs text-muted">{metaLabel}</p> : <span />}
        <div className="flex flex-wrap gap-2.5">
          <Button variant="outline-light" size="sm" onClick={onSaveDraft}>
            Simpan draf
          </Button>
          <Button variant="secondary" size="sm" onClick={handlePreview}>
            Pratinjau desktop &amp; mobile
          </Button>
          {!isLive && (
            <Button variant="primary" size="sm" disabled={!isDraft || !canPublish} onClick={handlePrimary}>
              {primaryLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
