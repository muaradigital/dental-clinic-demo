import { useDemoStore } from '@/store/useDemoStore'
import type { Appointment } from '@/types'
import { getAppointments } from './appointmentRepository'

export interface ReminderCandidate {
  appointment: Appointment
  sendStatus: 'terkirim' | 'belum dikirim' | 'tidak dikirim'
}

export function getReminderCandidates(branchId: string, date: string): ReminderCandidate[] {
  const { reminderLog } = useDemoStore.getState()
  return getAppointments({ branchId, date }).map((appointment) => {
    const log = reminderLog[appointment.id]
    const sendStatus: ReminderCandidate['sendStatus'] = !appointment.consentGiven
      ? 'tidak dikirim'
      : log?.status === 'terkirim'
        ? 'terkirim'
        : 'belum dikirim'
    return { appointment, sendStatus }
  })
}

export function sendReminder(appointmentId: string): void {
  useDemoStore.getState().sendReminder(appointmentId)
}

export function sendAllSendable(branchId: string, date: string): void {
  const candidates = getReminderCandidates(branchId, date)
  candidates.filter((c) => c.sendStatus === 'belum dikirim').forEach((c) => sendReminder(c.appointment.id))
}

export function getReminderSettings() {
  return useDemoStore.getState().reminderSettings
}

export function updateReminderSettings(patch: Partial<ReturnType<typeof getReminderSettings>>): void {
  useDemoStore.getState().updateReminderSettings(patch)
}

export function useReminderSettings() {
  return useDemoStore((s) => s.reminderSettings)
}
