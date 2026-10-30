import { DoctorCard } from '@/components/public/DoctorCard'
import { getDoctors } from '@/data/repositories/doctorRepository'
import { dokterPage } from '@/data/seed/staticPages'
import { doctorsCaption } from '@/data/seed/homepage'

const STAGGER: (0 | 100 | 200 | 300)[] = [0, 100, 200, 300]

export function Dokter() {
  const doctors = getDoctors()

  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-20 pt-2 md:px-10">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal">{dokterPage.eyebrow}</p>
      <h1 className="mb-2.5 mt-2.5 font-display text-4xl font-medium leading-tight md:text-5xl">{dokterPage.title}</h1>
      <p className="mb-10 max-w-xl text-muted">{dokterPage.lead}</p>

      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
        {doctors.map((doctor, i) => (
          <DoctorCard key={doctor.id} doctor={doctor} delay={STAGGER[i % STAGGER.length]} />
        ))}
      </div>
      <p className="mx-auto mt-10 max-w-md text-center text-xs text-muted">{doctorsCaption}</p>
    </div>
  )
}
