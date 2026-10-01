import { Pencil } from 'lucide-react'
import { Link } from 'react-router'
import { Divider } from '@/components/ui/divider'
import { copy } from '@/copy/pt-BR'
import { ProfileCover } from '@/features/perfil/components/profile-cover'
import { ProfileDetails } from '@/features/perfil/components/profile-details'
import { ProfileSkeleton } from '@/features/perfil/components/profile-skeleton'
import { useMyProfile } from '@/features/perfil/hooks'

// Figma: MVP > "Perfil" > "perfil usuario".
export function ProfilePage() {
  const { data: profile, isPending, isError, refetch } = useMyProfile()

  if (isPending) return <ProfileSkeleton />
  if (isError || !profile) {
    return (
      <p className="px-5 py-10 text-center text-sm">
        {copy.errors.generic}{' '}
        <button type="button" className="underline" onClick={() => void refetch()}>
          {copy.actions.retry}
        </button>
      </p>
    )
  }

  const name = profile.display_name || profile.full_name
  return (
    <article>
      <ProfileCover name={name} avatarUrl={profile.avatar_url} />
      <div className="px-5">
        <div className="flex items-center justify-between gap-3 pt-3 pb-2">
          <h1 className="text-lg leading-[1.4] font-bold">{name}</h1>
          <Link
            to="/perfil/editar"
            aria-label={copy.profile.edit}
            className="flex size-11 items-center justify-center rounded-2xl text-foreground hover:bg-foreground/5"
          >
            <Pencil className="size-4" strokeWidth={1.5} />
          </Link>
        </div>
        <Divider />
        <ProfileDetails
          createdAt={profile.created_at}
          eventsJoined={0}
          bio={profile.bio}
          instagram={profile.instagram}
          emptyBio={copy.profile.noBio}
        />
      </div>
    </article>
  )
}
