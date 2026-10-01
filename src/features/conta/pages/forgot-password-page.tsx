import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { AuthLayout } from '@/components/layout/auth-layout'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { copy } from '@/copy/pt-BR'
import { sendPasswordReset } from '@/features/conta/api'
import { authErrorMessage } from '@/features/conta/auth-errors'
import { FormMessage } from '@/features/conta/components/form-message'
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/features/conta/schemas'

const t = copy.auth

export function ForgotPasswordPage() {
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })
  const mutation = useMutation({ mutationFn: sendPasswordReset })

  return (
    <AuthLayout back title={t.forgot.title} subtitle={t.forgot.subtitle}>
      {mutation.isSuccess ? (
        <div className="flex flex-col gap-6">
          <FormMessage tone="success">{t.forgot.sent}</FormMessage>
          <Link to="/entrar" className="self-start py-2 text-sm underline">
            {t.forgot.backToLogin}
          </Link>
        </div>
      ) : (
        <form
          noValidate
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          className="flex flex-col gap-6"
        >
          <Field label={t.fields.email} hideLabel error={form.formState.errors.email?.message}>
            <Input
              type="email"
              inputMode="email"
              placeholder={t.fields.email}
              autoComplete="email"
              {...form.register('email')}
            />
          </Field>
          <FormMessage>{mutation.isError ? authErrorMessage(mutation.error) : null}</FormMessage>
          <Button type="submit" size="block" disabled={mutation.isPending}>
            {t.forgot.submit}
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}
