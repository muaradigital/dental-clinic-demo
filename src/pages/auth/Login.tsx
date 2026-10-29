import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/primitives'
import { users } from '@/data/seed/users'
import { ROLE_CONFIG, ROLE_ORDER } from '@/lib/permissions'
import { useDemoStore } from '@/store/useDemoStore'
import type { RoleId } from '@/types'

/**
 * Functional-but-minimal for Slice 1 so RequireRole/Sidebar/switchers can be
 * verified end to end. Full visual design (quick-role box styling, OTP
 * step, success step) lands in Slice 4.
 */
export function Login() {
  const navigate = useNavigate()
  const login = useDemoStore((s) => s.login)

  function handleLogin(role: RoleId) {
    const user = users.find((u) => u.role === role)
    if (!user) return
    login(user.id)
    navigate(ROLE_CONFIG[role].defaultLandingRoute)
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm rounded-card-sm border border-border bg-white p-8 text-center">
        <h1 className="font-display text-2xl font-medium text-ink">Masuk</h1>
        <p className="mt-2 text-sm text-muted">Masuk cepat untuk demo, pilih peran:</p>
        <div className="mt-5 flex flex-col gap-2">
          {ROLE_ORDER.map((role) => (
            <Button key={role} variant="outline-light" fullWidth onClick={() => handleLogin(role)}>
              {ROLE_CONFIG[role].label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
