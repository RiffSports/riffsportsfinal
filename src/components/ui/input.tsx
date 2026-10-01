import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

// Figma: "01 - Input" (fundo #3D4344, borda #969999, raio 24, Roboto Condensed 16).
export function Input({ className, type = 'text', ...props }: ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'h-11 w-full rounded-2xl border border-border-input bg-input px-4 text-base text-foreground font-condensed placeholder:text-foreground/80 disabled:opacity-50 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  )
}
