import { useState } from 'react'
import { Button, NoticeBanner } from '@/components/primitives'
import { getBranchById } from '@/data/repositories/branchRepository'
import { getDoctorById } from '@/data/repositories/doctorRepository'
import { computeLeaveImpact } from '@/data/repositories/leaveRepository'
import { formatDateRangeID } from '@/lib/date'
import { getServiceCategoryName } from '@/data/repositories/serviceRepository'
import { useDemoStore } from '@/store/useDemoStore'

export interface LeaveImpactCalloutProps {
  leaveId: string
}

export function LeaveImpactCallout({ leaveId }: LeaveImpactCalloutProps) {
  // Subscribe so a just-created leave or a new appointment re-derives the impact immediately.
  useDemoStore((s) => s.leaves)
  useDemoStore((s) => s.appointments)
  const [showAffected, setShowAffected] = useState(false)

  const leave = useDemoStore.getState().leaves.find((l) => l.id === leaveId)
  const doctor = leave ? getDoctorById(leave.doctorId) : undefined
  if (!leave || !doctor) return null

  const impact = computeLeaveImpact(leaveId)
  const branchNames = impact.closedBranchIds.map((id) => getBranchById(id)?.name.replace('Cabang ', '') ?? id)

  return (
    <NoticeBanner
      tone="warning"
      title={`Dampak cuti ${doctor.name}, ${formatDateRangeID(leave.startDate, leave.endDate)}`}
    >
      {impact.closedSlotCount === 0 ? (
        <>Tidak ada slot yang perlu ditutup — dokter lain tetap tersedia di hari-hari ini.</>
      ) : (
        <>
          {impact.closedSlotCount} slot ditutup otomatis di {branchNames.join(' dan ') || '–'}.{' '}
          {impact.affectedAppointments.length} janji perlu dijadwal ulang.
        </>
      )}
      {impact.affectedAppointments.length > 0 && (
        <div className="mt-2.5">
          <Button
            variant="outline-light"
            size="sm"
            className="!border-notice-text !text-notice-text"
            onClick={() => setShowAffected((v) => !v)}
          >
            {showAffected ? 'Sembunyikan' : 'Lihat janji terdampak'}
          </Button>
          {showAffected && (
            <ul className="mt-2.5 flex flex-col gap-1.5 text-[12.5px]">
              {impact.affectedAppointments.map((a) => (
                <li key={a.id}>
                  {a.date} · {a.timeSlot} · {a.patientName} · {getServiceCategoryName(a.serviceCategoryId)} ·{' '}
                  {getBranchById(a.branchId)?.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </NoticeBanner>
  )
}
