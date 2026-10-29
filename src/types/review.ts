export type ReviewReplyStatus = 'belum dibalas' | 'draf balasan' | 'sudah dibalas'

export interface Review {
  id: string
  branchId: string
  authorInitial: string
  rating: 1 | 2 | 3 | 4 | 5
  text: string
  createdAt: string
  replyStatus: ReviewReplyStatus
  replyText?: string
}
