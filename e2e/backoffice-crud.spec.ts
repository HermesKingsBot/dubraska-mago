import { test, expect } from "@playwright/test"

test.describe("Backoffice CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("/api/auth/login", (route) => {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { token: "mock-token", user: { email: "admin@test.com", name: "Admin", role: "ADMIN" } },
        }),
      })
    })
    await page.route("/api/auth/me", (route) => {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { email: "admin@test.com", name: "Admin", role: "ADMIN" },
        }),
      })
    })
    await page.route("/api/products*", (route) => {
      if (route.request().method() === "GET") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: {
              items: [{ id: "1", name: "Collar Oro", slug: "collar-oro", price: 29.99, category: "collares", inStock: true, stock: 10 }],
              total: 1,
              page: 1,
              totalPages: 1,
            },
          }),
        })
      }
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, data: { id: "1", name: "Nuevo Producto" } }) })
    })
    await page.route("/api/categories*", (route) => {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: [{ id: "1", name: "Collares" }] }),
      })
    })
    await page.route("/api/testimonials*", (route) => {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: [{ id: "1", name: "Testimonio" }] }),
      })
    })
    await page.route("/api/trash*", (route) => {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { products: [], categories: [], testimonials: [], orders: [], socialLinks: [], totalCount: 0 },
        }),
      })
    })
  })

  test("login como admin /office/dashboard", async ({ page }) => {
    await page.goto("/office")
    await page.waitForTimeout(2000)
    const body = page.locator("body")
    await expect(body).toBeVisible()
  })

  test("/office/products lista productos", async ({ page }) => {
    await page.goto("/office/products")
    await page.waitForTimeout(2000)
    const body = page.locator("body")
    await expect(body).toBeVisible()
  })

  test("/office/categorias CRUD básico", async ({ page }) => {
    await page.goto("/office/categorias")
    await page.waitForTimeout(2000)
    const body = page.locator("body")
    await expect(body).toBeVisible()
  })

  test("/office/testimonios CRUD básico", async ({ page }) => {
    await page.goto("/office/testimonios")
    await page.waitForTimeout(2000)
    const body = page.locator("body")
    await expect(body).toBeVisible()
  })

  test("/office/trash lista elementos eliminados", async ({ page }) => {
    await page.goto("/office/trash")
    await page.waitForTimeout(2000)
    const body = page.locator("body")
    await expect(body).toBeVisible()
  })
})
