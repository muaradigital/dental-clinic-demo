import { getBranchById, getBranches } from '@/data/repositories/branchRepository'
import type { WeeklyBranchPoint } from '@/data/repositories/reportRepository'

// Pusat Kota reuses the brand teal; Timur/Barat get their own categorical
// hues (fixed order, matching the design export's chart legend exactly).
const SERIES_COLOR_CLASS: Record<string, string> = {
  'branch-pusat-kota': 'bg-teal',
  'branch-timur': 'bg-chart-timur',
  'branch-barat': 'bg-chart-barat',
}

export interface WeeklyAppointmentsChartProps {
  weeks: WeeklyBranchPoint[]
}

export function WeeklyAppointmentsChart({ weeks }: WeeklyAppointmentsChartProps) {
  const branches = getBranches()
  const maxValue = Math.max(1, ...weeks.flatMap((w) => w.byBranch.map((b) => b.count)))

  if (weeks.length === 0) {
    return <p className="text-sm text-muted">Belum ada janji pada bulan ini.</p>
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap justify-between gap-2.5">
        <p className="font-display text-lg">Janji per minggu</p>
        <div className="flex flex-wrap gap-3.5 text-xs text-muted">
          {branches.map((b) => (
            <span key={b.id} className="inline-flex items-center gap-1.5">
              <span className={`inline-block h-2.5 w-2.5 rounded-[3px] ${SERIES_COLOR_CLASS[b.id] ?? 'bg-muted'}`} />
              {b.name.replace('Cabang ', '')}
            </span>
          ))}
        </div>
      </div>
      <div className="flex h-[190px] items-end gap-4 border-b-[1.5px] border-[#cfd8d4]">
        {weeks.map((week) => (
          <div key={week.weekLabel} className="flex h-full flex-1 items-end justify-center gap-1.5">
            {week.byBranch.map((b) => (
              <div
                key={b.branchId}
                className="flex h-full max-w-[34px] flex-1 flex-col items-center justify-end"
                role="img"
                aria-label={`${getBranchById(b.branchId)?.name ?? b.branchId}, ${week.weekLabel}: ${b.count} janji`}
              >
                <span className="mb-1 text-[11px] font-semibold text-[#3a4f53]">{b.count}</span>
                <div
                  className={`w-full rounded-t-[6px] ${SERIES_COLOR_CLASS[b.branchId] ?? 'bg-muted'}`}
                  style={{ height: `${Math.round((b.count / maxValue) * 140)}px` }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-4">
        {weeks.map((week) => (
          <div key={week.weekLabel} className="flex-1 text-center text-xs font-semibold text-muted">
            {week.weekLabel}
          </div>
        ))}
      </div>
    </div>
  )
}
