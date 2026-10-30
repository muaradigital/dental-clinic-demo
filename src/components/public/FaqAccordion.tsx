import { useReveal } from '@/hooks/useReveal'
import { cn } from '@/lib/cn'

export interface FaqAccordionProps {
  items: { question: string; answer: string }[]
}

/** Native <details>/<summary> — no JS, keyboard/screen-reader native by default. */
export function FaqAccordion({ items }: FaqAccordionProps) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <FaqItem key={item.question} item={item} />
      ))}
    </div>
  )
}

function FaqItem({ item }: { item: { question: string; answer: string } }) {
  const { ref, revealProps } = useReveal<HTMLDetailsElement>()
  return (
    <details
      ref={ref}
      {...revealProps}
      className={cn(revealProps.className, 'faq-item rounded-chip border border-border bg-surface px-5 py-4')}
    >
      <summary className="flex items-center justify-between gap-4 font-display text-base font-medium text-teal after:text-xl after:font-sans after:font-light after:text-teal">
        <span className="text-ink">{item.question}</span>
      </summary>
      <p className="mt-2.5 text-sm text-muted">{item.answer}</p>
    </details>
  )
}
