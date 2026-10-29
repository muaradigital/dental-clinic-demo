export interface CsvColumn<T> {
  key: keyof T
  label: string
}

function escapeCsvCell(value: string | number): string {
  const str = String(value)
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
}

/** Generic CSV serializer — the caller decides which columns exist, so a row type that
 * structurally excludes a field (e.g. patient name/phone) can never leak into the output. */
export function toCsv<T extends Record<string, string | number>>(rows: T[], columns: CsvColumn<T>[]): string {
  const header = columns.map((c) => escapeCsvCell(c.label)).join(',')
  const lines = rows.map((row) => columns.map((c) => escapeCsvCell(row[c.key])).join(','))
  return [header, ...lines].join('\r\n')
}

/** Triggers a browser download. UTF-8 BOM so Excel renders Indonesian text correctly. */
export function downloadCsv(filename: string, csvContent: string): void {
  const blob = new Blob([`﻿${csvContent}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
