import { MailCheck } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { AuthLayout } from '@/components/layout/auth-layout'
import { buttonVariants } from '@/components/ui/button'
import { copy } from '@/copy/pt-BR'

const t = copy.auth.checkEmail

export function CheckEmailPage() {
  const location = useLocation()
  const email = (location.state as { email?: string } | null)?.email

  return (
    <AuthLayout title={t.title} subtitle={t.body}>
      <div className="flex flex-col gap-6">
        <MailCheck aria-hidden className="size-16 text-primary" strokeWidth={1.25} />
        {email ? <p className="text-base font-bold break-all">{email}</p> : null}
        <p className="text-sm text-muted-foreground">{t.hint}</p>
        <Link to="/entrar" className={buttonVariants({ variant: 'outline', size: 'block' })}>
          {t.backToLogin}
        </Link>
      </div>
    </AuthLayout>
  )
}
