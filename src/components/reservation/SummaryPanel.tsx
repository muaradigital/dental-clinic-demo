export interface SummaryPanelProps {
  branchName: string
  serviceName: string
  timeSummary: string | null
}

export function SummaryPanel({ branchName, serviceName, timeSummary }: SummaryPanelProps) {
  return (
    <div className="mb-[18px] rounded-chip bg-mint px-4 py-3.5 text-[13px]">
      <div className="font-semibold text-ink">{branchName}</div>
      <div className="text-ink">{serviceName}</div>
      <div className="mt-1 font-semibold text-teal">{timeSummary ?? 'Pilih jam terlebih dahulu'}</div>
    </div>
  )
}
