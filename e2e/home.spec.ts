import { test, expect } from "@playwright/test"

test.describe("Home Page", () => {
  test("loads with correct title", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveTitle(/dubraska mago/i)
  })

  test("hero section is visible", async ({ page }) => {
    await page.goto("/")
    const hero = page.locator("section").first()
    await expect(hero).toBeVisible()
  })

  test("navigation bar is visible", async ({ page }) => {
    await page.goto("/")
    const nav = page.getByRole("link", { name: /dubraska mago/i }).first()
    await expect(nav).toBeVisible()
  })

  test("logo links to home", async ({ page }) => {
    await page.goto("/")
    const logo = page.getByRole("link", { name: /dubraska mago/i }).first()
    await expect(logo).toHaveAttribute("href", "/")
  })

  test("nav links are present", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("link", { name: "Colecciones" }).first()).toBeVisible()
    await expect(page.getByRole("link", { name: "Contacto" }).first()).toBeVisible()
  })

  test("GSAP animations don't break rendering", async ({ page }) => {
    await page.goto("/")
    await page.waitForTimeout(1000)
    const body = page.locator("body")
    await expect(body).toBeVisible()
  })

  test("mobile: hamburger menu works", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto("/")
    const menuBtn = page.getByRole("button", { name: /menú/i })
    await expect(menuBtn).toBeVisible()
    await menuBtn.click()
    await expect(page.getByRole("link", { name: "Nosotros" })).toBeVisible()
  })
})
