import { useBranches } from '@/data/repositories/branchRepository'
import { useBranchScope } from '@/hooks/useBranchScope'
import { useDemoStore } from '@/store/useDemoStore'

export function BranchSwitcherDropdown() {
  const branches = useBranches()
  const { scope, lockedBranchId } = useBranchScope()
  const activeBranchId = useDemoStore((s) => s.activeBranchId)
  const setBranch = useDemoStore((s) => s.setBranch)

  const lockedBranch = branches.find((b) => b.id === lockedBranchId)

  if (scope === 'locked') {
    return (
      <div>
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-on-dark-muted">Cabang aktif</p>
        <div className="rounded-input border border-white/14 bg-white/8 px-3.5 py-2 text-sm font-semibold text-white">
          {lockedBranch?.name ?? 'Cabang tidak diketahui'}
        </div>
      </div>
    )
  }

  return (
    <div>
      <label htmlFor="branch-switcher" className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-on-dark-muted">
        Cabang aktif
      </label>
      <select
        id="branch-switcher"
        value={activeBranchId ?? 'all'}
        onChange={(e) => setBranch(e.target.value === 'all' ? null : e.target.value)}
        className="w-full rounded-input border border-white/14 bg-white/8 px-3.5 py-2 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-teal-bright"
      >
        <option value="all" className="text-ink">
          Semua cabang
        </option>
        {branches.map((branch) => (
          <option key={branch.id} value={branch.id} className="text-ink">
            {branch.name}
          </option>
        ))}
      </select>
    </div>
  )
}
