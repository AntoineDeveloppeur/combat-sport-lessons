import { test, expect } from "@playwright/test"

test("should download lesson when clicking button", async ({ page }) => {
  // 1. Aller sur la page principale
  await page.goto("/form/calme")

  // 2. Attendre que le bouton soit visible
  await page.waitForSelector('button:has-text("Récupérer la lesson")')

  // 3. Vérifier l'état initial
  await expect(
    page.locator('button:has-text("Récupérer la lesson")'),
  ).toBeEnabled()

  // 4. Cliquer sur le bouton
  await page.click('button:has-text("Récupérer la lesson")')

  // 5. Vérifier l'état de chargement
  await expect(page.locator('button:has-text("Chargement...")')).toBeVisible()

  // 6. Attendre et vérifier le résultat final
  await expect(page.locator("text=Leçon récupérée")).toBeVisible({
    timeout: 20000,
  })

  // 7. Vérifier que le titre de la leçon est affiché
  await expect(page.locator("text=/Leçon récupérée : .+/")).toBeVisible()
})
