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

  await page.waitForTimeout(2000) // for Google Recaptcha to be ready
  await page.click('button[type="submit"]')
  await page.waitForTimeout(2000) // wait for account to be created

  await page.goto("/login")

  await page.locator("#email").fill(testUser.email)
  await page.locator("#password").fill(testUser.password)

  await page.waitForTimeout(2000) // for Google Recaptcha to be ready
  await page.click('button[type="submit"]')

  await page.waitForURL("**/lessons")
  await expect(page).toHaveURL(/\/lessons/)
})
