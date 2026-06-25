import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import Footer from "@/components/Footer"

vi.mock("@gsap/react", () => ({
  useGSAP: vi.fn(),
}))

vi.mock("gsap", () => ({
  default: {
    fromTo: vi.fn(),
    set: vi.fn(),
    matchMedia: vi.fn(() => ({
      add: vi.fn((_: string, cb: () => void) => cb()),
      revert: vi.fn(),
    })),
    registerPlugin: vi.fn(),
  },
  ScrollTrigger: { register: vi.fn() },
}))

describe("Footer", () => {
  it("renders copyright text", () => {
    render(<Footer />)
    expect(screen.getByText(/© 2026 Dubraska Mago/i)).toBeInTheDocument()
  })

  it("renders social links", () => {
    render(<Footer />)
    expect(screen.getByLabelText("WhatsApp")).toHaveAttribute("href", "https://wa.me/58XXXXXXXXXX")
    expect(screen.getByLabelText("Instagram")).toHaveAttribute("href", "https://instagram.com/dubraskamago")
  })

  it("renders Tienda section links", () => {
    render(<Footer />)
    expect(screen.getByText("Collares")).toBeInTheDocument()
    expect(screen.getByText("Pulseras")).toBeInTheDocument()
    expect(screen.getByText("Aretes")).toBeInTheDocument()
  })

  it("renders Información section links", () => {
    render(<Footer />)
    expect(screen.getByText("Sobre mí")).toBeInTheDocument()
    expect(screen.getByText("Preguntas frecuentes")).toBeInTheDocument()
    expect(screen.getByText("Contacto")).toBeInTheDocument()
  })

  it("renders newsletter form", () => {
    render(<Footer />)
    expect(screen.getByPlaceholderText("tu@email.com")).toBeInTheDocument()
    expect(screen.getByText("Suscribirme")).toBeInTheDocument()
  })

  it("renders legal links", () => {
    render(<Footer />)
    expect(screen.getByText("Términos y condiciones")).toHaveAttribute("href", "/terminos")
    expect(screen.getByText("Política de privacidad")).toHaveAttribute("href", "/privacidad")
  })

  it("renders logo in footer", () => {
    render(<Footer />)
    const logoLinks = screen.getAllByRole("link", { name: /dubraska mago/i })
    expect(logoLinks.length).toBeGreaterThan(0)
  })
})
