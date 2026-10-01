import type { Database } from '@/lib/database.types'
import { supabase } from '@/lib/supabase'

export type MyProfile = Database['public']['Tables']['profiles']['Row']
export type PublicProfile = Database['public']['Views']['public_profiles']['Row']

/** Só as colunas que o dono pode editar (as outras são negadas pelo banco). */
export type ProfilePatch = Partial<
  Pick<
    MyProfile,
    | 'full_name'
    | 'display_name'
    | 'avatar_url'
    | 'bio'
    | 'birth_date'
    | 'gender'
    | 'accessibility_needs'
    | 'instagram'
    | 'onboarded_at'
  >
>

export async function fetchMyProfile(userId: string) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
  if (error) throw error
  return data
}

export async function updateMyProfile(userId: string, patch: ProfilePatch) {
  const { data, error } = await supabase
    .from('profiles')
    .update(patch)
    .eq('id', userId)
    .select('*')
    .single()
  if (error) throw error
  return data
}

export async function fetchPublicProfile(id: string) {
  const { data, error } = await supabase
    .from('public_profiles')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data
}

const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

/** Envia a foto para avatars/{userId}/... e devolve a URL pública. */
export async function uploadAvatar(userId: string, file: File) {
  const path = `${userId}/${crypto.randomUUID()}.${EXTENSIONS[file.type] ?? 'jpg'}`
  const { error } = await supabase.storage
    .from('avatars')
    .upload(path, file, { contentType: file.type, cacheControl: '31536000' })
  if (error) throw error
  return supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl
}
