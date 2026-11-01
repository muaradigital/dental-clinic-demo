import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Logo } from '@/components/layout/Logo'
import { cn } from '@/lib/cn'

export interface DashboardLayoutProps {
  chromeless?: boolean
}

export function DashboardLayout({ chromeless }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  if (chromeless) {
    return (
      <div className="min-h-screen bg-dash-bg">
        <Outlet />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-dash-bg">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {isSidebarOpen && (
        <div
          aria-hidden
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-ink/50 md:hidden"
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-border bg-white px-5 py-3 md:hidden">
          <button
            type="button"
            aria-label={isSidebarOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={isSidebarOpen}
            onClick={() => setIsSidebarOpen((open) => !open)}
            className="relative flex h-9 w-9 flex-col items-center justify-center gap-1.5"
          >
            <span
              className={cn('h-[1.5px] w-5 bg-ink transition-all duration-300', isSidebarOpen && 'translate-y-[3px] rotate-45')}
            />
            <span
              className={cn('h-[1.5px] w-5 bg-ink transition-all duration-300', isSidebarOpen && '-translate-y-[3px] -rotate-45')}
            />
          </button>
          <Logo size="sm" />
        </div>

        <main className="flex-1 overflow-x-hidden px-5 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
