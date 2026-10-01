import { z } from 'zod'

const envSchema = z.object({
  VITE_SUPABASE_URL: z.url({ error: 'VITE_SUPABASE_URL ausente ou inválida em .env.local' }),
  VITE_SUPABASE_PUBLISHABLE_KEY: z
    .string({ error: 'VITE_SUPABASE_PUBLISHABLE_KEY ausente em .env.local' })
    .min(1, 'VITE_SUPABASE_PUBLISHABLE_KEY ausente em .env.local'),
})

export type Env = z.infer<typeof envSchema>

export function readEnv(source: Record<string, unknown> = import.meta.env): Env {
  const parsed = envSchema.safeParse(source)
  if (!parsed.success) {
    const messages = parsed.error.issues.map((issue) => issue.message).join('\n')
    throw new Error(`Configuração inválida. Copie .env.example para .env.local.\n${messages}`)
  }
  return parsed.data
}
