import { Avatar, Card } from '@/components/primitives'
import { getBranchById } from '@/data/repositories/branchRepository'
import { useReveal, type UseRevealOptions } from '@/hooks/useReveal'
import { getWeekdayShort } from '@/lib/date'
import type { Doctor, Weekday } from '@/types'

export interface DoctorCardProps {
  doctor: Doctor
  delay?: UseRevealOptions['delay']
}

export function DoctorCard({ doctor, delay }: DoctorCardProps) {
  const { ref, revealProps } = useReveal<HTMLDivElement>({ delay })

  const branchNames = Array.from(new Set(doctor.schedule.map((entry) => entry.branchId)))
    .map((id) => getBranchById(id)?.name.replace('Cabang ', ''))
    .filter(Boolean)
    .join(' & ')

  const days = Array.from(new Set(doctor.schedule.map((entry) => entry.weekday))).sort(
    (a, b) => a - b,
  ) as Weekday[]

  return (
    <div ref={ref} {...revealProps}>
      <Card variant="interactive" className="h-full text-center">
        <Avatar initials={doctor.initials} seed={doctor.avatarSeed} size="lg" ring className="mx-auto" />
        <h3 className="mt-4 font-display text-lg font-medium">
          {doctor.name}
          {doctor.title ? `, ${doctor.title}` : ''}
        </h3>
        <p className="text-[0.8rem] font-semibold text-teal">{doctor.specialty}</p>
        <p className="mt-1 text-sm text-muted">{branchNames}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          {days.map((day) => (
            <span key={day} className="rounded-pill bg-mint px-2.5 py-[3px] text-xs font-semibold text-teal">
              {getWeekdayShort(day)}
            </span>
          ))}
        </div>
      </Card>
    </div>
  )
}
