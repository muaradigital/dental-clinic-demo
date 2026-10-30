import type { BusyHourPoint } from '@/data/repositories/reportRepository'

export interface BusyHourChartProps {
  hours: BusyHourPoint[]
}

export function BusyHourChart({ hours }: BusyHourChartProps) {
  if (hours.length === 0) {
    return <p className="text-sm text-muted">Belum ada janji pada bulan ini.</p>
  }
  const peak = Math.max(...hours.map((h) => h.count))

  return (
    <div>
      <div className="mb-4 flex flex-wrap justify-between gap-2.5">
        <p className="font-display text-lg">Jam sibuk</p>
        <p className="text-xs text-muted">Jumlah janji per jam mulai · jam tersibuk lebih gelap</p>
      </div>
      <div className="flex h-[170px] items-end gap-2 border-b-[1.5px] border-[#cfd8d4]">
        {hours.map((h) => (
          <div
            key={h.hour}
            className="flex h-full flex-1 flex-col items-center justify-end"
            role="img"
            aria-label={`Jam ${h.hour}: ${h.count} janji`}
          >
            <span className="mb-1 text-[11px] font-semibold text-[#3a4f53]">{h.count}</span>
            <div
              className={`w-full rounded-t-[6px] ${h.count === peak ? 'bg-teal-soft' : 'bg-chart-busy-light'}`}
              style={{ height: `${Math.round((h.count / peak) * 120)}px` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        {hours.map((h) => (
          <div key={h.hour} className="flex-1 text-center text-[11px] font-semibold text-muted">
            {h.hour}
          </div>
        ))}
      </div>
    </div>
  )
}
