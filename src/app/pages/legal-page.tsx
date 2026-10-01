import { AuthLayout } from '@/components/layout/auth-layout'
import { copy } from '@/copy/pt-BR'

// Texto jurídico definitivo entra antes da abertura ao público (ver docs/PLAN.md, LGPD).
export function LegalPage({ kind }: { kind: 'termos' | 'privacidade' }) {
  const title = kind === 'termos' ? copy.legal.termsTitle : copy.legal.privacyTitle
  return (
    <AuthLayout back title={title}>
      <p className="text-sm leading-[1.4] text-muted-foreground">{copy.legal.draft}</p>
    </AuthLayout>
  )
}
