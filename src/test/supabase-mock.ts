import type { Session } from '@supabase/supabase-js'
import { vi } from 'vitest'

type Result = { data: unknown; error: unknown }

/** Encadeamento falso do supabase-js: qualquer método devolve a si mesmo; `await` devolve o resultado. */
export function queryChain(result: Result) {
  const chain: Record<string, unknown> = {}
  for (const method of ['select', 'eq', 'update', 'insert', 'single', 'maybeSingle', 'order']) {
    chain[method] = vi.fn(() => chain)
  }
  chain.then = (resolve: (value: Result) => unknown, reject: (reason: unknown) => unknown) =>
    Promise.resolve(result).then(resolve, reject)
  return chain
}

export const supabaseMock = {
  auth: {
    getSession: vi.fn(async () => ({ data: { session: null }, error: null })),
    onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(async () => ({ error: null })),
    resetPasswordForEmail: vi.fn(),
    updateUser: vi.fn(),
  },
  from: vi.fn<(table: string) => ReturnType<typeof queryChain>>(() =>
    queryChain({ data: null, error: null }),
  ),
  storage: { from: vi.fn() },
}

export function fakeSession(userId = '11111111-1111-1111-1111-111111111111') {
  return { user: { id: userId, email: 'ana@riff.test' }, access_token: 't' } as unknown as Session
}

export function fakeProfile(overrides: Record<string, unknown> = {}) {
  return {
    id: '11111111-1111-1111-1111-111111111111',
    full_name: 'Ana Souza',
    display_name: null,
    avatar_url: null,
    bio: null,
    birth_date: '1990-05-01',
    gender: 'feminino',
    accessibility_needs: 'nenhuma',
    instagram: null,
    verification_level: 0,
    presence_score: null,
    onboarded_at: '2026-10-01T12:00:00Z',
    created_at: '2026-01-15T12:00:00Z',
    updated_at: '2026-10-01T12:00:00Z',
    ...overrides,
  }
}
