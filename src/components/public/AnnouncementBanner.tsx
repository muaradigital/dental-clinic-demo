import type { PengumumanContent } from '@/types'

export interface AnnouncementBannerProps {
  announcement: PengumumanContent
}

/**
 * Proves the content pipeline is real, not cosmetic: this only renders when
 * a Pengumuman with showAsHomepageBanner reaches 'tayang' — see
 * contentRepository.usePublishedHomepageBanner().
 */
export function AnnouncementBanner({ announcement }: AnnouncementBannerProps) {
  return (
    <div className="bg-teal px-5 py-2.5 text-center text-sm text-white md:px-10">
      <span className="font-semibold">{announcement.title}</span>
      <span className="mx-1.5 hidden sm:inline">·</span>
      <span className="hidden sm:inline">{announcement.body}</span>
    </div>
  )
}
