import { useState } from 'react'
import { NoticeBanner, Tabs } from '@/components/primitives'
import { StatTile } from '@/components/dashboard/shared/StatTile'
import { ReviewListCard } from '@/components/dashboard/operational/ReviewListCard'
import { ReviewReplyPanel } from '@/components/dashboard/operational/ReviewReplyPanel'
import { useVisibleBranches } from '@/data/repositories/branchRepository'
import { useReviewStats, useReviews } from '@/data/repositories/reviewRepository'

export function UlasanGoogle() {
  const branches = useVisibleBranches()
  const [branchFilter, setBranchFilter] = useState<string>('semua')
  const reviews = useReviews(branchFilter === 'semua' ? undefined : branchFilter)
  const stats = useReviewStats(branchFilter === 'semua' ? undefined : branchFilter)
  const [selectedId, setSelectedId] = useState<string | null>(reviews[0]?.id ?? null)

  const selectedReview = reviews.find((r) => r.id === selectedId) ?? reviews[0]

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[13px] text-muted">Ulasan Google Business Profile · {branches.length} cabang</p>
          <h1 className="mt-0.5 font-display text-[34px] font-medium leading-[1.15]">Ulasan Google</h1>
        </div>
        <Tabs
          options={[{ value: 'semua', label: 'Semua' }, ...branches.map((b) => ({ value: b.id, label: b.name.replace('Cabang ', '') }))]}
          value={branchFilter}
          onChange={setBranchFilter}
          aria-label="Filter cabang"
        />
      </div>

      <div className="mb-5 flex flex-wrap gap-3.5">
        <StatTile label="Belum dibalas" value={stats.unrepliedCount} colorClassName="text-warning-text" />
        <StatTile label="Terlambat (> 48 jam)" value={stats.lateCount} colorClassName="text-danger-text" />
        <StatTile label="Sudah dibalas" value={stats.repliedCount} colorClassName="text-success-text" />
        <StatTile label="Rata-rata bintang (contoh)" value={stats.avgRating.toFixed(1).replace('.', ',')} />
      </div>

      <div className="flex flex-wrap items-start gap-[22px]">
        <div className="min-w-0 flex-1 basis-[560px]">
          <ReviewListCard reviews={reviews} selectedId={selectedReview?.id ?? null} onSelect={setSelectedId} />
        </div>
        <div className="flex min-w-0 flex-1 basis-[300px] flex-col gap-[18px] lg:max-w-[400px]">
          <ReviewReplyPanel key={selectedReview?.id ?? 'none'} review={selectedReview} />
          <NoticeBanner tone="warning" title="Aturan privasi balasan">
            Balasan tidak menyebut layanan atau kondisi, dan tidak mengonfirmasi bahwa penulis adalah pasien. Gunakan
            kalimat umum.
          </NoticeBanner>
        </div>
      </div>
    </div>
  )
}
