import { Logo } from '@/components/layout/logo'
import { copy } from '@/copy/pt-BR'

// Tela de espera enquanto a sessão carrega.
export function Splash() {
  return (
    <div
      role="status"
      aria-label={copy.actions.loading}
      className="flex min-h-dvh items-center justify-center bg-brand"
    >
      <Logo className="w-[180px] motion-safe:animate-pulse" />
    </div>
  )
}
