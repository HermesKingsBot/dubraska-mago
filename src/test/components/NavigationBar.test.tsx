import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import NavigationBar from "@/components/NavigationBar"

vi.mock("@gsap/react", () => ({
  useGSAP: vi.fn(),
}))

vi.mock("gsap", () => ({
  default: {
    fromTo: vi.fn(),
    set: vi.fn(),
    matchMedia: vi.fn(() => ({
      add: vi.fn(),
      revert: vi.fn(),
    })),
  },
  ScrollTrigger: { register: vi.fn() },
}))

vi.mock("../../data/products.json", () => ({
  default: [
    { id: "1", name: "Collar Oro", slug: "collar-oro", category: "collares", price: 29.99, image: "/img.jpg" },
  ],
}))

describe("NavigationBar", () => {
  it("renders logo", () => {
    render(<NavigationBar />)
    expect(screen.getByText("DUBRASKA MAGO")).toBeInTheDocument()
  })

  it("renders navigation links", () => {
    render(<NavigationBar />)
    expect(screen.getByRole("link", { name: "Inicio" })).toHaveAttribute("href", "/")
    expect(screen.getByRole("link", { name: "Colecciones" })).toHaveAttribute("href", "/colecciones")
    expect(screen.getByRole("link", { name: "Nosotros" })).toHaveAttribute("href", "/nosotros")
    expect(screen.getByRole("link", { name: "Contacto" })).toHaveAttribute("href", "/contacto")
  })

  it("renders search toggle button", () => {
    render(<NavigationBar />)
    expect(screen.getByRole("button", { name: /buscar/i })).toBeInTheDocument()
  })

  it("renders mobile menu button", () => {
    render(<NavigationBar />)
    expect(screen.getByRole("button", { name: /menú/i })).toBeInTheDocument()
  })

  it("renders Catálogo link", () => {
    render(<NavigationBar />)
    const links = screen.getAllByRole("link", { name: "Catálogo" })
    expect(links.length).toBeGreaterThan(0)
  })
})
