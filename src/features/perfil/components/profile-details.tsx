import type { ReactNode } from 'react'
import { Divider } from '@/components/ui/divider'
import { copy } from '@/copy/pt-BR'
import { formatMonthYear } from '@/lib/dates'

type ProfileDetailsProps = {
  createdAt: string | null
  eventsJoined: number
  bio: string | null
  instagram: string | null
  /** Texto quando não há bio (só aparece no próprio perfil). */
  emptyBio?: string
  footer?: ReactNode
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" />
    </svg>
  )
}

// Figma: linhas separadas por divisórias (membro desde, eventos, bio, Instagram).
export function ProfileDetails({
  createdAt,
  eventsJoined,
  bio,
  instagram,
  emptyBio,
  footer,
}: ProfileDetailsProps) {
  const text = bio || emptyBio
  return (
    <div className="flex flex-col text-sm leading-[1.4]">
      {createdAt ? (
        <>
          <p className="py-3">{copy.profile.memberSince(formatMonthYear(createdAt))}</p>
          <Divider />
        </>
      ) : null}
      <p className="py-3">{copy.profile.eventsJoined(eventsJoined)}</p>
      <Divider />
      {text ? (
        <>
          <p className={bio ? 'py-4 whitespace-pre-line' : 'py-4 text-muted-foreground'}>{text}</p>
          <Divider />
        </>
      ) : null}
      {instagram ? (
        <a
          href={`https://instagram.com/${instagram}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 items-center gap-2 self-start underline"
        >
          <InstagramIcon />
          {copy.profile.instagram}
        </a>
      ) : null}
      {footer}
    </div>
  )
}
