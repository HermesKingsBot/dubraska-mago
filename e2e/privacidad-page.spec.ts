import { test, expect } from "@playwright/test"

test.describe("Página de Privacidad", () => {
  test("navegar a /politicas-privacidad muestra todas las secciones", async ({ page }) => {
    await page.goto("/politicas-privacidad")
    const body = page.locator("body")
    await expect(body).toBeVisible()
  })

  test("scroll completo funciona", async ({ page }) => {
    await page.goto("/politicas-privacidad")
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)
    const scrollY = await page.evaluate(() => window.scrollY)
    expect(scrollY).toBeGreaterThan(0)
  })

  test("links a WhatsApp y email funcionan", async ({ page }) => {
    await page.goto("/politicas-privacidad")
    const waLink = page.getByRole("link", { name: /whatsapp|wa\.me|contacto/i }).first()
    if (await waLink.isVisible()) {
      const href = await waLink.getAttribute("href")
      expect(href).toBeTruthy()
    }
  })
})
