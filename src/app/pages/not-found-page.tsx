import { Link } from 'react-router'
import { buttonVariants } from '@/components/ui/button'
import { copy } from '@/copy/pt-BR'

export function NotFoundPage() {
  return (
    <section className="flex min-h-dvh flex-col items-center gap-6 bg-background px-6 py-16 text-center">
      <h1 className="text-lg font-bold">{copy.errors.notFound}</h1>
      <Link to="/" className={buttonVariants()}>
        {copy.actions.back}
      </Link>
    </section>
  )
}
