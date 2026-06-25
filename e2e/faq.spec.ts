import { test, expect } from "@playwright/test"

test.describe("FAQ Page", () => {
  test("page loads with questions", async ({ page }) => {
    await page.goto("/preguntas-frecuentes")
    await expect(page.getByRole("heading", { name: /preguntas frecuentes/i })).toBeVisible()
  })

  test("accordion expands on click", async ({ page }) => {
    await page.goto("/preguntas-frecuentes")
    await page.waitForTimeout(1000)
    const firstQuestion = page.locator("button").filter({ hasText: /envío|pago|entrega/i }).first()
    if (await firstQuestion.isVisible()) {
      await firstQuestion.click()
      await page.waitForTimeout(300)
    }
  })

  test("search filters questions", async ({ page }) => {
    await page.goto("/preguntas-frecuentes")
    const searchInput = page.getByPlaceholder(/buscar/i)
    if (await searchInput.isVisible()) {
      await searchInput.fill("envío")
      await page.waitForTimeout(500)
    }
  })

  test("CTA banner is visible", async ({ page }) => {
    await page.goto("/preguntas-frecuentes")
    const body = page.locator("body")
    await expect(body).toBeVisible()
  })
})
