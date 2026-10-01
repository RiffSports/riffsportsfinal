import { readEnv } from '@/lib/env'

describe('readEnv', () => {
  it('aceita configuração válida', () => {
    const env = readEnv({
      VITE_SUPABASE_URL: 'https://exemplo.supabase.co',
      VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_teste',
    })
    expect(env.VITE_SUPABASE_URL).toBe('https://exemplo.supabase.co')
  })

  it('explica o que falta quando a configuração está ausente', () => {
    expect(() => readEnv({})).toThrow(/\.env\.local/)
  })
})
