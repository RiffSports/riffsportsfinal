import { createBrowserRouter, Navigate } from 'react-router'
import { AppShell } from '@/components/layout/app-shell'
import { DesignPage } from '@/app/pages/design-page'
import { NotFoundPage } from '@/app/pages/not-found-page'
import { PlaceholderPage } from '@/app/pages/placeholder-page'
import { copy } from '@/copy/pt-BR'

export const routes = [
  {
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/eventos" replace /> },
      { path: 'eventos', element: <PlaceholderPage title={copy.empty.eventos} /> },
      { path: 'jogar', element: <PlaceholderPage title={copy.empty.jogar} /> },
      { path: 'perfil', element: <PlaceholderPage title={copy.empty.perfil} /> },
      { path: 'design', element: <DesignPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]

export function createRouter() {
  return createBrowserRouter(routes)
}
