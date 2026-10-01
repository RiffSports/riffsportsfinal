import { readFileSync } from 'node:fs'
import type { Page } from '@playwright/test'

export const USER_ID = '11111111-1111-1111-1111-111111111111'

/** URL do Supabase usada no build (CI: variável de ambiente; local: .env.local). */
function supabaseUrl() {
  if (process.env.VITE_SUPABASE_URL) return process.env.VITE_SUPABASE_URL
  try {
    const env = readFileSync('.env.local', 'utf8')
    return /^VITE_SUPABASE_URL=(.+)$/m.exec(env)?.[1]?.trim() ?? ''
  } catch {
    return ''
  }
}

/** Abre uma sessão falsa (nada vai ao Supabase real) e intercepta a tabela de perfis. */
export async function fakeLogin(page: Page, profile: Record<string, unknown>) {
  const ref = new URL(supabaseUrl()).hostname.split('.')[0]
  const session = {
    access_token: 'e2e-token',
    refresh_token: 'e2e-refresh',
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    user: { id: USER_ID, email: 'ana@riff.test', aud: 'authenticated', role: 'authenticated' },
  }
  await page.addInitScript(
    ([key, value]) => window.localStorage.setItem(key!, value!),
    [`sb-${ref}-auth-token`, JSON.stringify(session)],
  )

  let current = { ...profile }
  const patches: Record<string, unknown>[] = []
  await page.route('**/rest/v1/profiles**', async (route) => {
    if (route.request().method() === 'PATCH') {
      const patch = route.request().postDataJSON() as Record<string, unknown>
      patches.push(patch)
      current = { ...current, ...patch }
    }
    await route.fulfill({ json: current })
  })
  await page.route('**/auth/v1/**', (route) => route.fulfill({ json: {} }))
  return { patches }
}

export function baseProfile(overrides: Record<string, unknown> = {}) {
  return {
    id: USER_ID,
    full_name: 'Jogador',
    display_name: null,
    avatar_url: null,
    bio: null,
    birth_date: null,
    gender: null,
    accessibility_needs: null,
    instagram: null,
    verification_level: 0,
    presence_score: null,
    onboarded_at: null,
    created_at: '2026-01-15T12:00:00Z',
    updated_at: '2026-01-15T12:00:00Z',
    ...overrides,
  }
}
