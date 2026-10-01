import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useUserId } from '@/features/conta/session-store'
import {
  fetchMyProfile,
  fetchPublicProfile,
  updateMyProfile,
  uploadAvatar,
  type ProfilePatch,
} from '@/features/perfil/api'

export const profileKeys = {
  me: (userId: string | null) => ['profile', 'me', userId] as const,
  public: (id: string) => ['profile', 'public', id] as const,
}

export function useMyProfile() {
  const userId = useUserId()
  return useQuery({
    queryKey: profileKeys.me(userId),
    queryFn: () => fetchMyProfile(userId!),
    enabled: userId !== null,
  })
}

type SaveProfileInput = { patch: ProfilePatch; photo?: File }

/** Envia a foto (se houver) e salva o perfil numa única ação. */
export function useSaveMyProfile() {
  const userId = useUserId()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ patch, photo }: SaveProfileInput) => {
      if (!userId) throw new Error('Sem sessão')
      const avatar_url = photo ? await uploadAvatar(userId, photo) : undefined
      return updateMyProfile(userId, avatar_url ? { ...patch, avatar_url } : patch)
    },
    onSuccess: (profile) => {
      queryClient.setQueryData(profileKeys.me(profile.id), profile)
      void queryClient.invalidateQueries({ queryKey: profileKeys.public(profile.id) })
    },
  })
}

export function usePublicProfile(id: string) {
  return useQuery({
    queryKey: profileKeys.public(id),
    queryFn: () => fetchPublicProfile(id),
  })
}
