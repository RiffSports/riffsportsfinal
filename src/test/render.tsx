import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { Session } from '@supabase/supabase-js'
import { render } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { routes } from '@/app/router'
import { useSessionStore } from '@/features/conta/session-store'
import { queryChain, supabaseMock } from '@/test/supabase-mock'

type RenderRouteOptions = {
  session?: Session | null
  /** Perfil devolvido por `profiles`/`public_profiles`. */
  profile?: Record<string, unknown> | null
}

export function renderRoute(
  path: string,
  { session = null, profile = null }: RenderRouteOptions = {},
) {
  useSessionStore.setState({ session, status: 'ready', recovering: false })
  supabaseMock.from.mockImplementation(() => queryChain({ data: profile, error: null }))

  const router = createMemoryRouter(routes, { initialEntries: [path] })
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  const view = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
  return { ...view, router }
}
