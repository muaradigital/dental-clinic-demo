import { formatShortDateID } from '@/lib/date'
import type { ContentItem } from '@/types'

export interface ContentEditorHeaderProps {
  title: string
  item: ContentItem
}

export function ContentEditorHeader({ title, item }: ContentEditorHeaderProps) {
  return (
    <div className="mb-[18px] flex flex-wrap items-center justify-between gap-3">
      <p className="font-display text-xl">{title}</p>
      <p className="text-xs text-muted">
        {item.firstPublishedAt ? `Versi tayang saat ini: ${formatShortDateID(new Date(item.firstPublishedAt))}` : 'Belum pernah tayang'}
      </p>
    </div>
  )
}
