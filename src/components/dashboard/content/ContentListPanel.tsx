import { useState } from 'react'
import { StatusChip } from '@/components/primitives'
import { STATUS_TONE_CLASSES } from '@/lib/status'
import { cn } from '@/lib/cn'
import type { ContentStatus } from '@/types'

const STATUS_LABEL: Record<ContentStatus, string> = {
  draf: 'Draf',
  ditinjau: 'Ditinjau',
  tayang: 'Tayang',
  berakhir: 'Berakhir',
}

const CHIP_TONE: Record<ContentStatus, keyof typeof STATUS_TONE_CLASSES> = {
  draf: 'neutral',
  ditinjau: 'warning',
  tayang: 'success',
  berakhir: 'expired',
}

export interface ContentListItemLike {
  id: string
  title: string
  /** The EFFECTIVE status (run through lib/content.ts's getEffectiveStatus by the caller) — may be 'berakhir'. */
  status: ContentStatus
  meta: string
}

export interface ContentListPanelProps<T extends ContentListItemLike> {
  /** Shown as a Fraunces list header (matches the Cabang/Dokter references) — omit for screens whose reference has none (Layanan, Pengumuman). */
  listHeaderLabel?: string
  items: T[]
  selectedId: string | null
  onSelect: (id: string) => void
  /** Extra filter dimension rendered as pill tabs above the status filter, e.g. Pengumuman's type tabs. */
  extraTabs?: { value: string; label: string; active: boolean; onClick: () => void }[]
}

export function ContentListPanel<T extends ContentListItemLike>({
  listHeaderLabel,
  items,
  selectedId,
  onSelect,
  extraTabs,
}: ContentListPanelProps<T>) {
  const [statusFilter, setStatusFilter] = useState<'semua' | ContentStatus>('semua')

  const counts = {
    semua: items.length,
    draf: items.filter((i) => i.status === 'draf').length,
    ditinjau: items.filter((i) => i.status === 'ditinjau').length,
    tayang: items.filter((i) => i.status === 'tayang' || i.status === 'berakhir').length,
  }
  const visibleItems = statusFilter === 'semua' ? items : items.filter((i) => i.status === statusFilter)

  return (
    <div className="flex-1 basis-[320px] overflow-hidden rounded-card-lg border border-border bg-surface" style={{ maxWidth: 420 }}>
      {listHeaderLabel && (
        <div className="border-b border-border px-5 py-4 font-display text-lg">{listHeaderLabel}</div>
      )}
      {extraTabs && (
        <div className="flex flex-wrap gap-1.5 border-b border-border px-5 py-3.5">
          {extraTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={tab.onClick}
              className={cn(
                'rounded-pill px-3.5 py-1.5 text-xs font-semibold transition-colors',
                tab.active ? 'bg-teal text-white' : 'bg-ivory text-muted hover:text-ink',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-1.5 border-b border-border px-5 py-4 text-xs font-semibold">
        {(['semua', 'draf', 'ditinjau', 'tayang'] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setStatusFilter(key)}
            className={cn(
              'rounded-pill px-3 py-[3.5px] transition-colors',
              statusFilter === key ? 'bg-ink text-white' : 'border-[1.5px] border-border text-muted hover:border-teal',
            )}
          >
            {key === 'semua' ? `Semua ${counts.semua}` : `${STATUS_LABEL[key]} ${counts[key]}`}
          </button>
        ))}
      </div>
      <ul>
        {visibleItems.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onSelect(item.id)}
              className={cn(
                'flex w-full items-center justify-between gap-2.5 border-t border-[#efece3] px-5 py-3.5 text-left transition-colors',
                selectedId === item.id && 'border-l-4 border-l-teal bg-mint-3 pl-4',
              )}
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{item.title}</span>
                <span className="block truncate text-xs text-muted">{item.meta}</span>
              </span>
              <StatusChip tone={CHIP_TONE[item.status]} label={STATUS_LABEL[item.status]} className="flex-none" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
