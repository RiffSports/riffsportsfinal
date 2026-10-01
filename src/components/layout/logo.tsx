import logo from '@/assets/riff-logo-branco.png'
import { copy } from '@/copy/pt-BR'
import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return <img src={logo} alt={copy.app.name} className={cn('h-auto w-[216px]', className)} />
}
