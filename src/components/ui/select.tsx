import { ChevronsUpDown } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

// Figma: dropdown "Acessibilidade" (mesmo visual do campo, com setas à direita).
export function Select({ className, children, ...props }: ComponentProps<'select'>) {
  return (
    <div className="relative">
      <select
        data-slot="select"
        className={cn(
          'h-11 w-full appearance-none rounded-2xl border border-border-input bg-input pr-12 pl-4 text-base text-foreground font-condensed aria-invalid:border-destructive',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronsUpDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-foreground"
      />
    </div>
  )
}
