import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { AuthLayout } from '@/components/layout/auth-layout'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { copy } from '@/copy/pt-BR'
import { signUp } from '@/features/conta/api'
import { authErrorMessage } from '@/features/conta/auth-errors'
import { FormMessage } from '@/features/conta/components/form-message'
import { signUpSchema, type SignUpInput } from '@/features/conta/schemas'

const t = copy.auth

// Figma: MVP > "Log In e cadastro" > "Cadastro 7".
// Logins sociais e celular ficam para a Sprint 10.
export function SignUpPage() {
  const navigate = useNavigate()
  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
  })
  const mutation = useMutation({
    mutationFn: signUp,
    onSuccess: ({ needsConfirmation }, input) => {
      if (needsConfirmation) {
        navigate('/cadastro/confirme-email', { state: { email: input.email } })
      } else {
        navigate('/cadastro/perfil', { replace: true })
      }
    },
  })
  const { errors } = form.formState

  return (
    <AuthLayout title={t.signUp.title} subtitle={t.signUp.subtitle} className="px-[71px]">
      <form
        noValidate
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        className="flex flex-col"
      >
        <div className="flex flex-col gap-[33px]">
          <Field label={t.fields.name} hideLabel error={errors.fullName?.message}>
            <Input placeholder={t.fields.name} autoComplete="name" {...form.register('fullName')} />
          </Field>
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
        </div>

        <FormMessage className="mt-6">
          {mutation.isError ? authErrorMessage(mutation.error) : null}
        </FormMessage>

        <p className="-mx-2 mt-10 text-center text-xs leading-[1.4]">
          {t.signUp.consentPrefix}
          <Link to="/termos" className="underline">
            {t.signUp.terms}
          </Link>
          {t.signUp.consentMiddle}
          <Link to="/privacidade" className="underline">
            {t.signUp.privacy}
          </Link>
          .
        </p>
        <Button type="submit" size="block" className="-mx-2 mt-3" disabled={mutation.isPending}>
          {t.signUp.submit}
        </Button>
        <Link to="/entrar" className="mt-8 self-center py-2 text-base font-medium">
          {t.signUp.hasAccount}
        </Link>
      </form>
    </AuthLayout>
  )
}
