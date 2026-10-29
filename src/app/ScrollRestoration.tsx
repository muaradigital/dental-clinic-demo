import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

/**
 * Deliberately instant (not smooth) scroll-to-top on route change, matching
 * the mockup's intentional behavior — a smooth scroll here would visibly
 * fight the page fade-in transition.
 */
export function ScrollRestoration() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return <Outlet />
}
