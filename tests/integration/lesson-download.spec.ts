import { test, expect } from "@playwright/test"

test("should download lesson when clicking button", async ({ page }) => {
  await page.goto("/form/calme")

  await expect(
    page.locator('button:has-text("Récupérer la lesson")'),
  ).toBeEnabled()

  await page.click('button:has-text("Récupérer la lesson")')

  await expect(page.locator('button:has-text("Chargement...")')).toBeVisible({
    timeout: 5000,
  })

  await expect(page.locator("text=Leçon récupérée")).toBeVisible({
    timeout: 20000,
  })

  // check if there is a caracter after ":"
  await expect(page.locator("text=/Leçon récupérée : .+/")).toBeVisible({
    timeout: 5000,
  })
})
