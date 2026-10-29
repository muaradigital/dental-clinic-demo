import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'outline-light' | 'whatsapp' | 'danger-text'
export type ButtonSize = 'sm' | 'md' | 'lg'

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-teal text-white hover:shadow-lift disabled:bg-sand-disabled disabled:text-muted disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none',
  secondary: 'bg-transparent text-ink border-[1.5px] border-ink hover:bg-ink hover:text-white',
  'outline-light': 'bg-white text-ink border-[1.5px] border-border hover:border-teal',
  whatsapp: 'bg-whatsapp text-white hover:shadow-lift',
  'danger-text': 'bg-transparent text-danger-text underline-offset-2 hover:underline',
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-[22px] py-3 text-sm',
  lg: 'px-6 py-[13px] text-base',
}

const baseClasses =
  'group relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-pill font-semibold font-sans transition-[transform,box-shadow,background-color] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal'

interface BaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  children: ReactNode
  className?: string
}

function ButtonContent({
  icon,
  iconPosition,
  children,
  showShine,
}: {
  icon?: ReactNode
  iconPosition: 'left' | 'right'
  children: ReactNode
  showShine: boolean
}) {
  return (
    <>
      {icon && iconPosition === 'left' && (
        <span className="transition-transform duration-300 group-hover:-translate-x-0.5">{icon}</span>
      )}
      <span className="relative z-10">{children}</span>
      {icon && iconPosition === 'right' && (
        <span className="transition-transform duration-300 group-hover:translate-x-0.5">{icon}</span>
      )}
      {showShine && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-[120%]"
        />
      )}
    </>
  )
}

export type ButtonAsButtonProps = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    to?: undefined
    href?: undefined
  }

export type ButtonAsLinkProps = BaseProps &
  Omit<LinkProps, keyof BaseProps | 'to'> & {
    to: LinkProps['to']
    href?: undefined
  }

export type ButtonAsAnchorProps = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps | 'href'> & {
    href: string
    to?: undefined
  }

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps | ButtonAsAnchorProps

export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    icon,
    iconPosition = 'right',
    fullWidth,
    children,
    className,
    to,
    href,
    ...rest
  } = props

  const classes = cn(baseClasses, VARIANT_CLASSES[variant], SIZE_CLASSES[size], fullWidth && 'w-full', className)
  const showShine = variant !== 'danger-text'

  if (to !== undefined) {
    return (
      <Link to={to} className={classes} {...(rest as Omit<LinkProps, 'to' | 'className' | 'children'>)}>
        <ButtonContent icon={icon} iconPosition={iconPosition} showShine={showShine}>
          {children}
        </ButtonContent>
      </Link>
    )
  }

  if (href !== undefined) {
    return (
      <a href={href} className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        <ButtonContent icon={icon} iconPosition={iconPosition} showShine={showShine}>
          {children}
        </ButtonContent>
      </a>
    )
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      <ButtonContent icon={icon} iconPosition={iconPosition} showShine={showShine}>
        {children}
      </ButtonContent>
    </button>
  )
}
