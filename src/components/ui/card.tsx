import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

// Figma: "Card / Product" (fundo #2B2F30, raio 20, sombra 0 4 6 / 20%).
export function Card({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn('rounded-xl bg-card p-3 text-card-foreground shadow-card', className)}
      {...props}
    />
  )
}
