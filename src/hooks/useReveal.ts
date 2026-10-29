import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

const REVEAL_THRESHOLD = 0.12
const REVEAL_ROOT_MARGIN = '0px 0px -40px 0px'

let sharedObserver: IntersectionObserver | null = null
const callbacks = new WeakMap<Element, () => void>()

function getSharedObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === 'undefined') return null
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callbacks.get(entry.target)?.()
            sharedObserver?.unobserve(entry.target)
            callbacks.delete(entry.target)
          }
        })
      },
      { threshold: REVEAL_THRESHOLD, rootMargin: REVEAL_ROOT_MARGIN },
    )
  }
  return sharedObserver
}

// Pure CSR app, no SSR/hydration to mismatch against — this capability
// check is safe to read directly during render rather than via an effect.
const supportsIntersectionObserver = typeof IntersectionObserver !== 'undefined'

export interface UseRevealOptions {
  delay?: 0 | 100 | 200 | 300
}

export interface UseRevealResult<T extends HTMLElement> {
  ref: React.RefObject<T | null>
  isRevealed: boolean
  /**
   * Spread onto the element. Default-visible (`.reveal` alone renders fully
   * opaque, see index.css); only once JS confirms observer support and the
   * user hasn't asked for reduced motion does `data-reveal-ready` opt the
   * element into the hidden->fade-up transition. Content can never end up
   * stuck invisible if JS fails or during a full-page screenshot.
   */
  revealProps: {
    className: string
    'data-reveal-ready'?: true
    'data-reveal-in'?: true
  }
}

const DELAY_CLASS: Record<number, string> = {
  0: '',
  100: 'reveal-d1',
  200: 'reveal-d2',
  300: 'reveal-d3',
}

export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options?: UseRevealOptions,
): UseRevealResult<T> {
  const ref = useRef<T | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const [isRevealed, setIsRevealed] = useState(false)
  const isReady = supportsIntersectionObserver && !prefersReducedMotion

  useEffect(() => {
    const el = ref.current
    if (!el || !isReady) return

    const observer = getSharedObserver()
    if (!observer) return

    callbacks.set(el, () => setIsRevealed(true))
    observer.observe(el)
    return () => {
      observer.unobserve(el)
      callbacks.delete(el)
    }
  }, [isReady])

  const delayClass = DELAY_CLASS[options?.delay ?? 0]
  const className = ['reveal', delayClass].filter(Boolean).join(' ')
  const revealed = prefersReducedMotion ? true : isRevealed

  return {
    ref,
    isRevealed: revealed,
    revealProps: {
      className,
      ...(isReady ? { 'data-reveal-ready': true as const } : {}),
      ...(revealed && isReady ? { 'data-reveal-in': true as const } : {}),
    },
  }
}
