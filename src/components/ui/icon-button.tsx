import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

// Figma: "IC Menu" (botão de ícone redondo de 44px).
export function IconButton({ className, type = 'button', ...props }: ComponentProps<'button'>) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex size-11 shrink-0 items-center justify-center rounded-2xl text-foreground hover:bg-foreground/5 [&_svg]:size-5',
        className,
      )}
      {...props}
    />
  )
}
