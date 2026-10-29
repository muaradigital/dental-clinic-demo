export interface StatTileProps {
  label: string
  value: string | number
  colorClassName?: string
  note?: string
}

export function StatTile({ label, value, colorClassName = 'text-ink', note }: StatTileProps) {
  return (
    <div className="min-w-0 flex-1 basis-[150px] rounded-card-sm border border-border bg-surface px-[18px] py-4">
      <p className="text-xs font-semibold text-muted">{label}</p>
      <p className={`font-display text-[34px] leading-tight ${colorClassName}`}>{value}</p>
      {note && <p className="mt-0.5 text-xs text-muted">{note}</p>}
    </div>
  )
}
