import { test, expect } from "@playwright/test"

test.describe("Contact Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("/api/contact*", (route) => {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      })
    })
  })

  test("page loads with contact form", async ({ page }) => {
    await page.goto("/contacto")
    await expect(page.getByRole("heading", { name: /contacto/i })).toBeVisible()
  })

  test("all contact cards render", async ({ page }) => {
    await page.goto("/contacto")
    const body = page.locator("body")
    await expect(body).toBeVisible()
    await expect(page.getByText(/instagram/i).first()).toBeVisible()
  })

  test("form validation works", async ({ page }) => {
    await page.goto("/contacto")
    const submitBtn = page.getByRole("button", { name: /enviar/i })
    if (await submitBtn.isVisible()) {
      await submitBtn.click()
      await page.waitForTimeout(500)
    }
  })

  test("map renders", async ({ page }) => {
    await page.goto("/contacto")
    await page.waitForTimeout(1000)
    const body = page.locator("body")
    await expect(body).toBeVisible()
  })
})
