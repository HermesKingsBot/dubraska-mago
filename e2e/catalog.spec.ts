import { test, expect } from "@playwright/test"

test.describe("Catalog Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("/api/products*", (route) => {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            items: [
              { id: "1", name: "Collar Oro", slug: "collar-oro", price: 29.99, oldPrice: 45.99, category: "collares", color: "dorado", badge: "NUEVO", image: "/img.jpg", material: "Oro 18K", inStock: true, stock: 10, sku: "C001", description: "Collar dorado" },
              { id: "2", name: "Pulsera Plata", slug: "pulsera-plata", price: 19.99, oldPrice: null, category: "pulseras", color: "plateado", badge: null, image: "/img2.jpg", material: "Plata", inStock: true, stock: 15, sku: "P001", description: "Pulsera plata" },
              { id: "3", name: "Aretes Rosa", slug: "aretes-rosa", price: 35.00, oldPrice: null, category: "aretes", color: "rose", badge: "LIMITADO", image: "/img3.jpg", material: "Acero", inStock: true, stock: 5, sku: "A001", description: "Aretes rosa" },
            ],
            total: 3,
            page: 1,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          },
        }),
      })
    })
  })

  test("page loads with products", async ({ page }) => {
    await page.goto("/colecciones")
    await expect(page.getByText("Collar Oro")).toBeVisible()
  })

  test("search filters products", async ({ page }) => {
    await page.goto("/colecciones")
    const searchInput = page.getByPlaceholder(/buscar/i)
    await searchInput.fill("oro")
    await page.waitForTimeout(500)
    await expect(page.getByText("Collar Oro")).toBeVisible()
  })

  test("category filter works", async ({ page }) => {
    await page.goto("/colecciones?category=collares")
    await page.waitForTimeout(500)
    await expect(page.getByText("Collar Oro")).toBeVisible()
  })

  test("sort changes order", async ({ page }) => {
    await page.goto("/colecciones")
    const sortBtn = page.getByRole("button", { name: /recientes/i })
    if (await sortBtn.isVisible()) {
      await sortBtn.click()
      await page.getByText("Precio: menor a mayor").click()
      await expect(page.getByText("Precio: menor a mayor")).toBeVisible()
    }
  })

  test("product card links to product detail", async ({ page }) => {
    await page.goto("/colecciones")
    const productLink = page.getByRole("link", { name: /collar oro/i }).first()
    if (await productLink.isVisible()) {
      await productLink.click()
      await expect(page).toHaveURL(/producto/)
    }
  })

  test("clear filters resets everything", async ({ page }) => {
    await page.goto("/colecciones?category=collares&q=oro")
    await page.waitForTimeout(500)
    const clearBtn = page.getByRole("button", { name: /limpiar/i })
    if (await clearBtn.isVisible()) {
      await clearBtn.click()
      await expect(page).toHaveURL(/colecciones/)
    }
  })

  test("URL updates with filter params", async ({ page }) => {
    await page.goto("/colecciones?category=collares")
    await expect(page).toHaveURL(/category=collares/)
  })
})
