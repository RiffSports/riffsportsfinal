import { expect, test } from '@playwright/test'
import { baseProfile, fakeLogin } from './helpers.ts'

test('conclui o cadastro em passos e chega ao perfil', async ({ page }, testInfo) => {
  const { patches } = await fakeLogin(page, baseProfile())
  await page.goto('/')
  await expect(page).toHaveURL(/\/cadastro\/perfil$/)
  await expect(page.getByRole('heading', { name: 'Fale um pouquinho sobre você.' })).toBeVisible()
  await page.screenshot({ path: testInfo.outputPath('cadastro-passo-1.png') })

  const continuar = page.getByRole('button', { name: 'Continuar' })
  await expect(continuar).toBeDisabled()
  await page.getByLabel('Qual seu nome completo?').fill('Ana Souza')
  await page.getByLabel('Qual sua data de nascimento?').fill('1990-05-01')
  await page.getByLabel('Como gostaria de ser chamado?').fill('Aninha')
  await continuar.click()

  await expect(page.getByRole('heading', { name: 'Não falta muito.' })).toBeVisible()
  await page.getByLabel('Você possui alguma necessidade de acessibilidade?').selectOption('nenhuma')
  await page.getByText('Feminino').click()
  await expect(page.getByRole('radio', { name: 'Feminino' })).toBeChecked()
  await expect(page.getByRole('button', { name: 'Concluir' })).toBeEnabled()
  await page.screenshot({ path: testInfo.outputPath('cadastro-passo-2.png') })
  await page.getByRole('button', { name: 'Concluir' }).click()

  await expect(page).toHaveURL(/\/perfil$/)
  await expect(page.getByRole('heading', { name: 'Aninha' })).toBeVisible()
  await expect(page.getByText('Membro desde Jan/26')).toBeVisible()
  expect(patches.at(-1)).toMatchObject({
    full_name: 'Ana Souza',
    display_name: 'Aninha',
    birth_date: '1990-05-01',
    accessibility_needs: 'nenhuma',
    gender: 'feminino',
  })
  expect(patches.at(-1)?.onboarded_at).toBeTruthy()
  await page.screenshot({ path: testInfo.outputPath('perfil.png') })
})

test('edita o perfil', async ({ page }, testInfo) => {
  const { patches } = await fakeLogin(
    page,
    baseProfile({
      full_name: 'Ana Souza',
      birth_date: '1990-05-01',
      gender: 'feminino',
      accessibility_needs: 'nenhuma',
      onboarded_at: '2026-01-15T12:00:00Z',
    }),
  )
  await page.goto('/perfil')
  await page.getByRole('link', { name: 'Editar perfil' }).click()
  await expect(page).toHaveURL(/\/perfil\/editar$/)
  await page.getByLabel('Bio').fill('Levantadora de vôlei de praia.')
  await page.getByLabel('Instagram').fill('@ana.souza')
  await page.screenshot({ path: testInfo.outputPath('editar-perfil.png') })
  await page.getByRole('button', { name: 'salvar' }).click()

  await expect(page).toHaveURL(/\/perfil$/)
  await expect(page.getByText('Levantadora de vôlei de praia.')).toBeVisible()
  expect(patches.at(-1)).toMatchObject({ instagram: 'ana.souza' })
})
