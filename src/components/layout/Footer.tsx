import { NavLink } from 'react-router-dom'
import { demoDataLabel, footerDisclaimer } from '@/data/seed/homepage'
import { useVisibleBranches } from '@/data/repositories/branchRepository'
import { useClinicSettings } from '@/data/repositories/clinicRepository'
import { Logo } from './Logo'

export interface FooterProps {
  condensed?: boolean
}

export function Footer({ condensed }: FooterProps) {
  const clinic = useClinicSettings()
  const branches = useVisibleBranches()

  return (
    <footer className="bg-ink text-on-dark">
      <div className="mx-auto max-w-[1200px] px-5 py-14 md:px-10">
        {!condensed && (
          <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
            <div>
              <Logo onDark />
              <p className="mt-4 max-w-xs text-sm text-on-dark">
                Klinik gigi {clinic.hasMultipleBranches ? 'dengan tiga cabang' : ''}. Reservasi mudah, informasi
                jelas.
              </p>
            </div>
            <FooterColumn
              title="Halaman"
              links={[
                { to: '/layanan', label: 'Layanan' },
                { to: '/dokter', label: 'Dokter' },
                { to: '/tentang', label: 'Tentang & FAQ' },
              ]}
            />
            {clinic.hasMultipleBranches && (
              <FooterColumn
                title="Cabang"
                links={branches.map((b) => ({ to: `/cabang/${b.slug}`, label: b.name.replace('Cabang ', '') }))}
              />
            )}
            <FooterColumn title="Legal" links={[{ to: '/privasi', label: 'Kebijakan privasi' }]} />
          </div>
        )}
        <div className="mt-10 flex flex-col gap-2 border-t border-white/15 pt-6 text-xs text-on-dark-muted md:flex-row md:items-center md:justify-between">
          <p>{footerDisclaimer}</p>
          <span className="inline-flex shrink-0 items-center rounded-pill bg-white/10 px-3 py-1 font-semibold text-on-dark-muted">
            {demoDataLabel}
          </span>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-on-dark-muted">{title}</p>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              className="inline-block text-sm text-on-dark transition-transform duration-200 hover:translate-x-1 hover:text-white"
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}
