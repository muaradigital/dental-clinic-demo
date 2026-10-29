import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { useId } from 'react'
import { cn } from '@/lib/cn'

const fieldBaseClasses =
  'w-full rounded-input border-[1.5px] border-border bg-ivory-input px-3.5 py-3 text-sm text-ink placeholder:text-muted/70 transition-colors duration-200 focus:border-teal-bright focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-bright/15'

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string
  error?: string
  id?: string
}

export function TextField({ label, error, id, className, ...rest }: TextFieldProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  return (
    <div>
      <label htmlFor={fieldId} className="mb-1.5 block text-xs font-semibold text-muted">
        {label}
      </label>
      <input id={fieldId} className={cn(fieldBaseClasses, error && 'border-danger-text', className)} {...rest} />
      {error && <p className="mt-1 text-xs text-danger-text">{error}</p>}
    </div>
  )
}

export interface TextAreaFieldProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string
  error?: string
  id?: string
  showCounter?: boolean
  maxLength?: number
}

export function TextAreaField({
  label,
  error,
  id,
  className,
  showCounter,
  maxLength,
  value,
  ...rest
}: TextAreaFieldProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const length = typeof value === 'string' ? value.length : 0
  return (
    <div>
      <label htmlFor={fieldId} className="mb-1.5 block text-xs font-semibold text-muted">
        {label}
      </label>
      <textarea
        id={fieldId}
        className={cn(fieldBaseClasses, 'min-h-28 resize-y', error && 'border-danger-text', className)}
        maxLength={maxLength}
        value={value}
        {...rest}
      />
      <div className="mt-1 flex justify-between">
        {error ? <p className="text-xs text-danger-text">{error}</p> : <span />}
        {showCounter && maxLength && (
          <p className="text-xs text-muted">
            {length} / {maxLength}
          </p>
        )}
      </div>
    </div>
  )
}
