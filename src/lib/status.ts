export type StatusTone = 'success' | 'soft-teal' | 'warning' | 'danger' | 'neutral' | 'indigo' | 'expired'

/**
 * Canonical tone -> Tailwind class pairs. The design export used two
 * slightly different hex pairs for its "warning" chip across screens
 * (#fff1d0/#6c4a00 and #fdecc8/#7a4b00) — this adopts the first,
 * everywhere, as the single source so chips never disagree with each other.
 */
export const STATUS_TONE_CLASSES: Record<StatusTone, string> = {
  success: 'bg-success-bg text-success-text',
  'soft-teal': 'bg-soft-teal-bg text-soft-teal-text',
  warning: 'bg-warning-bg text-warning-text',
  danger: 'bg-danger-bg text-danger-text',
  neutral: 'bg-neutral-bg text-neutral-text',
  indigo: 'bg-indigo-bg text-indigo-text',
  expired: 'bg-expired-bg text-expired-text',
}
