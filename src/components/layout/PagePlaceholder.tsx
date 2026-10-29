export interface PagePlaceholderProps {
  title: string
  note: string
}

export function PagePlaceholder({ title, note }: PagePlaceholderProps) {
  return (
    <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-10">
      <h1 className="font-display text-3xl font-medium text-ink">{title}</h1>
      <p className="mt-3 max-w-xl text-sm text-muted">{note}</p>
    </div>
  )
}
