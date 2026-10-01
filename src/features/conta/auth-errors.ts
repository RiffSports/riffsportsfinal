import { copy } from '@/copy/pt-BR'

type AuthLikeError = { code?: string; message?: string; status?: number }

/** Traduz erros do Supabase Auth para a voz do Riff. */
export function authErrorMessage(error: unknown): string {
  const { code, message = '', status } = (error ?? {}) as AuthLikeError
  const e = copy.auth.errors

  switch (code) {
    case 'invalid_credentials':
      return e.invalidCredentials
    case 'email_not_confirmed':
      return e.emailNotConfirmed
    case 'user_already_exists':
    case 'email_exists':
      return e.userExists
    case 'weak_password':
      return e.weakPassword
    case 'over_email_send_rate_limit':
    case 'over_request_rate_limit':
      return e.rateLimit
  }

  if (status === 429) return e.rateLimit
  if (/invalid login credentials/i.test(message)) return e.invalidCredentials
  if (/email not confirmed/i.test(message)) return e.emailNotConfirmed
  return copy.errors.network
}
