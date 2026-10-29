import { Button } from '@/components/primitives'
import { Icon } from '@/components/public/icons'
import { formatLongDateID } from '@/lib/date'
import type { Appointment } from '@/types'

export interface ConfirmationPanelProps {
  appointment: Appointment
  branchName: string
  serviceName: string
  onReset: () => void
}

export function ConfirmationPanel({ appointment, branchName, serviceName, onReset }: ConfirmationPanelProps) {
  const dateLabel = formatLongDateID(new Date(`${appointment.date}T00:00:00`))

  return (
    <div className="text-center">
      <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-mint">
        <Icon name="check" width={26} height={26} className="text-teal" />
      </span>
      <h2 className="font-display text-xl font-medium">Reservasi terkirim</h2>
      <p className="mt-1.5 text-sm text-muted">
        Nomor janji <span className="font-semibold text-ink">#{appointment.appointmentNumber}</span>
      </p>

      <div className="mt-5 space-y-1 rounded-chip bg-mint px-4 py-3.5 text-left text-[13px]">
        <div className="font-semibold text-ink">{branchName}</div>
        <div className="text-ink">{serviceName}</div>
        <div className="font-semibold text-teal">
          {dateLabel} · {appointment.timeSlot}
        </div>
      </div>

      <p className="mt-4 text-xs text-muted">
        Reservasi baru berlaku setelah dikonfirmasi admin cabang lewat WhatsApp.
      </p>

      <Button variant="outline-light" size="sm" fullWidth className="mt-5" onClick={onReset}>
        Buat reservasi baru
      </Button>
    </div>
  )
}
