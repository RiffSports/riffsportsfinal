import { Link } from 'react-router'
import { Logo } from '@/components/layout/logo'
import { buttonVariants } from '@/components/ui/button'
import { Divider } from '@/components/ui/divider'
import { copy } from '@/copy/pt-BR'

// Figma: MVP > "Log In e cadastro" > "Login" (tela de abertura).
export function WelcomePage() {
  return (
    <div className="min-h-dvh bg-brand">
      <div aria-hidden className="fixed inset-0 -z-10 bg-brand" />
      <main className="mx-auto flex min-h-dvh w-full max-w-app flex-col px-8 pt-[env(safe-area-inset-top)] pb-[calc(env(safe-area-inset-bottom)+65px)]">
        <div className="flex flex-1 flex-col items-center justify-center pb-24">
          <h1 className="sr-only">{copy.app.name}</h1>
          <Logo />
          <Divider className="mt-[55px] w-full" />
          <p className="mt-5 w-[184px] text-center text-2xl leading-[1.135] font-light">
            {copy.app.tagline}
          </p>
        </div>
        <div className="flex flex-col gap-3 px-[31px]">
          <Link to="/cadastro" className={buttonVariants({ size: 'block' })}>
            {copy.welcome.signUp}
          </Link>
          <Link to="/entrar" className={buttonVariants({ variant: 'outline', size: 'block' })}>
            {copy.welcome.signIn}
          </Link>
        </div>
      </main>
    </div>
  )
}
