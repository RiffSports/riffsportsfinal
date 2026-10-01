import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

// Figma: "01 - Primary/01 - Default" (pill amarelo, Roboto Bold 14).
// Desativado: "States/Global/Disable" (#969999 com texto #425155).
// Altura mínima de 44px para respeitar o alvo de toque.
const buttonVariants = cva(
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-bold whitespace-nowrap transition-[transform,background-color,opacity] active:scale-[0.98] disabled:pointer-events-none disabled:bg-disabled disabled:text-disabled-foreground disabled:shadow-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground shadow-button hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
        outline: 'border border-foreground bg-transparent text-foreground hover:bg-foreground/5',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        ghost: 'bg-transparent text-foreground hover:bg-foreground/5',
      },
      size: {
        default: 'w-auto',
        block: 'w-full',
        icon: 'size-11 px-0',
      },
    },
    defaultVariants: { variant: 'primary', size: 'default' },
  },
)

type ButtonProps = ComponentProps<'button'> & VariantProps<typeof buttonVariants>

export function Button({ className, variant, size, type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { buttonVariants }
