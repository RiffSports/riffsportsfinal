import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'
import { readEnv } from '@/lib/env'

const env = readEnv()

/**
 * Cliente único do Supabase no app.
 * Só usa a chave publicável: regras de acesso vivem no banco (RLS).
 * Chaves secretas nunca entram no front; ficam nas Edge Functions.
 */
export const supabase = createClient<Database>(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_PUBLISHABLE_KEY,
)
