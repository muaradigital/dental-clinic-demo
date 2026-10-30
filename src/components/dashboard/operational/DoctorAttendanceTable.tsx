import type { DoctorAttendanceRow } from '@/data/repositories/reportRepository'

export interface DoctorAttendanceTableProps {
  rows: DoctorAttendanceRow[]
}

export function DoctorAttendanceTable({ rows }: DoctorAttendanceTableProps) {
  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface">
      <div className="border-b border-border px-[22px] py-[18px] font-display text-lg">Per dokter</div>
      <div className="flex gap-2.5 bg-[#faf9f4] px-[22px] py-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
        <div className="flex-1">Dokter</div>
        <div className="flex-none basis-[52px] text-right">Janji</div>
        <div className="flex-none basis-[60px] text-right">Hadir</div>
      </div>
      {rows.length === 0 && <p className="px-[22px] py-5 text-sm text-muted">Belum ada data bulan ini.</p>}
      {rows.map((row) => (
        <div key={row.doctorId} className="flex items-center gap-2.5 border-t border-[#efece3] px-[22px] py-3.5 text-[13px]">
          <div className="min-w-0 flex-1 font-semibold">{row.doctorName}</div>
          <div className="flex-none basis-[52px] text-right">{row.appointmentCount}</div>
          <div className="flex-none basis-[60px] text-right font-semibold text-teal-soft">
            {(row.attendanceRate * 100).toFixed(1).replace('.', ',')}%
          </div>
        </div>
      ))}
    </div>
  )
}
