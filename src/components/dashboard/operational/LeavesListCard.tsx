import { StatusChip } from '@/components/primitives'
import { getBranchById, getBranches } from '@/data/repositories/branchRepository'
import { getDoctorById } from '@/data/repositories/doctorRepository'
import { formatDateRangeID } from '@/lib/date'
import { type StatusTone } from '@/lib/status'
import type { LeaveRequest, LeaveStatus } from '@/types'

const LEAVE_STATUS_TONE: Record<LeaveStatus, StatusTone> = {
  disetujui: 'soft-teal',
  menunggu: 'warning',
  draf: 'neutral',
}

/** Every branch a doctor practices at, for leaves spanning more than one (e.g. "Pusat Kota & Timur"). */
function doctorBranchLabel(doctorId: string): string {
  const doctor = getDoctorById(doctorId)
  if (!doctor) return ''
  const branchIds = Array.from(new Set(doctor.schedule.map((e) => e.branchId)))
  return branchIds.map((id) => getBranches().find((b) => b.id === id)?.name.replace('Cabang ', '') ?? getBranchById(id)?.name).join(' & ')
}

export interface LeavesListCardProps {
  leaves: LeaveRequest[]
  selectedLeaveId: string | null
  onSelect: (id: string) => void
}

export function LeavesListCard({ leaves, selectedLeaveId, onSelect }: LeavesListCardProps) {
  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface">
      <div className="border-b border-border px-[22px] py-[18px] font-display text-lg">Daftar cuti</div>
      {leaves.length === 0 && <p className="px-[22px] py-5 text-sm text-muted">Belum ada pengajuan cuti.</p>}
      {leaves.map((leave) => {
        const doctor = getDoctorById(leave.doctorId)
        return (
          <button
            key={leave.id}
            type="button"
            onClick={() => onSelect(leave.id)}
            className={`flex w-full flex-wrap items-center gap-3 border-t border-[#efece3] px-[22px] py-3.5 text-left text-[13.5px] first:border-t-0 ${
              selectedLeaveId === leave.id ? 'bg-mint-3' : ''
            }`}
          >
            <div className="min-w-0 flex-1 basis-[200px]">
              <p className="font-semibold">{doctor?.name ?? leave.doctorId}</p>
              <p className="text-xs text-muted">{doctorBranchLabel(leave.doctorId)}</p>
            </div>
            <div className="min-w-0 flex-1 basis-[170px]">
              <p>{formatDateRangeID(leave.startDate, leave.endDate)}</p>
              <p className="text-xs text-muted">{leave.note ?? '—'}</p>
            </div>
            <StatusChip tone={LEAVE_STATUS_TONE[leave.status]} label={leave.status} />
          </button>
        )
      })}
    </div>
  )
}
