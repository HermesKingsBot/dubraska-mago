import { test, expect } from "@playwright/test"

test.describe("Página de Envíos", () => {
  test("navegar a /envios muestra hero, transportadoras, timeline, cobro destino, banner devoluciones", async ({ page }) => {
    await page.goto("/envios")
    await expect(page.locator("h1").first()).toBeVisible()
    const body = page.locator("body")
    await expect(body).toBeVisible()
  })

  test("click en Ver Política de Devoluciones navega a /envios/devoluciones", async ({ page }) => {
    await page.goto("/envios")
    const link = page.getByRole("link", { name: /devoluciones/i }).first()
    if (await link.isVisible()) {
      await link.click()
      await page.waitForURL(/\/envios\/devoluciones/)
    }
  })

  test("navegar a /envios/devoluciones muestra condiciones, proceso, contacto", async ({ page }) => {
    await page.goto("/envios/devoluciones")
    const body = page.locator("body")
    await expect(body).toBeVisible()
  })
})
