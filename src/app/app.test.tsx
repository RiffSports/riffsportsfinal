import { screen } from '@testing-library/react'
import { copy } from '@/copy/pt-BR'
import { renderRoute } from '@/test/render'
import { fakeProfile, fakeSession } from '@/test/supabase-mock'

describe('rotas e proteções', () => {
  it('manda quem não entrou para a abertura', async () => {
    const { router } = renderRoute('/')
    expect(await screen.findByRole('link', { name: copy.welcome.signUp })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: copy.welcome.signIn })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/boas-vindas')
  })

  it('manda quem não concluiu o cadastro para o cadastro em passos', async () => {
    renderRoute('/', { session: fakeSession(), profile: fakeProfile({ onboarded_at: null }) })
    expect(
      await screen.findByRole('heading', { name: copy.onboarding.step1.title }),
    ).toBeInTheDocument()
    expect(screen.getByText(copy.onboarding.stepOf(1, 2))).toBeInTheDocument()
  })

  it('abre o app com as três abas para quem concluiu o cadastro', async () => {
    renderRoute('/', { session: fakeSession(), profile: fakeProfile() })
    expect(await screen.findByText(copy.empty.eventos)).toBeInTheDocument()
    const nav = screen.getByRole('navigation', { name: 'Principal' })
    expect(nav).toHaveTextContent('Eventos')
    expect(nav).toHaveTextContent('Jogar')
    expect(nav).toHaveTextContent('Perfil')
    expect(screen.getByRole('link', { name: 'Eventos' })).toHaveAttribute('aria-current', 'page')
  })

  it('tira quem já entrou das telas de login', async () => {
    const { router } = renderRoute('/entrar', { session: fakeSession(), profile: fakeProfile() })
    expect(await screen.findByText(copy.empty.eventos)).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/eventos')
  })

  it('mostra a página de não encontrado com a voz do Riff', async () => {
    renderRoute('/nao-existe')
    expect(await screen.findByText(copy.errors.notFound)).toBeInTheDocument()
  })
})
