import { Card, NoticeBanner } from '@/components/primitives'
import { getReminderCandidates, sendReminder } from '@/data/repositories/reminderRepository'
import { formatShortDateID } from '@/lib/date'
import { useDemoStore } from '@/store/useDemoStore'

export interface ReminderSidePanelProps {
  branchId: string
  tomorrowDate: string
}

export function ReminderSidePanel({ branchId, tomorrowDate }: ReminderSidePanelProps) {
  // Subscribe so a just-sent reminder re-renders this panel immediately.
  useDemoStore((s) => s.reminderLog)
  const candidates = getReminderCandidates(branchId, tomorrowDate)

  return (
    <div className="flex min-w-0 flex-1 basis-[280px] flex-col gap-4 lg:max-w-[340px]">
      <Card>
        <p className="mb-1 font-display text-lg">Pengingat H-1</p>
        <p className="mb-3.5 text-xs text-muted">Mode manual. WhatsApp terbuka dengan pesan terisi, tanpa menyebut layanan.</p>
        {candidates.length === 0 && <p className="py-2 text-sm text-muted">Tidak ada janji besok untuk cabang ini.</p>}
        {candidates.map(({ appointment, sendStatus }) => (
          <div key={appointment.id} className="flex items-center justify-between gap-2.5 border-t border-neutral-bg py-2.5 text-sm first:border-t-0">
            <div>
              <p className="font-semibold">{appointment.patientName}</p>
              <p className="text-xs text-muted">
                Besok {appointment.timeSlot} · {formatShortDateID(new Date(`${tomorrowDate}T00:00:00`))}
              </p>
            </div>
            <button
              type="button"
              disabled={sendStatus !== 'belum dikirim'}
              onClick={() => sendReminder(appointment.id)}
              className="rounded-pill bg-mint px-3.5 py-[7px] text-xs font-semibold text-teal-soft disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sendStatus === 'terkirim' ? 'Terkirim' : sendStatus === 'tidak dikirim' ? 'Tanpa persetujuan' : 'Kirim'}
            </button>
          </div>
        ))}
      </Card>
      <NoticeBanner tone="warning">
        Kolom catatan hanya untuk hal administratif, misalnya &quot;minta jam sore&quot;. Jangan isi data kesehatan.
      </NoticeBanner>
    </div>
  )
}
