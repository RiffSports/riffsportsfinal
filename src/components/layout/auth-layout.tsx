import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { IconButton } from '@/components/ui/icon-button'
import { copy } from '@/copy/pt-BR'
import { cn } from '@/lib/utils'

type AuthLayoutProps = {
  title?: ReactNode
  subtitle?: ReactNode
  /** Mostra a seta de voltar no topo (Figma "IC Menu"). Uma função substitui o "voltar" padrão. */
  back?: boolean | (() => void)
  children: ReactNode
  className?: string
}

// Casca das telas de entrada e cadastro: fundo petróleo, conteúdo alinhado à esquerda.
export function AuthLayout({ title, subtitle, back, children, className }: AuthLayoutProps) {
  const navigate = useNavigate()
  const onBack = typeof back === 'function' ? back : () => navigate(-1)
  return (
    <div className="min-h-dvh bg-brand">
      <div aria-hidden className="fixed inset-0 -z-10 bg-brand" />
      <div
        className={cn(
          'mx-auto flex min-h-dvh w-full max-w-app flex-col px-[55px] pt-[calc(env(safe-area-inset-top)+88px)] pb-[calc(env(safe-area-inset-bottom)+32px)]',
          back && 'pt-[calc(env(safe-area-inset-top)+46px)]',
          className,
        )}
      >
        {back ? (
          <IconButton aria-label={copy.actions.back} onClick={onBack} className="-ml-[39px]">
            <ArrowLeft strokeWidth={1.5} />
          </IconButton>
        ) : null}
        {title ? (
          <header className={cn('mb-8 flex flex-col gap-3', back && 'mt-0')}>
            <h1 className="text-2xl leading-[1.4] font-black">{title}</h1>
            {subtitle ? <div className="text-base leading-[1.4]">{subtitle}</div> : null}
          </header>
        ) : null}
        {children}
      </div>
    </div>
  )
}
