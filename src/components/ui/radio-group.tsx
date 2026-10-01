import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

type Option = { value: string; label: string }

type RadioGroupProps = {
  name: string
  legend: string
  options: readonly Option[]
  error?: string
  className?: string
} & Omit<ComponentProps<'input'>, 'type' | 'name' | 'className'>

// Figma: lista "Indique seu gênero" (círculos brancos; o selecionado ganha o miolo amarelo).
export function RadioGroup({
  name,
  legend,
  options,
  error,
  className,
  ...inputProps
}: RadioGroupProps) {
  return (
    <fieldset className={cn('flex flex-col', className)}>
      <legend className="mb-2 text-base leading-[1.4]">{legend}</legend>
      {options.map((option) => (
        <label
          key={option.value}
          className="flex min-h-11 cursor-pointer items-center gap-4 text-sm"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            className="peer sr-only"
            {...inputProps}
          />
          <span
            aria-hidden
            className="size-[18px] shrink-0 rounded-full border-2 border-foreground bg-foreground transition-[border-width,background-color] peer-checked:border-[5px] peer-checked:bg-primary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring"
          />
          {option.label}
        </label>
      ))}
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </fieldset>
  )
}
