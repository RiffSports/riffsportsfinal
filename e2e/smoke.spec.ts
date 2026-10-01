import { expect, test } from '@playwright/test'

test('abre na tela de boas-vindas e navega pela entrada', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('Riff Sports')
  await expect(page).toHaveURL(/\/boas-vindas$/)
  await expect(page.getByAltText('Riff Sports')).toBeVisible()

  await page.getByRole('link', { name: 'Iniciar sessão' }).click()
  await expect(page).toHaveURL(/\/entrar$/)
  await expect(page.getByRole('heading', { name: 'Bem-vindo de volta.' })).toBeVisible()

  await page.getByRole('link', { name: 'Não possui uma conta?' }).click()
  await expect(page).toHaveURL(/\/cadastro$/)
  await expect(page.getByRole('heading', { name: 'Boas-vindas à Riff!' })).toBeVisible()
})

test('valida o login sem falar com o servidor', async ({ page }) => {
  await page.goto('/entrar')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page.getByText('Esse e-mail parece incompleto.')).toBeVisible()
  await expect(page.getByText('Falta a senha.')).toBeVisible()
})

test('protege as telas do app', async ({ page }) => {
  await page.goto('/perfil')
  await expect(page).toHaveURL(/\/boas-vindas$/)
})

test('publica o manifest do PWA', async ({ request }) => {
  const response = await request.get('/manifest.webmanifest')
  expect(response.ok()).toBeTruthy()
  const manifest = await response.json()
  expect(manifest.name).toBe('Riff Sports')
})
