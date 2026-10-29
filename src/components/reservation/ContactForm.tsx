import { NoticeBanner, TextField } from '@/components/primitives'

export interface ContactFormProps {
  name: string
  whatsapp: string
  consent: boolean
  onNameChange: (value: string) => void
  onWhatsappChange: (value: string) => void
  onConsentChange: (value: boolean) => void
  whatsappError?: string
}

export function ContactForm({
  name,
  whatsapp,
  consent,
  onNameChange,
  onWhatsappChange,
  onConsentChange,
  whatsappError,
}: ContactFormProps) {
  return (
    <div className="flex flex-col gap-3.5">
      <TextField
        label="Nama (nama panggilan boleh)"
        placeholder="mis. Rina"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        autoComplete="name"
      />
      <TextField
        label="Nomor WhatsApp"
        placeholder="08xx xxxx xxxx"
        value={whatsapp}
        onChange={(e) => onWhatsappChange(e.target.value)}
        error={whatsappError}
        autoComplete="tel"
        inputMode="numeric"
      />

      <NoticeBanner tone="warning">
        Jangan menulis keluhan atau riwayat kesehatan di sini. Dokter akan menanyakannya saat pemeriksaan.
      </NoticeBanner>

      <label className="flex items-start gap-2.5">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => onConsentChange(e.target.checked)}
          className="mt-0.5 h-[18px] w-[18px] flex-none accent-teal"
        />
        <span className="text-xs text-muted">
          Saya setuju nama dan nomor WhatsApp saya disimpan untuk konfirmasi dan pengingat janji selama 12 bulan.
        </span>
      </label>
    </div>
  )
}
