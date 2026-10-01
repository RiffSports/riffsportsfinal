import { cloneElement, useId, type ReactElement, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ControlProps = { id?: string; 'aria-invalid'?: boolean; 'aria-describedby'?: string }

type FieldProps = {
  label?: ReactNode
  /** Esconde o rótulo visualmente (o campo usa o placeholder, como no Figma). */
  hideLabel?: boolean
  error?: string
  className?: string
  children: ReactElement<ControlProps>
}

export function Field({ label, hideLabel = false, error, className, children }: FieldProps) {
  const id = useId()
  const errorId = `${id}-erro`
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label ? (
        <label htmlFor={id} className={cn('text-base leading-[1.4]', hideLabel && 'sr-only')}>
          {label}
        </label>
      ) : null}
      {cloneElement(children, {
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': error ? errorId : undefined,
      })}
      {error ? (
        <p id={errorId} role="alert" className="px-4 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}
