import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import Breadcrumbs from "@/components/Breadcrumbs"

vi.mock("@gsap/react", () => ({
  useGSAP: vi.fn(),
}))

vi.mock("gsap", () => ({
  default: {
    fromTo: vi.fn(),
    set: vi.fn(),
  },
}))

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<{ href: string } & Record<string, unknown>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

const simpleItems = [
  { label: "Inicio", href: "/" },
  { label: "Catálogo", href: "/colecciones" },
  { label: "Collar Dorado" },
]

describe("Breadcrumbs", () => {
  it("renderiza ruta actual con aria-current", () => {
    render(<Breadcrumbs items={simpleItems} />)
    const currentPage = screen.getByText("Collar Dorado")
    expect(currentPage).toBeInTheDocument()
  })

  it("renderiza links intermedios navegables", () => {
    render(<Breadcrumbs items={simpleItems} />)
    const inicioLink = screen.getByRole("link", { name: "Inicio" })
    expect(inicioLink).toHaveAttribute("href", "/")
    const catalogoLink = screen.getByRole("link", { name: "Catálogo" })
    expect(catalogoLink).toHaveAttribute("href", "/colecciones")
  })

  it("renderiza separador visual entre items", () => {
    render(<Breadcrumbs items={simpleItems} />)
    const separators = screen.getAllByText("/")
    expect(separators.length).toBe(2)
  })

  it("el item actual tiene estilo dorado", () => {
    render(<Breadcrumbs items={simpleItems} />)
    const current = screen.getByText("Collar Dorado")
    expect(current.className).toContain("text-[var(--color-gold)]")
  })

  it("tiene aria-label Breadcrumb en el nav", () => {
    render(<Breadcrumbs items={simpleItems} />)
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" })
    expect(nav).toBeInTheDocument()
  })
})
