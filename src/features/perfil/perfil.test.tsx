import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { copy } from '@/copy/pt-BR'
import { editProfileSchema } from '@/features/perfil/schemas'
import { formatMonthYear, isAtLeast, latestBirthDateFor } from '@/lib/dates'
import { renderRoute } from '@/test/render'
import { fakeProfile, fakeSession } from '@/test/supabase-mock'

describe('cadastro em passos', () => {
  it('bloqueia menores de 18 e só libera o Continuar com tudo certo', async () => {
    const user = userEvent.setup()
    renderRoute('/cadastro/perfil', {
      session: fakeSession(),
      profile: fakeProfile({ onboarded_at: null, birth_date: null, full_name: 'Jogador' }),
    })
    const continuar = await screen.findByRole('button', { name: copy.actions.continue })
    expect(continuar).toBeDisabled()

    // "Jogador" é o nome padrão do banco: o campo começa vazio.
    const nome = screen.getByLabelText(copy.onboarding.step1.fullName)
    expect(nome).toHaveValue('')
    await user.type(nome, 'Ana Souza')

    const nascimento = screen.getByLabelText(copy.onboarding.step1.birthDate)
    await user.type(nascimento, latestBirthDateFor(17))
    await user.tab()
    expect(await screen.findByText(copy.onboarding.validation.underage)).toBeInTheDocument()
    expect(continuar).toBeDisabled()

    await user.clear(nascimento)
    await user.type(nascimento, '1990-05-01')
    await user.tab()
    expect(continuar).toBeEnabled()

    await user.click(continuar)
    expect(
      await screen.findByRole('heading', { name: copy.onboarding.step2.title }),
    ).toBeInTheDocument()
    expect(screen.getByText(copy.onboarding.stepOf(2, 2))).toBeInTheDocument()
  })
})

describe('perfil', () => {
  it('mostra o próprio perfil como no Figma', async () => {
    renderRoute('/perfil', {
      session: fakeSession(),
      profile: fakeProfile({
        display_name: 'Aninha',
        bio: 'Levantadora de vôlei.',
        instagram: 'ana.souza',
      }),
    })
    expect(await screen.findByRole('heading', { name: 'Aninha' })).toBeInTheDocument()
    expect(screen.getByText('Membro desde Jan/26')).toBeInTheDocument()
    expect(screen.getByText(copy.profile.eventsJoined(0))).toBeInTheDocument()
    expect(screen.getByText('Levantadora de vôlei.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: copy.profile.instagram })).toHaveAttribute(
      'href',
      'https://instagram.com/ana.souza',
    )
    expect(screen.getByRole('link', { name: copy.profile.edit })).toHaveAttribute(
      'href',
      '/perfil/editar',
    )
  })

  it('mostra o perfil de outro jogador sem botão de editar', async () => {
    renderRoute('/jogadores/22222222-2222-2222-2222-222222222222', {
      session: fakeSession(),
      profile: fakeProfile({
        id: '22222222-2222-2222-2222-222222222222',
        full_name: 'Julia Alcantra',
      }),
    })
    expect(await screen.findByRole('heading', { name: 'Julia Alcantra' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: copy.profile.edit })).not.toBeInTheDocument()
  })
})

describe('regras de perfil', () => {
  it('calcula 18 anos completos como o banco', () => {
    const today = new Date(2026, 9, 1)
    expect(isAtLeast(18, '2008-10-01', today)).toBe(true)
    expect(isAtLeast(18, '2008-10-02', today)).toBe(false)
  })

  it('formata "Membro desde" como no Figma', () => {
    expect(formatMonthYear(new Date(2022, 0, 10))).toBe('Jan/22')
  })

  it('aceita o Instagram com @ ou link e guarda só o usuário', () => {
    const base = { fullName: 'Ana Souza', displayName: '', bio: '' }
    expect(editProfileSchema.parse({ ...base, instagram: '@ana.souza' }).instagram).toBe(
      'ana.souza',
    )
    expect(
      editProfileSchema.parse({ ...base, instagram: 'https://instagram.com/ana_souza/' }).instagram,
    ).toBe('ana_souza')
    expect(editProfileSchema.safeParse({ ...base, instagram: 'ana souza!' }).success).toBe(false)
  })
})
