import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { getNextStatus } from '@/lib/content'
import { appointments as seedAppointments } from '@/data/seed/appointments'
import { auditLog as seedAuditLog } from '@/data/seed/auditLog'
import { branches as seedBranches } from '@/data/seed/branches'
import { clinicSettings as seedClinicSettings } from '@/data/seed/clinic'
import { content as seedContent } from '@/data/seed/content'
import { closures as seedClosures, slotSettings as seedSlotSettings } from '@/data/seed/practiceHours'
import { leaves as seedLeaves } from '@/data/seed/leaves'
import { reviews as seedReviews } from '@/data/seed/reviews'
import { users as seedUsers } from '@/data/seed/users'
import type {
  Appointment,
  AppointmentStatus,
  AuditLogEntry,
  AuditPayload,
  Branch,
  ClinicSettings,
  Closure,
  ContentItem,
  LeaveRequest,
  LeaveStatus,
  Review,
  RoleId,
  SlotSettings,
} from '@/types'

function renderAuditDescription(payload: AuditPayload): string {
  switch (payload.type) {
    case 'status_appointment':
      return `Janji #${payload.appointmentNumber}: ${payload.from} → ${payload.to}`
    case 'reminder_sent':
      return `Mengirim pengingat H-1 · Janji #${payload.appointmentNumber}`
    case 'content_submit_review':
      return `Mengajukan tinjauan "${payload.contentTitle}"`
    case 'content_request_revision':
      return `Meminta revisi "${payload.contentTitle}"`
    case 'content_publish':
      return `Menayangkan "${payload.contentTitle}"`
    case 'export_csv':
      return `Mengekspor laporan CSV · ${payload.scope}`
    case 'settings_change':
      return `Mengubah pengaturan: ${payload.setting}`
    case 'login':
      return `Masuk sebagai ${payload.role}`
  }
}

interface ReminderSettings {
  hMinus1Enabled: boolean
  hoursBeforeEnabled: boolean
  includeRescheduleLink: boolean
}

interface SessionState {
  activeRole: RoleId | null
  activeUserId: string | null
  activeBranchId: string | null
  isAuthenticated: boolean
  rememberedRoles: RoleId[]
}

interface DemoStoreState extends SessionState {
  clinic: ClinicSettings
  branches: Branch[]
  appointments: Appointment[]
  content: ContentItem[]
  reviews: Review[]
  leaves: LeaveRequest[]
  closures: Closure[]
  slotSettings: SlotSettings[]
  reminderSettings: ReminderSettings
  reminderLog: Record<string, { status: 'terkirim' | 'belum'; sentAt?: string }>
  auditLog: AuditLogEntry[]

  setRole: (role: RoleId) => void
  setBranch: (branchId: string | null) => void
  login: (userId: string) => void
  logout: () => void

  updateClinicSettings: (patch: Partial<ClinicSettings>) => void
  setBranchVisibility: (branchId: string, visible: boolean) => void

  createAppointment: (input: Omit<Appointment, 'id' | 'appointmentNumber' | 'createdAt'>) => Appointment
  updateAppointmentStatus: (id: string, status: AppointmentStatus, actorUserId: string) => void

  saveContentDraft: (id: string, patch: Partial<ContentItem>) => void
  submitContentForReview: (id: string) => void
  requestContentRevision: (id: string, note?: string) => void
  approveAndPublishContent: (id: string, reviewerId: string) => void
  publishContentDirect: (id: string) => void

  saveReviewDraftReply: (reviewId: string, text: string) => void
  approveAndSendReviewReply: (reviewId: string) => void

  sendReminder: (appointmentId: string) => void
  updateReminderSettings: (patch: Partial<ReminderSettings>) => void

  createLeaveRequest: (input: Omit<LeaveRequest, 'id' | 'createdAt'>) => LeaveRequest
  updateLeaveRequestStatus: (id: string, status: LeaveStatus) => void

