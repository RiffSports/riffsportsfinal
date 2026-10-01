import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { AuthLayout } from '@/components/layout/auth-layout'
import { Splash } from '@/components/layout/splash'
import { Button, buttonVariants } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { PasswordInput } from '@/components/ui/password-input'
import { copy } from '@/copy/pt-BR'
import { updatePassword } from '@/features/conta/api'
import { authErrorMessage } from '@/features/conta/auth-errors'
import { FormMessage } from '@/features/conta/components/form-message'
import { resetPasswordSchema, type ResetPasswordInput } from '@/features/conta/schemas'
import { useSessionStore } from '@/features/conta/session-store'

const t = copy.auth

// Destino do link de "esqueci a senha". O Supabase abre a sessão a partir do link.
export function ResetPasswordPage() {
  const navigate = useNavigate()
  const status = useSessionStore((state) => state.status)
  const session = useSessionStore((state) => state.session)
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })
  const mutation = useMutation({
    mutationFn: ({ password }: ResetPasswordInput) => updatePassword(password),
    onSuccess: () => {
      useSessionStore.setState({ recovering: false })
      navigate('/', { replace: true })
    },
  })
  const { errors } = form.formState

  if (status === 'loading') return <Splash />

  if (!session) {
    return (
      <AuthLayout title={t.reset.expired}>
        <Link to="/esqueci-senha" className={buttonVariants({ size: 'block' })}>
          {t.reset.requestNew}
        </Link>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title={t.reset.title} subtitle={t.reset.subtitle}>
      <form
        noValidate
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        className="flex flex-col gap-[31px]"
      >
        <Field label={t.fields.newPassword} hideLabel error={errors.password?.message}>
          <PasswordInput
            placeholder={t.fields.newPassword}
            autoComplete="new-password"
            {...form.register('password')}
          />
        </Field>
        <Field label={t.fields.confirmPassword} hideLabel error={errors.confirmPassword?.message}>
          <PasswordInput
            placeholder={t.fields.confirmPassword}
            autoComplete="new-password"
            {...form.register('confirmPassword')}
          />
        </Field>
        <FormMessage>{mutation.isError ? authErrorMessage(mutation.error) : null}</FormMessage>
        <Button type="submit" size="block" disabled={mutation.isPending}>
          {t.reset.submit}
        </Button>
      </form>
    </AuthLayout>
  )
}
