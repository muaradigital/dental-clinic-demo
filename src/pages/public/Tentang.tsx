import { Icon } from '@/components/public/icons'
import { FaqAccordion } from '@/components/public/FaqAccordion'
import { useReveal } from '@/hooks/useReveal'
import { cn } from '@/lib/cn'
import { faq, tentangPage } from '@/data/seed/staticPages'

export function Tentang() {
  const { ref: proseRef, revealProps: proseRevealProps } = useReveal<HTMLDivElement>()
  const { ref: cardRef, revealProps: cardRevealProps } = useReveal<HTMLDivElement>({ delay: 100 })

  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-20 pt-2 md:px-10">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal">{tentangPage.eyebrow}</p>
      <h1 className="mb-8 mt-2.5 font-display text-4xl font-medium leading-tight md:text-5xl">{tentangPage.title}</h1>

      <div className="mb-16 grid gap-7 md:grid-cols-[1.3fr_1fr]">
        <div ref={proseRef} {...proseRevealProps} className={cn(proseRevealProps.className)}>
          <p className="text-lg text-ink">{tentangPage.intro}</p>
          <h3 className="mb-3 mt-7 font-display text-xl font-medium">{tentangPage.workingHeading}</h3>
          <ul className="flex flex-col gap-2.5">
            {tentangPage.workingPoints.map((point) => (
              <li key={point} className="flex gap-2.5 text-sm text-muted">
                <Icon name="check" width={16} height={16} className="mt-0.5 flex-none text-teal" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div
          ref={cardRef}
          {...cardRevealProps}
          className={cn(cardRevealProps.className, 'rounded-card-sm border border-border bg-surface p-7')}
        >
          <h3 className="font-display text-xl font-medium">{tentangPage.summaryTitle}</h3>
          <ul className="mt-4 flex flex-col gap-3.5 text-sm">
            {tentangPage.summaryPoints.map((point) => (
              <li key={point.text} className="flex items-center gap-3">
                <Icon name={point.icon} width={18} height={18} className="flex-none text-teal" />
                {point.text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="mb-7 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-teal">{tentangPage.faqEyebrow}</p>
          <h2 className="font-display text-3xl font-medium">{tentangPage.faqTitle}</h2>
        </div>
        <FaqAccordion items={faq} />
      </div>
    </div>
  )
}
