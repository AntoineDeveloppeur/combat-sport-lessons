import { test, expect } from "@playwright/test"

test("user sign-up then login", async ({ page }) => {
  const testUser = {
    name: "TestUser123",
    email: "testuser@example.com",
    password: "SecurePass123!",
  }

  await page.goto("/sign-up")

  await page.locator("#name").fill(testUser.name)
  await page.locator("#email").fill(testUser.email)
  await page.locator("#password").fill(testUser.password)
  await page.locator("#confirm-password").fill(testUser.password)

  await page.click('button[type="submit"]')

  await expect(page.locator('button:has-text("Chargement...")')).toBeVisible({
    timeout: 5000,
  })

  await page.goto("/login")

  await page.locator("#email").fill(testUser.email)
  await page.locator("#password").fill(testUser.password)

  await page.click('button[type="submit"]')

  await expect(page.locator("text=/Connexion réussie|Bienvenue/i")).toBeVisible(
    {
      timeout: 10000,
    },
  )
})
