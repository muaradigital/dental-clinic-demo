import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { now } from '@/lib/date'
import { useDemoStore } from '@/store/useDemoStore'
import type { Review } from '@/types'

const LATE_THRESHOLD_HOURS = 48

export function isReviewLate(review: Review, at: Date = now()): boolean {
  if (review.replyStatus !== 'belum dibalas') return false
  const hoursSince = (at.getTime() - new Date(review.createdAt).getTime()) / 3_600_000
  return hoursSince > LATE_THRESHOLD_HOURS
}

export function getReviews(branchId?: string): Review[] {
  const reviews = useDemoStore.getState().reviews
  return branchId ? reviews.filter((r) => r.branchId === branchId) : reviews
}

export function getReviewStats(branchId?: string) {
  const reviews = getReviews(branchId)
  const total = reviews.length
  const avgRating = total === 0 ? 0 : reviews.reduce((sum, r) => sum + r.rating, 0) / total
  const unreplied = reviews.filter((r) => r.replyStatus === 'belum dibalas').length
  const late = reviews.filter((r) => isReviewLate(r)).length
  const replied = reviews.filter((r) => r.replyStatus === 'sudah dibalas').length
  return {
    avgRating,
    totalReviews: total,
    unrepliedCount: unreplied,
    lateCount: late,
    repliedCount: replied,
    replyRate: total === 0 ? 0 : replied / total,
  }
}

/**
 * Canned reply text — "Pakai template" and "Saran AI" both insert pre-written
 * copy (never a live model call); the UI frames every suggestion as
 * requiring human approval before it sends, matching the privacy rule that a
 * reply must stay generic (no service/condition mentions, no confirming the
 * author is a patient).
 */
export function getReplyTemplate(review: Review): string {
  return review.rating <= 3
    ? 'Terima kasih atas masukan Anda. Kami mohon maaf atas ketidaknyamanan yang Anda rasakan. Silakan hubungi cabang kami agar dapat kami tindak lanjuti.'
    : 'Terima kasih banyak atas ulasannya. Senang mendengar pengalaman yang baik di cabang kami.'
}

export function getAiSuggestedReply(review: Review): string {
  return review.rating <= 3
    ? 'Terima kasih sudah berbagi pengalaman Anda. Masukan ini sangat berarti bagi kami untuk terus memperbaiki pelayanan — jangan ragu menghubungi cabang kami bila ada hal lain yang bisa dibantu.'
    : 'Terima kasih atas waktu dan ulasannya. Kami senang bisa memberikan pengalaman yang nyaman, dan menantikan kunjungan Anda berikutnya.'
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

/** Reactive version of getReviewStats — re-renders as replies are sent. */
export function useReviewStats(branchId?: string) {
  const reviews = useReviews(branchId)
  return useMemo(() => {
    const total = reviews.length
    const avgRating = total === 0 ? 0 : reviews.reduce((sum, r) => sum + r.rating, 0) / total
    const unreplied = reviews.filter((r) => r.replyStatus === 'belum dibalas').length
    const late = reviews.filter((r) => isReviewLate(r)).length
    const replied = reviews.filter((r) => r.replyStatus === 'sudah dibalas').length
    return { avgRating, totalReviews: total, unrepliedCount: unreplied, lateCount: late, repliedCount: replied }
  }, [reviews])
}
