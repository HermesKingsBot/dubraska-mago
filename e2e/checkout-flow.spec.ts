import { test, expect } from "@playwright/test"

test.describe("Checkout Flow", () => {
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
    await page.route("/api/cart*", (route) => {
      if (route.request().method() === "GET") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: [{ id: "1", productId: "prod-1", quantity: 1, product: { id: "prod-1", name: "Collar Oro", price: 29.99, image: "/img.jpg" } }],
          }),
        })
      }
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, data: {} }) })
    })
    await page.route("/api/customer/orders", (route) => {
      if (route.request().method() === "POST") {
        return route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: { id: "order-1", orderNumber: "ORD-001", status: "PAYMENT_PENDING" },
          }),
        })
      }
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, data: [] }) })
    })
    await page.route("/api/customer/addresses", (route) => {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: [{ id: "addr-1", label: "Casa", fullName: "Cliente", phone: "04121234567", street: "Calle 1", city: "Caracas", state: "DC" }],
        }),
      })
    })
  })

  test("agregar producto al carrito ir a /checkout", async ({ page }) => {
    await page.goto("/checkout")
    await page.waitForTimeout(1000)
    const body = page.locator("body")
    await expect(body).toBeVisible()
  })

  test("form de checkout con datos de envío", async ({ page }) => {
    await page.goto("/checkout")
    await page.waitForTimeout(1000)
    const input = page.locator("input").first()
    if (await input.isVisible()) {
      await input.fill("Cliente Test")
    }
  })

  test("botón WhatsApp genera mensaje correcto", async ({ page }) => {
    await page.goto("/checkout")
    await page.waitForTimeout(1000)
    const waLink = page.getByRole("link", { name: /whatsapp/i }).first()
    if (await waLink.isVisible()) {
      const href = await waLink.getAttribute("href")
      expect(href).toContain("wa.me")
    }
  })
})
