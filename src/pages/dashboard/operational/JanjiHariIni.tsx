import { Fragment, useEffect, useState } from 'react'
import { Button, StatusChip } from '@/components/primitives'
import { StatTile } from '@/components/dashboard/shared/StatTile'
import { ManualAppointmentForm } from '@/components/dashboard/operational/ManualAppointmentForm'
import { ReminderSidePanel } from '@/components/dashboard/operational/ReminderSidePanel'
import { getBranchById, useVisibleBranches } from '@/data/repositories/branchRepository'
import { toExportRows, updateAppointmentStatus, useAppointments, useTodayStats } from '@/data/repositories/appointmentRepository'
import { getServiceCategoryName } from '@/data/repositories/serviceRepository'
import { useBranchScope } from '@/hooks/useBranchScope'
import { addDays, formatLongDateID, now, toISODate } from '@/lib/date'
import { downloadCsv, toCsv } from '@/lib/csv'
import { maskPhone } from '@/lib/mask'
import { APPOINTMENT_STATUS_TONE, SOURCE_LABELS } from '@/lib/status'
import { useDemoStore } from '@/store/useDemoStore'
import type { Appointment } from '@/types'

function buildWhatsappConfirmUrl(appointment: Appointment, branchName: string): string {
  const message = `Halo ${appointment.patientName}, janji Anda di Klinik Gigi Arunika ${branchName} pukul ${appointment.timeSlot} telah dikonfirmasi. Sampai jumpa!`
  return `https://wa.me/${appointment.patientWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
}

export function JanjiHariIni() {
  const { scope, effectiveBranchId } = useBranchScope()
  const visibleBranches = useVisibleBranches()
  const setBranch = useDemoStore((s) => s.setBranch)
  const activeUserId = useDemoStore((s) => s.activeUserId)
  const addAuditLog = useDemoStore((s) => s.addAuditLog)

  // Single-branch operational screen: an all-branch role (Pemilik) still
  // needs one concrete branch selected here, never "Semua cabang".
  useEffect(() => {
    if (scope === 'all' && !effectiveBranchId && visibleBranches[0]) {
      setBranch(visibleBranches[0].id)
    }
  }, [scope, effectiveBranchId, visibleBranches, setBranch])

  const branchId = effectiveBranchId ?? visibleBranches[0]?.id ?? ''
  const branch = getBranchById(branchId)
  const today = toISODate(now())
  const tomorrow = toISODate(addDays(now(), 1))

  const appointments = useAppointments(branchId).filter((a) => a.date === today)
  const stats = useTodayStats(branchId, today)

  const [showManualForm, setShowManualForm] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  function handleStatusChange(appointment: Appointment, status: Appointment['status']) {
    if (!activeUserId) return
    updateAppointmentStatus(appointment.id, status, activeUserId)
  }

  function handleConfirmViaWhatsapp(appointment: Appointment) {
    window.open(buildWhatsappConfirmUrl(appointment, branch?.name ?? 'Klinik Gigi Arunika'), '_blank', 'noopener')
    handleStatusChange(appointment, 'dikonfirmasi')
  }

  function handleExportCsv() {
    const rows = toExportRows(appointments).map((row) => ({
      ...row,
      branchName: branch?.name ?? row.branchId,
      serviceName: getServiceCategoryName(row.serviceCategoryId),
    }))
    const csv = toCsv(rows, [
      { key: 'appointmentNumber', label: 'Nomor janji' },
      { key: 'branchName', label: 'Cabang' },
      { key: 'serviceName', label: 'Layanan' },
      { key: 'date', label: 'Tanggal' },
      { key: 'timeSlot', label: 'Jam' },
      { key: 'status', label: 'Status' },
      { key: 'source', label: 'Sumber' },
    ])
    downloadCsv(`janji-${branch?.slug ?? 'cabang'}-${today}.csv`, csv)
    if (activeUserId) {
      addAuditLog({ type: 'export_csv', scope: `Janji hari ini · ${branch?.name ?? ''} · ${today}` }, activeUserId, branchId)
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[13px] text-muted">{formatLongDateID(now())}</p>
          <h1 className="mt-0.5 font-display text-[34px] font-medium leading-[1.15]">Janji hari ini</h1>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Button variant="secondary" size="sm" onClick={handleExportCsv}>
            Ekspor CSV (tanpa nama &amp; nomor)
          </Button>
          <Button variant="primary" size="sm" onClick={() => setShowManualForm((v) => !v)}>
            Tambah janji manual
          </Button>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-3.5">
        <StatTile label="Total janji hari ini" value={stats.total} />
        <StatTile label="Menunggu konfirmasi" value={stats.menungguKonfirmasi} colorClassName="text-warning-text" />
        <StatTile label="Sudah hadir" value={stats.hadir} colorClassName="text-success-text" />
        <StatTile label="Tidak hadir" value={stats.tidakHadir} colorClassName="text-danger-text" />
      </div>

      {showManualForm && branchId && (
        <ManualAppointmentForm branchId={branchId} date={today} onDone={() => setShowManualForm(false)} />
      )}

      <div className="flex flex-wrap items-start gap-[22px]">
        <div className="min-w-0 flex-1 basis-[640px] overflow-hidden rounded-card border border-border bg-surface">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-[22px] py-[18px]">
            <p className="font-display text-lg">Daftar janji · {branch?.name ?? 'Cabang'}</p>
            <p className="text-xs text-muted">Perubahan status tercatat di log audit</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-[13.5px]">
              <thead>
                <tr className="bg-[#faf9f4] text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                  <th className="px-[22px] py-2.5">Jam</th>
                  <th className="px-2 py-2.5">Pasien</th>
                  <th className="px-2 py-2.5">Layanan</th>
                  <th className="px-2 py-2.5">Sumber</th>
                  <th className="px-2 py-2.5">Status</th>
                  <th className="px-[22px] py-2.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-[22px] py-6 text-center text-muted">
                      Belum ada janji untuk hari ini.
                    </td>
                  </tr>
                )}
                {appointments.map((appointment) => (
                  <Fragment key={appointment.id}>
                    <tr className="border-t border-[#efece3] align-middle">
                      <td className="px-[22px] py-3.5 font-bold">{appointment.timeSlot}</td>
                      <td className="px-2 py-3.5">
                        <p className="font-semibold">{appointment.patientName}</p>
                        <p className="text-xs text-muted">{maskPhone(appointment.patientWhatsapp)}</p>
                      </td>
                      <td className="px-2 py-3.5">{getServiceCategoryName(appointment.serviceCategoryId)}</td>
                      <td className="px-2 py-3.5 text-xs font-semibold text-muted">{SOURCE_LABELS[appointment.source]}</td>
                      <td className="px-2 py-3.5">
                        <StatusChip tone={APPOINTMENT_STATUS_TONE[appointment.status]} label={appointment.status} />
                      </td>
                      <td className="px-[22px] py-3.5 text-right">
                        {appointment.status === 'baru' && (
                          <Button variant="primary" size="sm" onClick={() => handleConfirmViaWhatsapp(appointment)}>
                            Konfirmasi via WhatsApp
                          </Button>
                        )}
                        {appointment.status === 'dikonfirmasi' && (
                          <Button variant="secondary" size="sm" onClick={() => handleStatusChange(appointment, 'hadir')}>
                            Tandai hadir
                          </Button>
                        )}
                        {!['baru', 'dikonfirmasi'].includes(appointment.status) && (
                          <Button
                            variant="outline-light"
                            size="sm"
                            onClick={() => setExpandedId((id) => (id === appointment.id ? null : appointment.id))}
                          >
                            Lihat
                          </Button>
                        )}
                      </td>
                    </tr>
                    {expandedId === appointment.id && (
                      <tr className="border-t border-[#efece3] bg-ivory">
                        <td colSpan={6} className="px-[22px] py-3 text-xs text-muted">
                          Janji #{appointment.appointmentNumber} · dibuat {appointment.createdAt} · persetujuan penyimpanan data:{' '}
                          {appointment.consentGiven ? 'ya' : 'tidak'}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {branchId && <ReminderSidePanel branchId={branchId} tomorrowDate={tomorrow} />}
      </div>
    </div>
  )
}
