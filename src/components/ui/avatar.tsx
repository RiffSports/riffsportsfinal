import { cn } from '@/lib/utils'

type AvatarProps = {
  src?: string | null
  name: string
  /** Sem foto, mostra as iniciais (desligado quando há um ícone por cima). */
  showInitials?: boolean
  className?: string
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? (parts.at(-1)?.[0] ?? '') : ''
  return (first + last).toUpperCase()
}

export function Avatar({ src, name, showInitials = true, className }: AvatarProps) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-chip text-4xl font-bold text-foreground',
        className,
      )}
    >
      {src ? (
        <img src={src} alt={name} className="size-full object-cover" />
      ) : showInitials ? (
        <span role="img" aria-label={name}>
          {initials(name)}
        </span>
      ) : null}
    </div>
  )
}
