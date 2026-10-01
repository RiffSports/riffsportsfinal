import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { copy } from '@/copy/pt-BR'
import { authErrorMessage } from '@/features/conta/auth-errors'
import { signUpSchema } from '@/features/conta/schemas'
import { renderRoute } from '@/test/render'
import { supabaseMock } from '@/test/supabase-mock'

describe('login', () => {
  it('valida antes de chamar o servidor', async () => {
    const user = userEvent.setup()
    renderRoute('/entrar')
    await user.type(await screen.findByLabelText(copy.auth.fields.email), 'ana@')
    await user.click(screen.getByRole('button', { name: copy.auth.signIn.submit }))
    expect(await screen.findByText(copy.auth.validation.emailInvalid)).toBeInTheDocument()
    expect(screen.getByText(copy.auth.validation.passwordRequired)).toBeInTheDocument()
    expect(supabaseMock.auth.signInWithPassword).not.toHaveBeenCalled()
  })

  it('entra com e-mail normalizado e mostra erro amigável', async () => {
    supabaseMock.auth.signInWithPassword.mockResolvedValue({
      data: {},
      error: { code: 'invalid_credentials', message: 'Invalid login credentials', status: 400 },
    })
    const user = userEvent.setup()
    renderRoute('/entrar')
    await user.type(await screen.findByLabelText(copy.auth.fields.email), ' Ana@Riff.test ')
    await user.type(screen.getByLabelText(copy.auth.fields.password), 'senha123')
    await user.click(screen.getByRole('button', { name: copy.auth.signIn.submit }))

    await waitFor(() =>
      expect(supabaseMock.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'ana@riff.test',
        password: 'senha123',
      }),
    )
    expect(await screen.findByText(copy.auth.errors.invalidCredentials)).toBeInTheDocument()
  })

  it('mostra e esconde a senha', async () => {
    const user = userEvent.setup()
    renderRoute('/entrar')
    const input = await screen.findByLabelText(copy.auth.fields.password)
    expect(input).toHaveAttribute('type', 'password')
    await user.click(screen.getByRole('button', { name: copy.auth.fields.showPassword }))
    expect(input).toHaveAttribute('type', 'text')
  })
})

describe('cadastro', () => {
  it('cria a conta com o nome e leva para a confirmação de e-mail', async () => {
    supabaseMock.auth.signUp.mockResolvedValue({ data: { user: {}, session: null }, error: null })
    const user = userEvent.setup()
    const { router } = renderRoute('/cadastro')
    await user.type(await screen.findByLabelText(copy.auth.fields.name), 'Ana Souza')
    await user.type(screen.getByLabelText(copy.auth.fields.email), 'ana@riff.test')
    await user.type(screen.getByLabelText(copy.auth.fields.password), 'senha123')
    await user.type(screen.getByLabelText(copy.auth.fields.confirmPassword), 'senha123')
    await user.click(screen.getByRole('button', { name: copy.auth.signUp.submit }))

    expect(await screen.findByText(copy.auth.checkEmail.title)).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/cadastro/confirme-email')
    expect(supabaseMock.auth.signUp).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'ana@riff.test',
        options: expect.objectContaining({ data: { full_name: 'Ana Souza' } }),
      }),
    )
  })

  it('exige senhas iguais, com letras e números', () => {
    const base = { fullName: 'Ana', email: 'ana@riff.test' }
    expect(
      signUpSchema.safeParse({ ...base, password: 'senha123', confirmPassword: 'senha124' })
        .success,
    ).toBe(false)
    expect(
      signUpSchema.safeParse({
        ...base,
        password: 'somenteletras',
        confirmPassword: 'somenteletras',
      }).success,
    ).toBe(false)
    expect(
      signUpSchema.safeParse({ ...base, password: 'senha123', confirmPassword: 'senha123' })
        .success,
    ).toBe(true)
  })
})

describe('authErrorMessage', () => {
  it('traduz erros conhecidos e cai no genérico nos outros', () => {
    expect(authErrorMessage({ code: 'user_already_exists' })).toBe(copy.auth.errors.userExists)
    expect(authErrorMessage({ status: 429 })).toBe(copy.auth.errors.rateLimit)
    expect(authErrorMessage(new Error('boom'))).toBe(copy.errors.network)
  })
})
