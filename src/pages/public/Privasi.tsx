import { useReveal } from '@/hooks/useReveal'
import { cn } from '@/lib/cn'
import { privasiPage } from '@/data/seed/staticPages'

export function Privasi() {
  const { ref, revealProps } = useReveal<HTMLDivElement>()

  return (
    <div className="mx-auto max-w-[800px] px-5 pb-20 pt-2 md:px-10">
      <h1 className="mb-6 mt-2.5 font-display text-4xl font-medium leading-tight md:text-5xl">{privasiPage.title}</h1>

      <div ref={ref} {...revealProps} className={cn(revealProps.className, 'flex flex-col gap-6')}>
        <p className="text-sm text-muted">{privasiPage.intro}</p>
        {privasiPage.sections.map((section) => (
          <div key={section.heading}>
            <h3 className="mb-2 font-display text-xl font-medium">{section.heading}</h3>
            <p className="text-sm text-muted">{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
