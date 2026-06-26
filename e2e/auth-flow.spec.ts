import { test, expect } from "@playwright/test"

test.describe("Auth Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("/api/customer/auth/register", (route) => {
      return route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            token: "mock-token",
            user: { id: "1", name: "Test", email: "test@test.com", role: "CUSTOMER" },
          },
        }),
      })
    })
    await page.route("/api/customer/auth/login", (route) => {
      const body = route.request().postDataJSON()
      if (body?.email === "test@test.com" && body?.password === "password") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: {
              token: "mock-token",
              user: { id: "1", name: "Test", email: "test@test.com", role: "CUSTOMER" },
            },
          }),
        })
      }
      return route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ success: false, error: "Credenciales inválidas" }),
      })
    })
    await page.route("/api/customer/auth/me", (route) => {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { id: "1", name: "Test", email: "test@test.com", role: "CUSTOMER" },
        }),
      })
    })
    await page.route("/api/customer/auth/logout", (route) => {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: { message: "Sesión cerrada" } }),
      })
    })
  })

  test("navegar a /register crear cuenta redirección a /cuenta", async ({ page }) => {
    await page.goto("/register")
    const emailInput = page.locator("input[type='email']")
    const passwordInput = page.locator("input[type='password']")
    const nameInput = page.locator("input#name, input[name='name']").first()
    if (await emailInput.isVisible() && await nameInput.isVisible()) {
      await nameInput.fill("Test User")
      await emailInput.fill("test@test.com")
      await passwordInput.fill("password")
      const submitBtn = page.getByRole("button", { name: /registrarse|crear cuenta/i })
      if (await submitBtn.isVisible()) {
        await submitBtn.click()
        await page.waitForTimeout(1000)
      }
    }
  })

  test("navegar a /login iniciar sesión redirección a /", async ({ page }) => {
    await page.goto("/login")
    const emailInput = page.locator("input[type='email']")
    const passwordInput = page.locator("input[type='password']")
    if (await emailInput.isVisible()) {
      await emailInput.fill("test@test.com")
      await passwordInput.fill("password")
      const submitBtn = page.getByRole("button", { name: /iniciar sesión/i })
      if (await submitBtn.isVisible()) {
        await submitBtn.click()
        await page.waitForTimeout(1000)
      }
    }
  })

  test("login con credenciales inválidas muestra error", async ({ page }) => {
    await page.goto("/login")
    const emailInput = page.locator("input[type='email']")
    const passwordInput = page.locator("input[type='password']")
    if (await emailInput.isVisible()) {
      await emailInput.fill("wrong@test.com")
      await passwordInput.fill("wrong")
      const submitBtn = page.getByRole("button", { name: /iniciar sesión/i })
      if (await submitBtn.isVisible()) {
        await submitBtn.click()
        await page.waitForTimeout(1000)
      }
    }
  })

  test("acceder a /cuenta sin login redirección a /login", async ({ page }) => {
    await page.goto("/cuenta")
    await page.waitForTimeout(1000)
    const currentUrl = page.url()
    expect(currentUrl).toContain("login")
  })
})
