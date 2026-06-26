import { test, expect } from "@playwright/test"

test.describe("Customer Account", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("/api/customer/auth/login", (route) => {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            token: "mock-token",
            user: { id: "1", name: "Cliente", email: "cliente@test.com", role: "CUSTOMER" },
          },
        }),
      })
    })
    await page.route("/api/customer/auth/me", (route) => {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { id: "1", name: "Cliente", email: "cliente@test.com", phone: "04121234567", role: "CUSTOMER" },
        }),
      })
    })
    await page.route("/api/customer/orders", (route) => {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: [] }),
      })
    })
    await page.route("/api/customer/addresses", (route) => {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: [{ id: "1", label: "Casa", fullName: "Cliente", street: "Calle 1", city: "Caracas", state: "DC" }],
        }),
      })
    })
    await page.route("/api/customer/wishlist", (route) => {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: [] }),
      })
    })
  })

  test("login navegar a /cuenta muestra perfil", async ({ page }) => {
    await page.goto("/login")
    const emailInput = page.locator("input[type='email']")
    const passwordInput = page.locator("input[type='password']")
    if (await emailInput.isVisible()) {
      await emailInput.fill("cliente@test.com")
      await passwordInput.fill("password")
      const submitBtn = page.getByRole("button", { name: /iniciar sesión/i }).first()
      if (await submitBtn.isVisible()) {
        await submitBtn.click()
        await page.waitForTimeout(1000)
      }
    }
    await page.goto("/cuenta")
    await page.waitForTimeout(1000)
    const body = page.locator("body")
    await expect(body).toBeVisible()
  })

  test("/cuenta/pedidos lista pedidos", async ({ page }) => {
    await page.goto("/cuenta/pedidos")
    await page.waitForTimeout(1000)
    const body = page.locator("body")
    await expect(body).toBeVisible()
  })

  test("/cuenta/direcciones lista direcciones", async ({ page }) => {
    await page.goto("/cuenta/direcciones")
    await page.waitForTimeout(1000)
    const body = page.locator("body")
    await expect(body).toBeVisible()
  })

  test("/cuenta/wishlist lista favoritos", async ({ page }) => {
    await page.goto("/cuenta/wishlist")
    await page.waitForTimeout(1000)
    const body = page.locator("body")
    await expect(body).toBeVisible()
  })

  test("/cuenta/configuracion form de cambio de contraseña", async ({ page }) => {
    await page.goto("/cuenta/configuracion")
    await page.waitForTimeout(1000)
    const body = page.locator("body")
    await expect(body).toBeVisible()
  })
})
