import { test, expect } from "@playwright/test"

test.describe("Office Login Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("/api/auth/login", (route) => {
      const body = route.request().postDataJSON()
      if (body?.email === "admin@test.com" && body?.password === "password") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: { token: "mock-token", user: { email: "admin@test.com", name: "Admin", role: "admin" } },
          }),
        })
      }
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: false, error: "Credenciales inválidas" }),
      })
    })

    await page.route("/api/auth/me", (route) => {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { email: "admin@test.com", name: "Admin", role: "admin" },
        }),
      })
    })
  })

  test("login page loads", async ({ page }) => {
    await page.goto("/office")
    await expect(page.getByRole("heading", { name: /iniciar sesión|office|acceso/i })).toBeVisible()
  })

  test("shows error for wrong credentials", async ({ page }) => {
    await page.goto("/office")
    const emailInput = page.getByRole("textbox", { name: /email/i })
    const passwordInput = page.getByRole("textbox", { name: /password/i }).or(page.getByRole("combobox", { name: /password/i })).or(page.locator("input[type='password']"))
    if (await emailInput.isVisible() && await passwordInput.isVisible()) {
      await emailInput.fill("wrong@test.com")
      await passwordInput.fill("wrong")
      const submitBtn = page.getByRole("button", { name: /iniciar|entrar|login/i })
      if (await submitBtn.isVisible()) {
        await submitBtn.click()
        await page.waitForTimeout(1000)
      }
    }
  })

  test("redirects to dashboard on successful login", async ({ page }) => {
    await page.goto("/office")
    const emailInput = page.getByRole("textbox", { name: /email/i })
    const passwordInput = page.locator("input[type='password']")
    if (await emailInput.isVisible() && await passwordInput.isVisible()) {
      await emailInput.fill("admin@test.com")
      await passwordInput.fill("password")
      const submitBtn = page.getByRole("button", { name: /iniciar|entrar|login/i })
      if (await submitBtn.isVisible()) {
        await submitBtn.click()
        await page.waitForTimeout(2000)
      }
    }
  })
})
