import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router'
import { AuthLayout } from '@/components/layout/auth-layout'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { copy } from '@/copy/pt-BR'
import { signIn } from '@/features/conta/api'
import { authErrorMessage } from '@/features/conta/auth-errors'
import { FormMessage } from '@/features/conta/components/form-message'
import { signInSchema, type SignInInput } from '@/features/conta/schemas'

const t = copy.auth

// Figma: MVP > "Log In e cadastro" > "Login" (Bem-vindo de volta).
// Logins sociais ficam para a Sprint 10.
export function SignInPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'
  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  })
  const mutation = useMutation({
    mutationFn: signIn,
    onSuccess: () => navigate(from, { replace: true }),
  })
  const { errors } = form.formState

  return (
    <AuthLayout title={t.signIn.title} subtitle={t.signIn.subtitle} className="px-[58px]">
      <form
        noValidate
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        className="flex flex-col"
      >
        <div className="flex flex-col gap-[31px]">
          <Field label={t.fields.email} hideLabel error={errors.email?.message}>
            <Input
              type="email"
              inputMode="email"
              placeholder={t.fields.email}
              autoComplete="email"
              {...form.register('email')}
            />
          </Field>
          <Field label={t.fields.password} hideLabel error={errors.password?.message}>
            <PasswordInput
              placeholder={t.fields.password}
              autoComplete="current-password"
              {...form.register('password')}
            />
          </Field>
        </div>
        <Link to="/esqueci-senha" className="mt-5 self-start py-2 text-sm">
          {t.signIn.forgot}
        </Link>

        <FormMessage className="mt-4">
          {mutation.isError ? authErrorMessage(mutation.error) : null}
        </FormMessage>

        <Button type="submit" size="block" className="mt-4" disabled={mutation.isPending}>
          {t.signIn.submit}
        </Button>
        <Link to="/cadastro" className="mt-16 self-center py-2 text-base font-medium">
          {t.signIn.noAccount}
        </Link>
      </form>
    </AuthLayout>
  )
}
