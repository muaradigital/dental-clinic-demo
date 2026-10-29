import { useShallow } from 'zustand/react/shallow'
import { useDemoStore } from '@/store/useDemoStore'
import type { Review } from '@/types'

export function getReviews(branchId?: string): Review[] {
  const reviews = useDemoStore.getState().reviews
  return branchId ? reviews.filter((r) => r.branchId === branchId) : reviews
}

export function getReviewStats(branchId?: string) {
  const reviews = getReviews(branchId)
  const total = reviews.length
  const avgRating = total === 0 ? 0 : reviews.reduce((sum, r) => sum + r.rating, 0) / total
  const replied = reviews.filter((r) => r.replyStatus === 'sudah dibalas').length
  return {
    avgRating,
    totalReviews: total,
    replyRate: total === 0 ? 0 : replied / total,
  }
}

export function saveDraftReply(reviewId: string, text: string): void {
  useDemoStore.getState().saveReviewDraftReply(reviewId, text)
}

export function approveAndSendReply(reviewId: string): void {
  useDemoStore.getState().approveAndSendReviewReply(reviewId)
}

export function useReviews(branchId?: string): Review[] {
  return useDemoStore(useShallow((s) => (branchId ? s.reviews.filter((r) => r.branchId === branchId) : s.reviews)))
}
