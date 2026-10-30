import { useEffect } from 'react'
import { Button, NoticeBanner, StatusChip, Tabs, Toggle } from '@/components/primitives'
import { StatTile } from '@/components/dashboard/shared/StatTile'
import { getBranchById, useVisibleBranches } from '@/data/repositories/branchRepository'
import {
  getReminderCandidates,
  sendAllSendable,
  sendReminder,
  updateReminderSettings,
  useReminderSettings,
} from '@/data/repositories/reminderRepository'
import { useBranchScope } from '@/hooks/useBranchScope'
import { addDays, formatLongDateID, now, toISODate } from '@/lib/date'
import { maskPhone } from '@/lib/mask'
import { useDemoStore } from '@/store/useDemoStore'
import type { ReminderCandidate } from '@/data/repositories/reminderRepository'

const STATUS_CHIP_TONE = {
  terkirim: 'success',
  'belum dikirim': 'warning',
  'tidak dikirim': 'neutral',
} as const

export function Pengingat() {
  const { scope, effectiveBranchId } = useBranchScope()
  const visibleBranches = useVisibleBranches()
  const setBranch = useDemoStore((s) => s.setBranch)
  // Subscribe so sent reminders re-render this page immediately.
  useDemoStore((s) => s.reminderLog)

  useEffect(() => {
    if (scope === 'all' && !effectiveBranchId && visibleBranches[0]) {
      setBranch(visibleBranches[0].id)
    }
  }, [scope, effectiveBranchId, visibleBranches, setBranch])

  const branchId = effectiveBranchId ?? visibleBranches[0]?.id ?? ''
  const branch = getBranchById(branchId)
  const tomorrow = addDays(now(), 1)
  const tomorrowISO = toISODate(tomorrow)
  const candidates = branchId ? getReminderCandidates(branchId, tomorrowISO) : []
  const settings = useReminderSettings()

  const perluDikirim = candidates.filter((c) => c.sendStatus === 'belum dikirim').length
  const sudahTerkirim = candidates.filter((c) => c.sendStatus === 'terkirim').length
  const tidakBisaDikirim = candidates.filter((c) => c.sendStatus === 'tidak dikirim').length

  const previewSubject: ReminderCandidate | undefined =
    candidates.find((c) => c.sendStatus === 'belum dikirim') ?? candidates[0]

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[13px] text-muted">Untuk janji {formatLongDateID(tomorrow)}</p>
          <h1 className="mt-0.5 font-display text-[34px] font-medium leading-[1.15]">Pengingat</h1>
        </div>
        <Tabs
          options={[
            { value: 'manual', label: 'Mode A · Manual' },
            { value: 'otomatis', label: 'Mode B · Otomatis' },
          ]}
          value="manual"
          onChange={() => {}}
          aria-label="Mode pengingat"
        />
      </div>

      <div className="mb-5 flex flex-wrap gap-3.5">
        <StatTile label="Perlu dikirim" value={perluDikirim} colorClassName="text-warning-text" />
        <StatTile label="Sudah terkirim" value={sudahTerkirim} colorClassName="text-success-text" />
        <StatTile label="Tidak bisa dikirim" value={tidakBisaDikirim} colorClassName="text-danger-text" />
        <StatTile label="Total janji besok" value={candidates.length} />
      </div>

      <div className="flex flex-wrap items-start gap-[22px]">
        <div className="min-w-0 flex-1 basis-[620px] overflow-hidden rounded-card border border-border bg-surface">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-[22px] py-[18px]">
            <p className="font-display text-lg">Pengingat H-1 · {branch?.name ?? 'Cabang'}</p>
            <Button variant="secondary" size="sm" disabled={perluDikirim === 0} onClick={() => sendAllSendable(branchId, tomorrowISO)}>
              Kirim semua yang bisa dikirim
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-[13.5px]">
              <thead>
                <tr className="bg-[#faf9f4] text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                  <th className="px-[22px] py-2.5">Jam</th>
                  <th className="px-2 py-2.5">Pasien</th>
                  <th className="px-2 py-2.5">Persetujuan</th>
                  <th className="px-2 py-2.5">Status</th>
                  <th className="px-[22px] py-2.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {candidates.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-[22px] py-6 text-center text-muted">
                      Tidak ada janji besok untuk cabang ini.
                    </td>
                  </tr>
                )}
                {candidates.map(({ appointment, sendStatus }) => (
                  <tr key={appointment.id} className="border-t border-[#efece3]">
                    <td className="px-[22px] py-3.5 font-bold">{appointment.timeSlot}</td>
                    <td className="px-2 py-3.5">
                      <p className="font-semibold">{appointment.patientName}</p>
                      <p className="text-xs text-muted">{maskPhone(appointment.patientWhatsapp)}</p>
                    </td>
                    <td className={`px-2 py-3.5 text-[12.5px] font-semibold ${appointment.consentGiven ? 'text-teal-soft' : 'text-danger-text'}`}>
                      {appointment.consentGiven ? 'Setuju' : 'Tidak setuju'}
                    </td>
                    <td className="px-2 py-3.5">
                      <StatusChip tone={STATUS_CHIP_TONE[sendStatus]} label={sendStatus} />
                    </td>
                    <td className="px-[22px] py-3.5 text-right">
                      <Button
                        variant={sendStatus === 'terkirim' ? 'outline-light' : 'primary'}
                        size="sm"
                        disabled={sendStatus === 'tidak dikirim'}
                        onClick={() => sendReminder(appointment.id)}
                      >
                        {sendStatus === 'terkirim' ? 'Kirim ulang' : 'Kirim'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 basis-[280px] flex-col gap-[18px] lg:max-w-[360px]">
          <div className="rounded-card border border-border bg-surface p-5">
            <p className="mb-3 font-display text-lg">Isi pesan</p>
            {previewSubject ? (
              <div className="rounded-[16px_16px_16px_4px] border border-[#cfe9d8] bg-[#e9f7ee] p-3.5 text-[13px] text-[#15402a]">
                Halo {previewSubject.appointment.patientName.split(' ')[0]}, pengingat janji Anda di Klinik Gigi Arunika{' '}
                {branch?.name ?? ''} pada {formatLongDateID(tomorrow)} pukul {previewSubject.appointment.timeSlot}.
                {settings.includeRescheduleLink && ' Untuk jadwal ulang atau batal: [tautan]'}
              </div>
            ) : (
              <p className="text-sm text-muted">Tidak ada janji untuk dipratinjau.</p>
            )}
            <p className="mt-3 text-xs text-muted">Pesan tidak menyebut layanan atau kondisi kesehatan. Pasien dapat berhenti menerima pengingat.</p>
          </div>

          <div className="rounded-card border border-border bg-surface p-5">
            <p className="mb-2 font-display text-lg">Pengaturan</p>
            <div className="flex flex-col gap-0">
              <div className="border-t border-[#efece3] py-2.5 first:border-t-0">
                <Toggle
                  checked={settings.hMinus1Enabled}
                  onChange={(v) => updateReminderSettings({ hMinus1Enabled: v })}
                  label="Pengingat H-1"
                />
              </div>
              <div className="border-t border-[#efece3] py-2.5">
                <Toggle
                  checked={settings.hoursBeforeEnabled}
                  onChange={(v) => updateReminderSettings({ hoursBeforeEnabled: v })}
                  label="Pengingat beberapa jam sebelum"
                />
              </div>
              <div className="border-t border-[#efece3] py-2.5">
                <Toggle
                  checked={settings.includeRescheduleLink}
                  onChange={(v) => updateReminderSettings({ includeRescheduleLink: v })}
                  label="Sertakan tautan jadwal ulang"
                />
              </div>
            </div>
          </div>

          <NoticeBanner tone="warning">
            Mode B memakai WhatsApp Business API: ada biaya per pesan, template harus disetujui Meta, dan persetujuan
            pasien wajib tercatat.
          </NoticeBanner>
        </div>
      </div>
    </div>
  )
}
