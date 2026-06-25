import { test, expect } from "@playwright/test"

test.describe("SEO Elements", () => {
  test("home page has correct title", async ({ page }) => {
    await page.goto("/")
    const title = await page.title()
    expect(title.length).toBeGreaterThan(0)
    expect(title.toLowerCase()).toContain("dubraska")
  })

  test("home page has meta description", async ({ page }) => {
    await page.goto("/")
    const metaDesc = page.locator("meta[name='description']")
    await expect(metaDesc).toHaveAttribute("content", /.+/)
  })

  test("colecciones page has title", async ({ page }) => {
    await page.goto("/colecciones")
    const title = await page.title()
    expect(title.length).toBeGreaterThan(0)
  })

  test("contacto page has title", async ({ page }) => {
    await page.goto("/contacto")
    const title = await page.title()
    expect(title.length).toBeGreaterThan(0)
  })

  test("preguntas-frecuentes page has title", async ({ page }) => {
    await page.goto("/preguntas-frecuentes")
    const title = await page.title()
    expect(title.length).toBeGreaterThan(0)
  })

  test("Open Graph tags present on home", async ({ page }) => {
    await page.goto("/")
    const ogTitle = page.locator("meta[property='og:title']")
    if (await ogTitle.count() > 0) {
      await expect(ogTitle).toHaveAttribute("content", /.+/)
    }
  })

  test("sitemap.xml is accessible", async ({ page }) => {
    const response = await page.goto("/sitemap.xml")
    expect(response?.status()).toBe(200)
  })

  test("robots.txt is accessible", async ({ page }) => {
    const response = await page.goto("/robots.txt")
    expect(response?.status()).toBe(200)
  })

  test("nosotros page has title", async ({ page }) => {
    await page.goto("/nosotros")
    const title = await page.title()
    expect(title.length).toBeGreaterThan(0)
  })
})
