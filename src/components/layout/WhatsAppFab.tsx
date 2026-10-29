import { useClinicSettings } from '@/data/repositories/clinicRepository'

export function WhatsAppFab() {
  const clinic = useClinicSettings()
  const number = clinic.whatsappNumber.replace(/[^\d]/g, '')

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi via WhatsApp"
      className="group fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lift transition-transform duration-300 hover:scale-110 hover:-rotate-6"
      style={{ animation: 'wa-pulse 2.4s infinite' }}
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white" aria-hidden>
        <path d="M17.5 14.4c-.3-.1-1.6-.8-1.9-.9-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-1.3-.6-2.2-1.3-3-2.6-.1-.2-.1-.4.1-.6l.5-.6c.1-.2.1-.4 0-.6-.1-.2-.5-1.2-.7-1.6-.2-.4-.4-.3-.6-.3h-.5c-.2 0-.5.1-.7.3-.7.7-1 1.5-1 2.4.1 1.7 1 3.2 2.6 4.6 1.9 1.7 3.5 2.2 5.3 2.4.6.1 1.2-.1 1.7-.5.4-.4.7-1 .8-1.6 0-.2 0-.4-.1-.5z" />
      </svg>
      <span className="absolute right-16 whitespace-nowrap rounded-pill bg-ink px-3 py-1.5 text-xs font-medium text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 translate-x-2.5">
        Chat WhatsApp
      </span>
    </a>
  )
}
