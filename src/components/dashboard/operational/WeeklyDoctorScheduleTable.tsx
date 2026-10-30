import { Avatar } from '@/components/primitives'
import { getBranchById } from '@/data/repositories/branchRepository'
import { getDoctors } from '@/data/repositories/doctorRepository'
import type { Weekday } from '@/types'

const WEEKDAYS: Weekday[] = [1, 2, 3, 4, 5, 6]
const HEADS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

export function WeeklyDoctorScheduleTable() {
  const doctors = getDoctors()

  return (
    <div className="rounded-card border border-border bg-surface p-[22px]">
      <p className="mb-1 font-display text-lg">Jadwal praktik mingguan</p>
      <p className="mb-4 text-xs text-muted">
        PK = Pusat Kota · TM = Timur · BR = Barat. Perubahan tampil di website dalam hitungan menit.
      </p>
      <div className="overflow-x-auto">
        <div className="min-w-[580px]">
          <div className="mb-1.5 flex gap-1.5">
            <div className="flex-none basis-[190px]" />
            {HEADS.map((h) => (
              <div key={h} className="min-w-0 flex-1 text-center text-xs font-semibold text-muted">
                {h}
              </div>
            ))}
          </div>
          {doctors.map((doctor) => (
            <div key={doctor.id} className="mb-2 flex items-center gap-1.5">
              <div className="flex flex-none basis-[190px] items-center gap-2.5">
                <Avatar initials={doctor.initials} seed={doctor.avatarSeed} size="sm" />
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold leading-tight">{doctor.name}</p>
                  <p className="text-[11px] text-muted">{doctor.specialty}</p>
                </div>
              </div>
              {WEEKDAYS.map((weekday) => {
                const entry = doctor.schedule.find((e) => e.weekday === weekday)
                const code = entry ? getBranchById(entry.branchId)?.code : undefined
                return (
                  <div
                    key={weekday}
                    className={
                      code
                        ? 'min-w-0 flex-1 rounded-input bg-soft-teal-bg py-2 text-center text-xs font-bold text-soft-teal-text'
                        : 'min-w-0 flex-1 rounded-input bg-sand-neutral py-2 text-center text-xs font-medium text-muted'
                    }
                  >
                    {code ?? '–'}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
