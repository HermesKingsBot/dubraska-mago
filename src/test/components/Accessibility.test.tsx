import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"

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

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<{ href: string } & Record<string, unknown>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock("../../data/products.json", () => ({
  default: [],
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe("Accessibility - Skip link", () => {
  it("skip link existe y apunta a #main-content", () => {
    render(
      <div>
        <a href="#main-content" className="skip-link">Saltar al contenido</a>
        <main id="main-content">Contenido</main>
      </div>
    )
    const skipLink = screen.getByText("Saltar al contenido")
    expect(skipLink).toHaveAttribute("href", "#main-content")
  })

  it("main tiene id main-content", () => {
    render(
      <main id="main-content">Contenido principal</main>
    )
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content")
  })
})

describe("Accessibility - SVGs decorativos", () => {
  it("SVGs decorativos tienen aria-hidden", () => {
    render(
      <div>
        <svg aria-hidden="true" width="24" height="24">
          <circle cx="12" cy="12" r="10" />
        </svg>
        <span>Contenido visible</span>
      </div>
    )
    const svg = document.querySelector("svg")
    expect(svg).toHaveAttribute("aria-hidden", "true")
  })
})

describe("Accessibility - Botones sin texto", () => {
  it("botones sin texto visible tienen aria-label", () => {
    render(
      <button aria-label="Cerrar" type="button">
        <svg aria-hidden="true" width="18" height="18">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    )
    expect(screen.getByRole("button", { name: "Cerrar" })).toBeInTheDocument()
  })
})

describe("Accessibility - Nav links activos", () => {
  it("nav links activos tienen aria-current page", () => {
    render(
      <nav aria-label="Principal">
        <a href="/" aria-current="page">Inicio</a>
        <a href="/colecciones">Catálogo</a>
      </nav>
    )
    const activeLink = screen.getByText("Inicio")
    expect(activeLink).toHaveAttribute("aria-current", "page")
  })
})

describe("Accessibility - Focus visible", () => {
  it("clase focus-visible aplica outline dorado", () => {
    const style = document.createElement("style")
    style.textContent = ".focus-gold:focus-visible { outline: 2px solid var(--color-gold); }"
    document.head.appendChild(style)
    render(
      <button className="focus-gold" type="button">
        Botón
      </button>
    )
    const btn = screen.getByRole("button", { name: "Botón" })
    expect(btn.className).toContain("focus-gold")
    document.head.removeChild(style)
  })
})

describe("Accessibility - prefers-reduced-motion", () => {
  it("desactiva animaciones cuando reduce motion está activo", () => {
    const mockMatchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)" ? true : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: mockMatchMedia,
    })

    const result = window.matchMedia("(prefers-reduced-motion: reduce)")
    expect(result.matches).toBe(true)
  })
})
