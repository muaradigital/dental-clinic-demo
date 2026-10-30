import type { SourceBreakdownRow } from '@/data/repositories/reportRepository'

export interface SourceBreakdownChartProps {
  rows: SourceBreakdownRow[]
}

export function SourceBreakdownChart({ rows }: SourceBreakdownChartProps) {
  return (
    <div>
      <p className="mb-4 font-display text-lg">Sumber janji</p>
      {rows.map((row) => (
        <div key={row.source} className="mb-3.5">
          <div className="mb-1 flex justify-between text-[13px]">
            <span className="font-semibold">{row.label}</span>
            <span className="text-muted">
              {row.count} · {(row.percentage * 100).toFixed(1).replace('.', ',')}%
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-pill bg-neutral-bg" role="img" aria-label={`${row.label}: ${row.count} janji`}>
            <div className="h-full rounded-pill bg-teal" style={{ width: `${row.percentage * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}
