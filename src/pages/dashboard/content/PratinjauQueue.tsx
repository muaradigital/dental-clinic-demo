import { Link } from 'react-router-dom'
import { StatusChip } from '@/components/primitives'
import { formatDateTimeID } from '@/lib/date'
import { useContentInReview } from '@/data/repositories/contentRepository'
import { useClinicSettings } from '@/data/repositories/clinicRepository'
import type { ContentItem } from '@/types'

const TYPE_LABEL: Record<ContentItem['type'], string> = {
  layanan: 'Layanan',
  cabang: 'Cabang',
  dokter: 'Profil dokter',
  pengumuman: 'Pengumuman',
}

export function PratinjauQueue() {
  const items = useContentInReview()
  const { doctorReviewEnabled } = useClinicSettings()

  return (
    <div>
      <p className="text-[13px] text-muted">Konten menunggu tinjauan dokter</p>
      <h1 className="mb-6 mt-0.5 font-display text-[34px] font-medium leading-[1.15]">Pratinjau &amp; tinjauan</h1>

      {!doctorReviewEnabled && (
        <p className="mb-5 rounded-chip border border-border bg-surface px-4 py-3.5 text-sm text-muted">
          Tinjauan dokter sedang nonaktif di halaman Pengguna — konten langsung tayang setelah disimpan, jadi
          antrean ini kosong.
        </p>
      )}

      {doctorReviewEnabled && items.length === 0 && (
        <p className="rounded-chip border border-border bg-surface px-4 py-3.5 text-sm text-muted">
          Tidak ada konten yang menunggu tinjauan saat ini.
        </p>
      )}

      {items.length > 0 && (
        <ul className="overflow-hidden rounded-card-lg border border-border bg-surface">
          {items.map((item) => (
            <li key={item.id} className="border-t border-[#efece3] first:border-t-0">
              <Link
                to={`/dashboard/content/pratinjau/${item.id}`}
                className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-mint-3"
              >
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{item.title}</span>
                  <span className="block text-xs text-muted">
                    {TYPE_LABEL[item.type]} · diajukan {item.updatedBy}, {formatDateTimeID(new Date(item.updatedAt))}
                  </span>
                </span>
                <StatusChip tone="warning" label="Ditinjau" className="flex-none" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
