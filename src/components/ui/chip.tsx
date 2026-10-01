import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

// Figma: "01 - Dropdown Elements/03 - Item" (filtros "1 jogador", "Time", "Filas Iniciadas").
type ChipProps = ComponentProps<'button'> & { selected?: boolean }

export function Chip({ className, selected = false, type = 'button', ...props }: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      data-slot="chip"
      className={cn(
        'inline-flex min-h-7 items-center justify-center rounded-[6px] px-3 text-sm transition-colors',
        selected ? 'bg-selected font-bold text-selected-foreground' : 'bg-chip text-foreground',
        className,
      )}
      {...props}
    />
  )
}
