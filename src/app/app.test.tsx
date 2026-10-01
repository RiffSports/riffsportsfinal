import { screen } from '@testing-library/react'
import { copy } from '@/copy/pt-BR'
import { renderRoute } from '@/test/render'

describe('esqueleto do app', () => {
  it('redireciona / para Eventos e mostra as três abas', async () => {
    renderRoute('/')
    expect(await screen.findByText(copy.empty.eventos)).toBeInTheDocument()
    const nav = screen.getByRole('navigation', { name: 'Principal' })
    expect(nav).toHaveTextContent('Eventos')
    expect(nav).toHaveTextContent('Jogar')
    expect(nav).toHaveTextContent('Perfil')
    expect(screen.getByRole('link', { name: 'Eventos' })).toHaveAttribute('aria-current', 'page')
  })

  it('mostra a página de não encontrado com a voz do Riff', async () => {
    renderRoute('/nao-existe')
    expect(await screen.findByText(copy.errors.notFound)).toBeInTheDocument()
  })
})
