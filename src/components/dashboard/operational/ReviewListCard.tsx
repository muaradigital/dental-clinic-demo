import { StatusChip } from '@/components/primitives'
import { getBranchById } from '@/data/repositories/branchRepository'
import { isReviewLate } from '@/data/repositories/reviewRepository'
import { formatRelativeDay } from '@/lib/date'
import type { StatusTone } from '@/lib/status'
import type { Review } from '@/types'

const LATE_THRESHOLD_HOURS = 48

function statusLabel(review: Review): { label: string; tone: StatusTone } {
  if (review.replyStatus === 'sudah dibalas' || review.replyStatus === 'draf balasan') {
    return review.replyStatus === 'sudah dibalas' ? { label: 'dibalas', tone: 'success' } : { label: 'draf balasan', tone: 'warning' }
  }
  return isReviewLate(review) ? { label: 'terlambat', tone: 'danger' } : { label: 'belum dibalas', tone: 'warning' }
}

function deadlineLabel(review: Review): string {
  const hoursSince = (Date.now() - new Date(review.createdAt).getTime()) / 3_600_000
  if (review.replyStatus === 'sudah dibalas') return `Dibalas setelah ${Math.round(hoursSince)} jam`
  const remaining = LATE_THRESHOLD_HOURS - hoursSince
  return remaining >= 0 ? `Batas balas: ${Math.round(remaining)} jam lagi` : `Batas balas: terlewat ${Math.round(-remaining)} jam`
}

export interface ReviewListCardProps {
  reviews: Review[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function ReviewListCard({ reviews, selectedId, onSelect }: ReviewListCardProps) {
  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface">
      <div className="border-b border-border px-[22px] py-[18px] font-display text-lg">Daftar ulasan</div>
      {reviews.length === 0 && <p className="px-[22px] py-6 text-center text-muted">Tidak ada ulasan untuk filter ini.</p>}
      {reviews.map((review) => {
        const status = statusLabel(review)
        const rowTint = status.label === 'dibalas' ? '' : status.label === 'terlambat' ? 'bg-[#fff8f6]' : 'bg-[#fffdf5]'
        return (
          <button
            key={review.id}
            type="button"
            onClick={() => onSelect(review.id)}
            className={`block w-full border-t border-[#efece3] px-[22px] py-4 text-left first:border-t-0 ${rowTint} ${
              selectedId === review.id ? 'ring-2 ring-inset ring-teal-bright' : ''
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-sm font-semibold">{review.authorInitial}</span>
                <span className="text-sm text-[#b7791f]" aria-label={`${review.rating} dari 5 bintang`}>
                  {'★'.repeat(review.rating)}
                  {'☆'.repeat(5 - review.rating)}
                </span>
                <span className="rounded-pill bg-mint px-2.5 py-0.5 text-xs font-semibold text-teal">
                  {getBranchById(review.branchId)?.name.replace('Cabang ', '') ?? review.branchId}
                </span>
              </div>
              <StatusChip tone={status.tone} label={status.label} />
            </div>
            <p className="my-2 text-[13.5px]">{review.text}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
              <span>{formatRelativeDay(review.createdAt)}</span>
              <span>{deadlineLabel(review)}</span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
