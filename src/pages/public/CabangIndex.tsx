import { Navigate } from 'react-router-dom'
import { BranchCard } from '@/components/public/BranchCard'
import { useClinicSettings } from '@/data/repositories/clinicRepository'
import { useVisibleBranches } from '@/data/repositories/branchRepository'

const STAGGER: (0 | 100 | 200 | 300)[] = [0, 100, 200, 300]

export function CabangIndex() {
  const clinic = useClinicSettings()
  const branches = useVisibleBranches()

  if (!clinic.hasMultipleBranches) return <Navigate to="/" replace />

  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-20 pt-2 md:px-10">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal">Cabang kami</p>
      <h1 className="mb-2.5 mt-2.5 font-display text-4xl font-medium leading-tight md:text-5xl">
        Pilih cabang yang paling dekat.
      </h1>
      <p className="mb-10 max-w-xl text-muted">
        Setiap cabang punya halaman, jam praktik, dan nomor WhatsApp sendiri.
      </p>

      <div className="grid gap-[22px] md:grid-cols-3">
        {branches.map((branch, i) => (
          <BranchCard key={branch.id} branch={branch} delay={STAGGER[i % STAGGER.length]} />
        ))}
      </div>
    </div>
  )
}
