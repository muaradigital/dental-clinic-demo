import { useState } from 'react'
import { Button, NoticeBanner } from '@/components/primitives'
import { WeeklyDoctorScheduleTable } from '@/components/dashboard/operational/WeeklyDoctorScheduleTable'
import { LeavesListCard } from '@/components/dashboard/operational/LeavesListCard'
import { CatatCutiForm } from '@/components/dashboard/operational/CatatCutiForm'
import { LeaveImpactCallout } from '@/components/dashboard/operational/LeaveImpactCallout'
import { useVisibleBranches } from '@/data/repositories/branchRepository'
import { getDoctors } from '@/data/repositories/doctorRepository'
import { useLeaveRequests } from '@/data/repositories/leaveRepository'

export function DokterCuti() {
  const doctors = getDoctors()
  const branches = useVisibleBranches()
  const leaves = useLeaveRequests()
  const [selectedLeaveId, setSelectedLeaveId] = useState<string | null>(leaves[0]?.id ?? null)
  const [showAddDoctorNotice, setShowAddDoctorNotice] = useState(false)

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[13px] text-muted">
            {doctors.length} dokter · {branches.length} cabang
          </p>
          <h1 className="mt-0.5 font-display text-[34px] font-medium leading-[1.15]">Dokter &amp; cuti</h1>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowAddDoctorNotice(true)}>
          Tambah dokter
        </Button>
      </div>
      {showAddDoctorNotice && (
        <NoticeBanner tone="info" className="mb-5">
          Menambah dokter baru berada di luar lingkup demo ini — di produk sebenarnya ini akan membuka formulir profil
          dokter baru.
        </NoticeBanner>
      )}

      <div className="flex flex-wrap items-start gap-[22px]">
        <div className="flex min-w-0 flex-1 basis-[640px] flex-col gap-[22px]">
          <WeeklyDoctorScheduleTable />
          <LeavesListCard leaves={leaves} selectedLeaveId={selectedLeaveId} onSelect={setSelectedLeaveId} />
        </div>

        <div className="flex min-w-0 flex-1 basis-[280px] flex-col gap-[18px] lg:max-w-[360px]">
          <CatatCutiForm onCreated={setSelectedLeaveId} />
          {selectedLeaveId && <LeaveImpactCallout leaveId={selectedLeaveId} />}
        </div>
      </div>
    </div>
  )
}
