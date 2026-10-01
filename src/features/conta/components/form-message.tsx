import { cn } from '@/lib/utils'

type FormMessageProps = { children?: string | null; tone?: 'error' | 'success'; className?: string }

// Aviso do formulário inteiro (erro do servidor ou confirmação).
export function FormMessage({ children, tone = 'error', className }: FormMessageProps) {
  if (!children) return null
  return (
    <p
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'rounded-lg px-4 py-3 text-sm leading-[1.4]',
        tone === 'error' ? 'bg-destructive/15 text-foreground' : 'bg-primary/15 text-foreground',
        className,
      )}
    >
      {children}
    </p>
  )
}
