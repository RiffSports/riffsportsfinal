import { createBrowserRouter, Navigate, type RouteObject } from 'react-router'
import { GuestOnly, RequireAuth, RequireOnboarded } from '@/app/guards'
import { DesignPage } from '@/app/pages/design-page'
import { LegalPage } from '@/app/pages/legal-page'
import { NotFoundPage } from '@/app/pages/not-found-page'
import { PlaceholderPage } from '@/app/pages/placeholder-page'
import { AppShell } from '@/components/layout/app-shell'
import { copy } from '@/copy/pt-BR'
import { CheckEmailPage } from '@/features/conta/pages/check-email-page'
import { ForgotPasswordPage } from '@/features/conta/pages/forgot-password-page'
import { ResetPasswordPage } from '@/features/conta/pages/reset-password-page'
import { SignInPage } from '@/features/conta/pages/sign-in-page'
import { SignUpPage } from '@/features/conta/pages/sign-up-page'
import { WelcomePage } from '@/features/conta/pages/welcome-page'
import { EditProfilePage } from '@/features/perfil/pages/edit-profile-page'
import { OnboardingPage } from '@/features/perfil/pages/onboarding-page'
import { ProfilePage } from '@/features/perfil/pages/profile-page'
import { PublicProfilePage } from '@/features/perfil/pages/public-profile-page'

export const routes: RouteObject[] = [
  // Entrada: só para quem ainda não entrou.
  {
    element: <GuestOnly />,
    children: [
      { path: 'boas-vindas', element: <WelcomePage /> },
      { path: 'entrar', element: <SignInPage /> },
      { path: 'cadastro', element: <SignUpPage /> },
      { path: 'cadastro/confirme-email', element: <CheckEmailPage /> },
      { path: 'esqueci-senha', element: <ForgotPasswordPage /> },
    ],
  },
  { path: 'nova-senha', element: <ResetPasswordPage /> },
  { path: 'termos', element: <LegalPage kind="termos" /> },
  { path: 'privacidade', element: <LegalPage kind="privacidade" /> },

  // App: precisa de sessão e de cadastro concluído.
  {
    element: <RequireAuth />,
    children: [
      { path: 'cadastro/perfil', element: <OnboardingPage /> },
      {
        element: <RequireOnboarded />,
        children: [
          {
            element: <AppShell />,
            children: [
              { index: true, element: <Navigate to="/eventos" replace /> },
              { path: 'eventos', element: <PlaceholderPage title={copy.empty.eventos} /> },
              { path: 'jogar', element: <PlaceholderPage title={copy.empty.jogar} /> },
              { path: 'perfil', element: <ProfilePage /> },
              { path: 'jogadores/:id', element: <PublicProfilePage /> },
            ],
          },
          { path: 'perfil/editar', element: <EditProfilePage /> },
        ],
      },
    ],
  },

  // Vitrine do design system (não é tela de produto).
  { element: <AppShell />, children: [{ path: 'design', element: <DesignPage /> }] },
  { path: '*', element: <NotFoundPage /> },
]

export function createRouter() {
  return createBrowserRouter(routes)
}
