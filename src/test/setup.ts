import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Nenhum teste de unidade fala com o Supabase real.
vi.mock('@/lib/supabase', async () => ({
  supabase: (await import('@/test/supabase-mock')).supabaseMock,
}))

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})
