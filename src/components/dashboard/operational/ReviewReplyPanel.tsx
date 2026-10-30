import { useState } from 'react'
import { Button } from '@/components/primitives'
import { getBranchById } from '@/data/repositories/branchRepository'
import { approveAndSendReply, getAiSuggestedReply, getReplyTemplate, saveDraftReply } from '@/data/repositories/reviewRepository'
import type { Review } from '@/types'

export interface ReviewReplyPanelProps {
  review: Review | undefined
}

/** The parent mounts this with `key={review?.id}` so switching the selected review remounts fresh — see UlasanGoogle.tsx. */
export function ReviewReplyPanel({ review }: ReviewReplyPanelProps) {
  const [draft, setDraft] = useState(review?.replyText ?? '')

  if (!review) {
    return (
      <div className="rounded-card border border-border bg-surface p-5">
        <p className="font-display text-lg">Balas ulasan</p>
        <p className="mt-2 text-sm text-muted">Pilih ulasan dari daftar untuk menyusun balasan.</p>
      </div>
    )
  }

  const alreadySent = review.replyStatus === 'sudah dibalas'

  function commitDraft(text: string) {
    setDraft(text)
    saveDraftReply(review!.id, text)
  }

  function handleSend() {
    if (!draft.trim()) return
    saveDraftReply(review!.id, draft)
    approveAndSendReply(review!.id)
  }

  return (
    <div className="rounded-card border border-border bg-surface p-5">
      <p className="mb-1 font-display text-lg">Balas ulasan</p>
      <p className="mb-3 text-xs text-muted">
        {review.authorInitial} · {getBranchById(review.branchId)?.name ?? review.branchId} · {review.rating} bintang
      </p>
      <div className="mb-3.5 rounded-input border border-border bg-[#faf9f4] p-3 text-[13px] text-[#3a4f53]">&quot;{review.text}&quot;</div>

      <label htmlFor="reply-draft" className="mb-1.5 block text-xs font-semibold text-muted">
        Draf balasan
      </label>
      <textarea
        id="reply-draft"
        value={draft}
        disabled={alreadySent}
        onChange={(e) => commitDraft(e.target.value)}
        rows={4}
        className="mb-3 w-full rounded-input border-[1.5px] border-teal-bright p-3 text-[13px] focus:outline-none disabled:border-border disabled:bg-sand-neutral disabled:text-muted"
      />

      {!alreadySent && (
        <>
          <div className="mb-3 flex flex-wrap gap-2">
            <Button variant="outline-light" size="sm" onClick={() => commitDraft(getReplyTemplate(review))}>
              Pakai template
            </Button>
            <Button variant="outline-light" size="sm" onClick={() => commitDraft(getAiSuggestedReply(review))}>
              Saran AI
            </Button>
          </div>
          <Button variant="primary" size="sm" fullWidth disabled={!draft.trim()} onClick={handleSend}>
            Setujui &amp; kirim balasan
          </Button>
          <p className="mt-2.5 text-center text-xs text-muted">Saran AI selalu disetujui manusia sebelum dikirim.</p>
        </>
      )}
      {alreadySent && <p className="text-center text-xs font-semibold text-teal-soft">Balasan sudah terkirim.</p>}
    </div>
  )
}
