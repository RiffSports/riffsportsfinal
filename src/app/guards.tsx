import { Navigate, Outlet, useLocation } from 'react-router'
import { Splash } from '@/components/layout/splash'
import { useSessionStore } from '@/features/conta/session-store'
import { useMyProfile } from '@/features/perfil/hooks'

/** Só passa quem tem sessão. Os outros vão para a abertura. */
export function RequireAuth() {
  const location = useLocation()
  const { status, session, recovering } = useSessionStore()
  if (status === 'loading') return <Splash />
  if (!session) return <Navigate to="/boas-vindas" replace state={{ from: location.pathname }} />
  if (recovering) return <Navigate to="/nova-senha" replace />
  return <Outlet />
}

/** Só passa quem concluiu o cadastro (com data de nascimento, regra do banco). */
export function RequireOnboarded() {
  const { data: profile, isPending, isError } = useMyProfile()
  if (isPending) return <Splash />
  if (isError || !profile?.onboarded_at) return <Navigate to="/cadastro/perfil" replace />
  return <Outlet />
}

/** Telas de entrada: quem já entrou segue direto para o app. */
export function GuestOnly() {
  const { status, session } = useSessionStore()
  if (status === 'loading') return <Splash />
  if (session) return <Navigate to="/" replace />
  return <Outlet />
}
