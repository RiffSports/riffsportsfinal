import { supabase } from '@/lib/supabase'
import type { ForgotPasswordInput, SignInInput, SignUpInput } from '@/features/conta/schemas'

function appUrl(path: string) {
  return new URL(path, window.location.origin).toString()
}

/**
 * Cria a conta. O perfil nasce no banco (gatilho handle_new_user) com o nome informado.
 * Com a confirmação de e-mail ligada, a sessão só existe depois do clique no link.
 */
export async function signUp({ fullName, email, password }: SignUpInput) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: appUrl('/cadastro/perfil'),
    },
  })
  if (error) throw error
  return { needsConfirmation: data.session === null }
}

export async function signIn({ email, password }: SignInInput) {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function sendPasswordReset({ email }: ForgotPasswordInput) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: appUrl('/nova-senha'),
  })
  if (error) throw error
}

export async function updatePassword(password: string) {
  const { error } = await supabase.auth.updateUser({ password })
  if (error) throw error
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
