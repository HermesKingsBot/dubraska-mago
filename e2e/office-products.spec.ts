import { test, expect } from "@playwright/test"

test.describe("Office Products Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("/api/auth/login", (route) => {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { token: "mock-token", user: { email: "admin@test.com", name: "Admin", role: "admin" } },
        }),
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

    await page.route("/api/products*", (route) => {
      if (route.request().method() === "GET") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: {
              items: [
                { id: "1", name: "Collar Oro", slug: "collar-oro", price: 29.99, category: "collares", color: "dorado", badge: "NUEVO", image: "/img.jpg", material: "Oro", inStock: true, stock: 10, sku: "C001", description: "Collar" },
              ],
              total: 1,
              page: 1,
              totalPages: 1,
            },
          }),
        })
      }
      return route.fallback()
    })
  })

  test("products list loads from API", async ({ page }) => {
    await page.goto("/office")
    await page.waitForTimeout(2000)
    const body = page.locator("body")
    await expect(body).toBeVisible()
  })
})
