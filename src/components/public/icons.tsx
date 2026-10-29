import type { SVGProps } from 'react'

export type IconKey =
  | 'stethoscope'
  | 'sparkles'
  | 'tooth'
  | 'tooth-outline'
  | 'root-canal'
  | 'braces'
  | 'denture'
  | 'child-tooth'
  | 'calendar'
  | 'clipboard-check'
  | 'search'
  | 'file-check'
  | 'tool'
  | 'receipt'
  | 'check'
  | 'arrow-right'
  | 'pin'
  | 'whatsapp-check'

const PATHS: Record<IconKey, string> = {
  stethoscope: 'M6 3v6a4 4 0 0 0 8 0V3M10 13v3a5 5 0 0 0 10 0v-2M20 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  sparkles: 'M9 3l1.2 3.6L14 8l-3.8 1.4L9 13l-1.2-3.6L4 8l3.8-1.4L9 3ZM17 13l.8 2.4L20 16l-2.2.8L17 19l-.8-2.2L14 16l2.2-.6L17 13Z',
  tooth: 'M12 4c-3 0-5.5 1.6-5 5.4.3 2.6 1.6 4 2 7.2.3 2 2 2.6 2.6.6.5-1.6 1-2 1.4-2s1 .4 1.4 2c.6 2 2.3 1.4 2.6-.6.4-3.2 1.7-4.6 2-7.2.5-3.8-2-5.4-5-5.4Z',
  'tooth-outline': 'M12 4c-3 0-5.5 1.6-5 5.4.3 2.6 1.6 4 2 7.2.3 2 2 2.6 2.6.6.5-1.6 1-2 1.4-2s1 .4 1.4 2c.6 2 2.3 1.4 2.6-.6.4-3.2 1.7-4.6 2-7.2.5-3.8-2-5.4-5-5.4Zm0 0v4',
  'root-canal': 'M12 3v6M9 9h6l-1 11a2 2 0 0 1-4 0L9 9Z',
  braces: 'M4 9h16M4 15h16M7 9v6M11 9v6M15 9v6M19 9v6',
  denture: 'M4 8c0-2.5 3.6-4 8-4s8 1.5 8 4-3.6 4-8 4-8-1.5-8-4Zm0 8c0-2.5 3.6-4 8-4s8 1.5 8 4-3.6 4-8 4-8-1.5-8-4Z',
  'child-tooth': 'M12 6c-2.4 0-4.4 1.3-4 4.3.2 2.1 1.3 3.2 1.6 5.8.2 1.6 1.6 2.1 2.1.5.4-1.3.8-1.6 1.1-1.6s.7.3 1.1 1.6c.5 1.6 1.9 1.1 2.1-.5.3-2.6 1.4-3.7 1.6-5.8.4-3-1.6-4.3-4-4.3h-1.6',
  calendar: 'M7 3v3M17 3v3M4 8h16M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm2 7h3v3H7v-3Z',
  'clipboard-check': 'M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1ZM6 6h12v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V6Zm3 8 2.2 2.2L15.5 12',
  search: 'M15.5 15.5 20 20M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm-1.5-6 1.2 1.2 2.3-2.4',
  'file-check': 'M8 3h5l4 4v13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm5 0v4h4M9 13l2 2 4-4.5',
  tool: 'M14.5 6.5a3 3 0 1 1 4.24 4.24l-7.5 7.5a2 2 0 0 1-2.83 0l-1.4-1.4a2 2 0 0 1 0-2.83l7.5-7.5ZM6 18l-2 2',
  receipt: 'M6 3h12v18l-2-1.4L14 21l-2-1.4L10 21l-2-1.4L6 21V3Zm2 5h8M8 11h8M8 14h5',
  check: 'M4 12.5l5 5L20 7',
  'arrow-right': 'M4 12h16M14 6l6 6-6 6',
  pin: 'M12 21s7-6.6 7-11.5A7 7 0 0 0 5 9.5C5 14.4 12 21 12 21Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  'whatsapp-check': 'M4 12.5l5 5L20 7',
}

export function Icon({ name, className, ...rest }: { name: IconKey } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={rest.width ?? 24}
      height={rest.height ?? 24}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      {...rest}
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
