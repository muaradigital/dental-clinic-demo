// TODO(Slice 3): real validation for the reservation contact form
// (name required, WhatsApp number format, consent checked).
export function isValidWhatsappNumber(value: string): boolean {
  return /^0\d{9,13}$/.test(value.replace(/[\s-]/g, ''))
}

export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0
}
