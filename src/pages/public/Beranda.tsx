import { Section, Button } from '@/components/primitives'
import { AnnouncementBanner } from '@/components/public/AnnouncementBanner'
import { BranchCard } from '@/components/public/BranchCard'
import { CtaBanner } from '@/components/public/CtaBanner'
import { DoctorCard } from '@/components/public/DoctorCard'
import { HeroArt, HeroBlobs } from '@/components/public/HeroDecor'
import { Icon } from '@/components/public/icons'
import { ServiceCard } from '@/components/public/ServiceCard'
import { VisitStepCard } from '@/components/public/VisitStepCard'
import { useVisibleBranches } from '@/data/repositories/branchRepository'
import { useClinicSettings } from '@/data/repositories/clinicRepository'
import { usePublishedHomepageBanner } from '@/data/repositories/contentRepository'
import { getDoctors } from '@/data/repositories/doctorRepository'
import { getServiceCategories, getServices } from '@/data/repositories/serviceRepository'
import {
  branchesIntro,
  ctaBanner,
  doctorsCaption,
  doctorsIntro,
  hero,
  servicesIntro,
  visitFlowIntro,
  visitSteps,
} from '@/data/seed/homepage'

const STAGGER: (0 | 100 | 200 | 300)[] = [0, 100, 200, 300]

export function Beranda() {
  const visibleBranches = useVisibleBranches()
  const clinic = useClinicSettings()
  const banner = usePublishedHomepageBanner()
  const services = getServices()
  const serviceCategories = getServiceCategories()
  const doctors = getDoctors()

  return (
    <>
      {banner && <AnnouncementBanner announcement={banner} />}

      <section className="relative flex min-h-[calc(100vh-6rem)] items-center overflow-hidden px-5 py-10 md:px-10">
        <HeroBlobs />
        <div className="relative mx-auto grid w-full max-w-[1200px] gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <span className="eyebrow mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-teal">
              {hero.eyebrow}
            </span>
            <h1 className="font-display text-[2.5rem] font-medium leading-[1.1] md:text-[3.6rem]">
              {hero.headline.split(hero.headlineEmphasis).map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <em className="relative whitespace-nowrap font-display italic text-teal">
                      {hero.headlineEmphasis}
                      <svg viewBox="0 0 200 12" preserveAspectRatio="none" className="absolute inset-x-0 -bottom-2 h-3 w-full overflow-visible">
                        <path
                          d="M2 8C40 2 90 2 130 6S180 8 198 4"
                          stroke="#14b8a6"
                          strokeWidth={4}
                          fill="none"
                          strokeLinecap="round"
                          className="hero-underline"
                        />
                      </svg>
                    </em>
                  )}
                </span>
              ))}
            </h1>
            <p className="max-w-md text-base text-muted">{hero.subcopy}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button to="/reservasi" icon={<Icon name="arrow-right" width={15} height={15} />}>
                Reservasi online
              </Button>
              <Button to="/layanan" variant="secondary">
                Lihat layanan
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {clinic.hasMultipleBranches && <StatChip value={visibleBranches.length} label="cabang" />}
              <StatChip value={doctors.length} label="dokter gigi" />
              <StatChip value={serviceCategories.length} label="kategori layanan" />
            </div>
          </div>
          <HeroArt />
        </div>
      </section>

      {visibleBranches.length > 0 && (
        <Section
          eyebrow={branchesIntro.eyebrow}
          title={branchesIntro.title}
          subtitle={branchesIntro.subtitle}
          background="ivory"
        >
          <div className="grid gap-[22px] md:grid-cols-3">
            {visibleBranches.map((branch, i) => (
              <BranchCard key={branch.id} branch={branch} delay={STAGGER[i % STAGGER.length]} />
            ))}
          </div>
        </Section>
      )}

      {!clinic.hasMultipleBranches && clinic.singleLocationAddress && (
        <Section eyebrow="Lokasi klinik" title="Kunjungi klinik kami" background="ivory">
          <div className="mx-auto flex max-w-md flex-col items-center gap-2 text-center">
            <p className="text-base text-ink">{clinic.singleLocationAddress.address}</p>
            <p className="text-sm text-muted">WhatsApp {clinic.singleLocationAddress.whatsappNumber}</p>
          </div>
        </Section>
      )}

      <Section
        eyebrow={visitFlowIntro.eyebrow}
        title={visitFlowIntro.title}
        subtitle={visitFlowIntro.subtitle}
        background="dark"
      >
        <div className="grid gap-4 md:grid-cols-3">
          {visitSteps.map((step, i) => (
            <VisitStepCard key={step.number} step={step} delay={STAGGER[i % STAGGER.length]} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow={servicesIntro.eyebrow}
        title={servicesIntro.title}
        subtitle={servicesIntro.subtitle}
        background="sand"
      >
        <div className="grid gap-[18px] sm:grid-cols-2 md:grid-cols-4">
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} delay={STAGGER[i % STAGGER.length]} />
          ))}
        </div>
      </Section>

      <Section eyebrow={doctorsIntro.eyebrow} title={doctorsIntro.title} background="ivory">
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
          {doctors.map((doctor, i) => (
            <DoctorCard key={doctor.id} doctor={doctor} delay={STAGGER[i % STAGGER.length]} />
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-md text-center text-xs text-muted">{doctorsCaption}</p>
      </Section>

      <div className="mx-auto max-w-[1200px] px-5 pb-24 md:px-10">
        <CtaBanner title={ctaBanner.title} subtitle={ctaBanner.subtitle} buttonLabel={ctaBanner.buttonLabel} />
      </div>
    </>
  )
}

function StatChip({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-chip border border-border bg-white/75 px-4 py-2.5 text-[0.88rem] backdrop-blur">
      <b className="font-display text-xl text-teal">{value}</b>
      {label}
    </div>
  )
}
