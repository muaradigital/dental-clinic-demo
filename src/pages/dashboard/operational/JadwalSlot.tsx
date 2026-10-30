import { useEffect, useState } from 'react'
import { WeekSlotGridTable } from '@/components/dashboard/operational/WeekSlotGridTable'
import { SlotSettingsCard } from '@/components/dashboard/operational/SlotSettingsCard'
import { ClosuresCard } from '@/components/dashboard/operational/ClosuresCard'
import { getBranchById, useVisibleBranches } from '@/data/repositories/branchRepository'
import { getWeekStart } from '@/data/repositories/scheduleRepository'
import { useBranchScope } from '@/hooks/useBranchScope'
import { addDays, formatDateRangeID, now } from '@/lib/date'
import { useDemoStore } from '@/store/useDemoStore'

export function JadwalSlot() {
  const { scope, effectiveBranchId } = useBranchScope()
  const visibleBranches = useVisibleBranches()
  const setBranch = useDemoStore((s) => s.setBranch)

  useEffect(() => {
    if (scope === 'all' && !effectiveBranchId && visibleBranches[0]) {
      setBranch(visibleBranches[0].id)
    }
  }, [scope, effectiveBranchId, visibleBranches, setBranch])

  const branchId = effectiveBranchId ?? visibleBranches[0]?.id ?? ''
  const branch = getBranchById(branchId)

  const [weekStart, setWeekStart] = useState(() => getWeekStart(now()))
  const weekEnd = formatDateRangeID(weekStart, addDays(new Date(`${weekStart}T00:00:00`), 5).toISOString().slice(0, 10))

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[13px] text-muted">
            {branch?.name ?? 'Cabang'} · Minggu {weekEnd}
          </p>
          <h1 className="mt-0.5 font-display text-[34px] font-medium leading-[1.15]">Jadwal &amp; slot</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            aria-label="Minggu sebelumnya"
            onClick={() => setWeekStart((w) => addDays(new Date(`${w}T00:00:00`), -7).toISOString().slice(0, 10))}
            className="flex h-[38px] w-[38px] items-center justify-center rounded-full border-[1.5px] border-[#cfd8d4] bg-white text-base"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Minggu berikutnya"
            onClick={() => setWeekStart((w) => addDays(new Date(`${w}T00:00:00`), 7).toISOString().slice(0, 10))}
            className="flex h-[38px] w-[38px] items-center justify-center rounded-full border-[1.5px] border-[#cfd8d4] bg-white text-base"
          >
            ›
          </button>
        </div>
      </div>

      {branchId && (
        <div className="flex flex-wrap items-start gap-[22px]">
          <WeekSlotGridTable branchId={branchId} weekStartDate={weekStart} />
          <div className="flex min-w-0 flex-1 basis-[280px] flex-col gap-[18px] lg:max-w-[360px]">
            <SlotSettingsCard key={branchId} branchId={branchId} />
            <ClosuresCard branchId={branchId} />
          </div>
        </div>
      )}
    </div>
  )
}
