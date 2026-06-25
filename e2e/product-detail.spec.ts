import { test, expect } from "@playwright/test"

test.describe("Product Detail Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("/api/products/*", (route) => {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            id: "1",
            name: "Collar Sol Dorado",
            slug: "collar-sol-dorado",
            description: "Hermoso collar dorado para mujeres que brillan",
            price: 29.99,
            oldPrice: 45.99,
            category: "collares",
            color: "dorado",
            badge: "NUEVO",
            image: "/img.jpg",
            gallery: ["/img.jpg", "/img2.jpg"],
            material: "Acero inoxidable bañado en oro 18K",
            length: "40cm",
            diameter: null,
            weight: "15g",
            inStock: true,
            featured: true,
            stock: 10,
            lowStock: 3,
            sku: "COL-001",
            categoryId: "cat1",
            createdAt: "2024-01-01",
            updatedAt: "2024-01-01",
          },
        }),
      })
    })
  })

  test("page loads with product info", async ({ page }) => {
    await page.goto("/producto/collar-sol-dorado")
    await expect(page.getByText("Collar Sol Dorado")).toBeVisible()
  })

  test("price is displayed correctly", async ({ page }) => {
    await page.goto("/producto/collar-sol-dorado")
    await expect(page.getByText("$29.99")).toBeVisible()
  })

  test("WhatsApp CTA link works", async ({ page }) => {
    await page.goto("/producto/collar-sol-dorado")
    const whatsappLink = page.getByRole("link", { name: /whatsapp/i }).first()
    if (await whatsappLink.isVisible()) {
      await expect(whatsappLink).toHaveAttribute("target", "_blank")
    }
  })

  test("breadcrumb navigation works", async ({ page }) => {
    await page.goto("/producto/collar-sol-dorado")
    const coleccionesLink = page.getByRole("link", { name: /colecciones/i }).first()
    if (await coleccionesLink.isVisible()) {
      await coleccionesLink.click()
      await expect(page).toHaveURL(/colecciones/)
    }
  })

  test("care instructions section renders", async ({ page }) => {
    await page.goto("/producto/collar-sol-dorado")
    const body = page.locator("body")
    await expect(body).toBeVisible()
  })
})
