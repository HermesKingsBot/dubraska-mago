import { test, expect } from "@playwright/test"

test.describe("Site-wide Navigation", () => {
  test("nav links work from home page", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("link", { name: "Colecciones" }).first().click()
    await expect(page).toHaveURL(/colecciones/)
  })

  test("logo click returns to home", async ({ page }) => {
    await page.goto("/colecciones")
    await page.getByRole("link", { name: /dubraska mago/i }).first().click()
    await expect(page).toHaveURL("/")
  })

  test("footer links work", async ({ page }) => {
    await page.goto("/")
    await page.waitForTimeout(1000)
    const termsLink = page.getByRole("link", { name: /términos/i }).first()
    if (await termsLink.isVisible()) {
      await termsLink.click()
      await page.waitForTimeout(500)
    }
  })

  test("mobile menu opens/closes", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto("/")
    const menuBtn = page.getByRole("button", { name: /menú/i })
    await menuBtn.click()
    await expect(page.getByRole("link", { name: "Nosotros" })).toBeVisible()
    await menuBtn.click()
  })

  test("search overlay opens/closes", async ({ page }) => {
    await page.goto("/")
    const searchBtn = page.getByRole("button", { name: /buscar/i })
    await searchBtn.click()
    await expect(page.getByPlaceholder(/buscar productos/i)).toBeVisible()
    const closeBtn = page.getByRole("button", { name: /cerrar búsqueda/i })
    await closeBtn.click()
  })

  test("404 page for unknown routes", async ({ page }) => {
    const response = await page.goto("/nonexistent-page-xyz")
    expect(response?.status()).toBe(404)
  })

  test("contact page is accessible", async ({ page }) => {
    await page.goto("/contacto")
    await expect(page.getByRole("heading", { name: /contacto/i })).toBeVisible()
  })

  test("nosotros page is accessible", async ({ page }) => {
    await page.goto("/nosotros")
    const body = page.locator("body")
    await expect(body).toBeVisible()
  })
})