  addClosure: (closure: Omit<Closure, 'id'>) => void
  removeClosure: (id: string) => void
  updateSlotSettings: (branchId: string, patch: Partial<Omit<SlotSettings, 'branchId'>>) => void

  addAuditLog: (payload: AuditPayload, actorUserId: string, branchId?: string) => void

  resetDemoData: () => void
}

const initialSession: SessionState = {
  activeRole: null,
  activeUserId: null,
  activeBranchId: null,
  isAuthenticated: false,
  rememberedRoles: [],
}

// Seed rows run through 1045 (see data/seed/appointments.ts) — the counter
// starts past them so a newly created appointment never collides with a seed id.
let appointmentCounter = 1045

export const useDemoStore = create<DemoStoreState>()(
  persist(
    (set, get) => ({
      ...initialSession,
      clinic: seedClinicSettings,
      branches: seedBranches,
      appointments: seedAppointments,
      content: seedContent,
      reviews: seedReviews,
      leaves: seedLeaves,
      closures: seedClosures,
      slotSettings: seedSlotSettings,
      reminderSettings: {
        hMinus1Enabled: true,
        hoursBeforeEnabled: false,
        includeRescheduleLink: true,
      },
      reminderLog: {},
      auditLog: seedAuditLog,

      setRole: (role) => set({ activeRole: role }),
      setBranch: (branchId) => set({ activeBranchId: branchId }),
      login: (userId) => {
        const user = seedUsers.find((u) => u.id === userId)
        if (!user) return
        set({
          activeUserId: user.id,
          activeRole: user.role,
          activeBranchId: user.branchId ?? null,
          isAuthenticated: true,
        })
        get().addAuditLog({ type: 'login', role: user.role }, user.id)
      },
      logout: () => set({ ...initialSession }),

      updateClinicSettings: (patch) => set((s) => ({ clinic: { ...s.clinic, ...patch } })),
      setBranchVisibility: (branchId, visible) =>
        set((s) => ({
          branches: s.branches.map((b) => (b.id === branchId ? { ...b, isVisible: visible } : b)),
        })),

      createAppointment: (input) => {
        appointmentCounter += 1
        const appointment: Appointment = {
          ...input,
          id: `appt-${appointmentCounter}`,
          appointmentNumber: String(appointmentCounter),
          createdAt: new Date().toISOString(),
        }
        set((s) => ({ appointments: [...s.appointments, appointment] }))
        return appointment
      },
      updateAppointmentStatus: (id, status, actorUserId) => {
        const current = get().appointments.find((a) => a.id === id)
        if (!current) return
        const from = current.status
        set((s) => ({
          appointments: s.appointments.map((a) => (a.id === id ? { ...a, status } : a)),
        }))
        get().addAuditLog(
          { type: 'status_appointment', appointmentNumber: current.appointmentNumber, from, to: status, branchId: current.branchId },
          actorUserId,
          current.branchId,
        )
      },

      saveContentDraft: (id, patch) =>
        set((s) => ({ content: s.content.map((c) => (c.id === id ? ({ ...c, ...patch } as ContentItem) : c)) })),
      submitContentForReview: (id) => {
        const item = get().content.find((c) => c.id === id)
        if (!item) return
        const nextStatus = getNextStatus(item, get().clinic.doctorReviewEnabled)
        set((s) => ({ content: s.content.map((c) => (c.id === id ? { ...c, status: nextStatus } : c)) }))
        get().addAuditLog({ type: 'content_submit_review', contentTitle: item.title, contentType: item.type }, get().activeUserId ?? 'unknown')
      },
      requestContentRevision: (id, note) => {
        const item = get().content.find((c) => c.id === id)
        if (!item) return
        set((s) => ({
          content: s.content.map((c) => (c.id === id ? { ...c, status: 'draf', reviewNote: note } : c)),
        }))
        get().addAuditLog({ type: 'content_request_revision', contentTitle: item.title, contentType: item.type }, get().activeUserId ?? 'unknown')
      },
      approveAndPublishContent: (id, reviewerId) => {
        const item = get().content.find((c) => c.id === id)
        if (!item) return
        set((s) => ({
          content: s.content.map((c) => (c.id === id ? { ...c, status: 'tayang', reviewerId } : c)),
        }))
        get().addAuditLog({ type: 'content_publish', contentTitle: item.title, contentType: item.type }, reviewerId)
      },
      publishContentDirect: (id) => {
        const item = get().content.find((c) => c.id === id)
        if (!item) return
        set((s) => ({ content: s.content.map((c) => (c.id === id ? { ...c, status: 'tayang' } : c)) }))
        get().addAuditLog({ type: 'content_publish', contentTitle: item.title, contentType: item.type }, get().activeUserId ?? 'unknown')
      },

      saveReviewDraftReply: (reviewId, text) =>
        set((s) => ({
          reviews: s.reviews.map((r) => (r.id === reviewId ? { ...r, replyStatus: 'draf balasan', replyText: text } : r)),
        })),
      approveAndSendReviewReply: (reviewId) =>
        set((s) => ({
          reviews: s.reviews.map((r) => (r.id === reviewId ? { ...r, replyStatus: 'sudah dibalas' } : r)),
        })),

      sendReminder: (appointmentId) => {
        const appointment = get().appointments.find((a) => a.id === appointmentId)
        set((s) => ({
          reminderLog: { ...s.reminderLog, [appointmentId]: { status: 'terkirim', sentAt: new Date().toISOString() } },
        }))
        if (appointment) {
          get().addAuditLog(
            { type: 'reminder_sent', appointmentNumber: appointment.appointmentNumber, branchId: appointment.branchId },
            get().activeUserId ?? 'unknown',
            appointment.branchId,
          )
        }
      },

      updateReminderSettings: (patch) => set((s) => ({ reminderSettings: { ...s.reminderSettings, ...patch } })),

      createLeaveRequest: (input) => {
        const leave: LeaveRequest = {
          ...input,
          id: `leave-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          createdAt: new Date().toISOString(),
        }
        set((s) => ({ leaves: [...s.leaves, leave] }))
        return leave
      },
      updateLeaveRequestStatus: (id, status) =>
        set((s) => ({ leaves: s.leaves.map((l) => (l.id === id ? { ...l, status } : l)) })),

      addClosure: (closure) =>
        set((s) => ({
          closures: [...s.closures, { ...closure, id: `closure-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` }],
        })),
      removeClosure: (id) => set((s) => ({ closures: s.closures.filter((c) => c.id !== id) })),
      updateSlotSettings: (branchId, patch) =>
        set((s) => ({
          slotSettings: s.slotSettings.map((ss) => (ss.branchId === branchId ? { ...ss, ...patch } : ss)),
        })),

      addAuditLog: (payload, actorUserId, branchId) => {
        const entry: AuditLogEntry = {
          id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          timestamp: new Date().toISOString(),
          userId: actorUserId,
          branchId,
          actionType: payload.type,
          description: renderAuditDescription(payload),
        }
        set((s) => ({ auditLog: [entry, ...s.auditLog] }))
      },

      resetDemoData: () =>
        set({
          ...initialSession,
          clinic: seedClinicSettings,
          branches: seedBranches,
          appointments: seedAppointments,
          content: seedContent,
          reviews: seedReviews,
          leaves: seedLeaves,
          closures: seedClosures,
          slotSettings: seedSlotSettings,
          reminderSettings: {
            hMinus1Enabled: true,
            hoursBeforeEnabled: false,
            includeRescheduleLink: true,
          },
          reminderLog: {},
          auditLog: seedAuditLog,
        }),
    }),
    { name: 'arunika-demo-v1' },
  ),
)
