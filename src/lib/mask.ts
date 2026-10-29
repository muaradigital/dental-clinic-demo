/** "081234563321" -> "0812-xxxx-3321", matching the masked phone format already used in the design export. */
export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 7) return phone
  const head = digits.slice(0, 4)
  const tail = digits.slice(-4)
  return `${head}-xxxx-${tail}`
}
