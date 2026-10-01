import { ArrowLeft } from 'lucide-react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { IconButton } from '@/components/ui/icon-button'
import { copy } from '@/copy/pt-BR'
import { useUserId } from '@/features/conta/session-store'
import { ProfileCover } from '@/features/perfil/components/profile-cover'
import { ProfileDetails } from '@/features/perfil/components/profile-details'
import { ProfileSkeleton } from '@/features/perfil/components/profile-skeleton'
import { usePublicProfile } from '@/features/perfil/hooks'

// Figma: MVP > "Perfil" > "perfil terceiro". Lê só a visão pública (sem dados sensíveis).
export function PublicProfilePage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const userId = useUserId()
  const { data: profile, isPending } = usePublicProfile(id)

  if (id === userId) return <Navigate to="/perfil" replace />

  const name = profile ? profile.display_name || profile.full_name || '' : ''
  return (
    <article>
      <header className="flex h-[54px] items-center gap-2 px-2">
        <IconButton aria-label={copy.actions.back} onClick={() => navigate(-1)}>
          <ArrowLeft strokeWidth={1.5} />
        </IconButton>
        <h1 className="truncate text-lg leading-[1.4] font-bold">{name}</h1>
      </header>
      {isPending ? (
        <ProfileSkeleton />
      ) : !profile ? (
        <p className="px-5 py-10 text-center text-sm">{copy.profile.notFound}</p>
      ) : (
        <>
          <ProfileCover name={name} avatarUrl={profile.avatar_url} />
          <div className="px-5 pt-2">
            <ProfileDetails
              createdAt={profile.created_at}
              eventsJoined={0}
              bio={profile.bio}
              instagram={profile.instagram}
            />
          </div>
        </>
      )}
    </article>
  )
}
