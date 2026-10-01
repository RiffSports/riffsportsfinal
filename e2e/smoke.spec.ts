import { expect, test } from '@playwright/test'

test('abre o app e navega entre as abas', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('Riff Sports')
  await expect(page).toHaveURL(/\/eventos$/)

  await page.getByRole('link', { name: 'Jogar' }).click()
  await expect(page).toHaveURL(/\/jogar$/)

  await page.getByRole('link', { name: 'Perfil' }).click()
  await expect(page).toHaveURL(/\/perfil$/)
})

test('publica o manifest do PWA', async ({ request }) => {
  const response = await request.get('/manifest.webmanifest')
  expect(response.ok()).toBeTruthy()
  const manifest = await response.json()
  expect(manifest.name).toBe('Riff Sports')
})
