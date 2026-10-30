import { useShallow } from 'zustand/react/shallow'
import { useDemoStore } from '@/store/useDemoStore'
import type { ContentItem, ContentType, PengumumanContent } from '@/types'

export function getContentByType(type: ContentType, filter?: { status?: ContentItem['status'] }): ContentItem[] {
  let items = useDemoStore.getState().content.filter((c) => c.type === type)
  if (filter?.status) items = items.filter((c) => c.status === filter.status)
  return items
}

export function getContentById(id: string): ContentItem | undefined {
  return useDemoStore.getState().content.find((c) => c.id === id)
}

export function saveDraft(id: string, patch: Partial<ContentItem>): void {
  useDemoStore.getState().saveContentDraft(id, patch)
}

export function submitForReview(id: string): void {
  useDemoStore.getState().submitContentForReview(id)
}

export function requestRevision(id: string, note?: string): void {
  useDemoStore.getState().requestContentRevision(id, note)
}

export function approveAndPublish(id: string, reviewerId: string): void {
  useDemoStore.getState().approveAndPublishContent(id, reviewerId)
}

export function publishDirect(id: string): void {
  useDemoStore.getState().publishContentDirect(id)
}

export function getPublishedHomepageBanner(): PengumumanContent | undefined {
  const items = useDemoStore.getState().content
  return items.find(
    (c): c is PengumumanContent => c.type === 'pengumuman' && c.status === 'tayang' && c.showAsHomepageBanner,
  )
}

export function useContentByType(type: ContentType): ContentItem[] {
  return useDemoStore(useShallow((s) => s.content.filter((c) => c.type === type)))
}

export function useContentById(id: string | undefined): ContentItem | undefined {
  return useDemoStore((s) => (id ? s.content.find((c) => c.id === id) : undefined))
}

export function useContentInReview(): ContentItem[] {
  return useDemoStore(useShallow((s) => s.content.filter((c) => c.status === 'ditinjau')))
}

export function usePublishedHomepageBanner(): PengumumanContent | undefined {
  return useDemoStore((s) =>
    s.content.find(
      (c): c is PengumumanContent => c.type === 'pengumuman' && c.status === 'tayang' && c.showAsHomepageBanner,
    ),
  )
}
