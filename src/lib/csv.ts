import type { AppointmentExportRow } from '@/types'

// TODO(Slice 4): real CSV serialization. The row type already structurally
// excludes patient name/phone — this just needs to stringify it.
export function toCsv(_rows: AppointmentExportRow[]): string {
  return ''
}
