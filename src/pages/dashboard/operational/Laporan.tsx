import { useState } from 'react'
import { Button, Tabs } from '@/components/primitives'
import { StatTile } from '@/components/dashboard/shared/StatTile'
import { WeeklyAppointmentsChart } from '@/components/dashboard/operational/WeeklyAppointmentsChart'
import { SourceBreakdownChart } from '@/components/dashboard/operational/SourceBreakdownChart'
import { BusyHourChart } from '@/components/dashboard/operational/BusyHourChart'
import { DoctorAttendanceTable } from '@/components/dashboard/operational/DoctorAttendanceTable'
import { useVisibleBranches } from '@/data/repositories/branchRepository'
import {
  getBusyHourHistogram,
  getDoctorAttendanceRates,
  getMonthlyKpis,
  getSourceBreakdown,
  getWeeklyAppointmentsByBranch,
} from '@/data/repositories/reportRepository'
import { toCsv, downloadCsv } from '@/lib/csv'
import { formatMonthID, now, shiftMonth, toISODate } from '@/lib/date'
import { useDemoStore } from '@/store/useDemoStore'

export function Laporan() {
  const branches = useVisibleBranches()
  const [month, setMonth] = useState(() => toISODate(now()).slice(0, 7))
  const [branchFilter, setBranchFilter] = useState<string>('semua')
  // Subscribe so a newly created appointment re-renders every aggregate below.
  useDemoStore((s) => s.appointments)
  const activeUserId = useDemoStore((s) => s.activeUserId)
  const addAuditLog = useDemoStore((s) => s.addAuditLog)

  const branchId = branchFilter === 'semua' ? undefined : branchFilter
  const kpis = getMonthlyKpis(month, branchId)
  const weeks = getWeeklyAppointmentsByBranch(month)
  const sources = getSourceBreakdown(month, branchId)
  const hours = getBusyHourHistogram(month, branchId)
  const doctorRows = getDoctorAttendanceRates(month, branchId)

  function handleExportCsv() {
    const csv = toCsv(
      [
        { kpi: 'Total janji', value: kpis.totalAppointments },
        { kpi: 'Tingkat hadir (%)', value: (kpis.attendanceRate * 100).toFixed(1) },
        { kpi: 'Tidak hadir (%)', value: (kpis.noShowRate * 100).toFixed(1) },
        { kpi: 'Janji lewat website (%)', value: (kpis.fromWebsiteRate * 100).toFixed(1) },
      ],
      [
        { key: 'kpi', label: 'Indikator' },
        { key: 'value', label: 'Nilai' },
      ],
    )
    downloadCsv(`laporan-${month}.csv`, csv)
    if (activeUserId) {
      addAuditLog({ type: 'export_csv', scope: `Laporan kunjungan · ${formatMonthID(month)}` }, activeUserId)
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[13px] text-muted">{formatMonthID(month)} · data agregat, tanpa nama dan nomor pasien</p>
          <h1 className="mt-0.5 font-display text-[34px] font-medium leading-[1.15]">Laporan kunjungan</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            aria-label="Bulan sebelumnya"
            onClick={() => setMonth((m) => shiftMonth(m, -1))}
            className="flex h-[38px] w-[38px] items-center justify-center rounded-full border-[1.5px] border-[#cfd8d4] bg-white text-base"
          >
            ‹
          </button>
          <span className="rounded-pill border-[1.5px] border-[#cfd8d4] bg-white px-4 py-2 text-[13px] font-semibold">
            {formatMonthID(month)}
          </span>
          <button
            type="button"
            aria-label="Bulan berikutnya"
            onClick={() => setMonth((m) => shiftMonth(m, 1))}
            className="flex h-[38px] w-[38px] items-center justify-center rounded-full border-[1.5px] border-[#cfd8d4] bg-white text-base"
          >
            ›
          </button>
          <Button variant="primary" size="sm" onClick={handleExportCsv}>
            Ekspor CSV
          </Button>
        </div>
      </div>

      <div className="mb-5">
        <Tabs
          options={[{ value: 'semua', label: 'Semua cabang' }, ...branches.map((b) => ({ value: b.id, label: b.name.replace('Cabang ', '') }))]}
          value={branchFilter}
          onChange={setBranchFilter}
          aria-label="Filter cabang"
        />
      </div>

      <div className="mb-5 flex flex-wrap gap-3.5">
        <StatTile label="Total janji" value={kpis.totalAppointments} note={`${branches.length} cabang · ${formatMonthID(month)}`} />
        <StatTile
          label="Tingkat hadir"
          value={`${(kpis.attendanceRate * 100).toFixed(1).replace('.', ',')}%`}
          colorClassName="text-success-text"
          note={`${kpis.hadirCount} kunjungan`}
        />
        <StatTile
          label="Tidak hadir"
          value={`${(kpis.noShowRate * 100).toFixed(1).replace('.', ',')}%`}
          colorClassName="text-danger-text"
          note={`${kpis.tidakHadirCount} janji`}
        />
        <StatTile
          label="Janji lewat website"
          value={`${(kpis.fromWebsiteRate * 100).toFixed(1).replace('.', ',')}%`}
          colorClassName="text-teal-soft"
          note={`${kpis.fromWebsiteCount} dari ${kpis.totalAppointments} janji`}
        />
      </div>

      <div className="mb-[22px] flex flex-wrap items-stretch gap-[22px]">
        <div className="min-w-0 flex-1 basis-[520px] rounded-card border border-border bg-surface p-[22px]">
          <WeeklyAppointmentsChart weeks={weeks} />
        </div>
        <div className="min-w-0 flex-1 basis-[300px] rounded-card border border-border bg-surface p-[22px]">
          <SourceBreakdownChart rows={sources} />
        </div>
      </div>

      <div className="flex flex-wrap items-stretch gap-[22px]">
        <div className="min-w-0 flex-1 basis-[520px] rounded-card border border-border bg-surface p-[22px]">
          <BusyHourChart hours={hours} />
        </div>
        <div className="min-w-0 flex-1 basis-[300px]">
          <DoctorAttendanceTable rows={doctorRows} />
        </div>
      </div>
    </div>
  )
}
