import { ServiceCard } from '@/components/public/ServiceCard'
import { getServices } from '@/data/repositories/serviceRepository'
import { layananPage } from '@/data/seed/staticPages'

const STAGGER: (0 | 100 | 200 | 300)[] = [0, 100, 200, 300]

export function Layanan() {
  const services = getServices()

  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-20 pt-2 md:px-10">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal">{layananPage.eyebrow}</p>
      <h1 className="mb-2.5 mt-2.5 font-display text-4xl font-medium leading-tight md:text-5xl">{layananPage.title}</h1>
      <p className="mb-10 max-w-xl text-muted">{layananPage.lead}</p>

      <div className="grid gap-[18px] sm:grid-cols-2 md:grid-cols-4">
        {services.map((service, i) => (
          <ServiceCard key={service.id} service={service} delay={STAGGER[i % STAGGER.length]} />
        ))}
      </div>
    </div>
  )
}
