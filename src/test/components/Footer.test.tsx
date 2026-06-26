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

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...filterProps(props)}>{children}</div>
    ),
    a: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <a {...filterProps(props)}>{children}</a>
    ),
    button: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <button {...filterProps(props)}>{children}</button>
    ),
    svg: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <svg {...filterProps(props)}>{children}</svg>
    ),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}))

vi.mock("@/context/SettingsContext", () => ({
  useSettingsContext: () => ({
    settings: { company_name: "Dubraska Mago" },
    socialLinks: [],
    loading: false,
    getSetting: (key: string, fallback?: string) => {
      if (key === "company_name") return "Dubraska Mago"
      if (key === "company_description") return ""
      if (key === "whatsapp") return "584120000000"
      return fallback || ""
    },
    getActiveSocials: () => [
      { id: "whatsapp", platform: "WhatsApp", url: "https://wa.me/58XXXXXXXXXX", handle: "+58 412 000 0000", active: true, order: 0 },
      { id: "instagram", platform: "Instagram", url: "https://instagram.com/dubraskamago", handle: "@dubraska.mago", active: true, order: 1 },
    ],
    refresh: async () => {},
  }),
}))

function filterProps(props: Record<string, unknown>) {
  const filtered: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(props)) {
    if (key !== "whileHover" && key !== "transition" && key !== "initial" && key !== "animate") {
      filtered[key] = value
    }
  }
  return filtered
}

describe("Footer", () => {
  it("renders copyright text", () => {
    render(<Footer />)
    expect(screen.getByText(/© 2026 Dubraska Mago/i)).toBeInTheDocument()
  })

  it("renders social links", () => {
    render(<Footer />)
    expect(screen.getByLabelText(/visitar whatsapp/i)).toHaveAttribute("href", "https://wa.me/58XXXXXXXXXX")
    expect(screen.getByLabelText(/visitar instagram/i)).toHaveAttribute("href", "https://instagram.com/dubraskamago")
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
    expect(screen.getByText("Política de privacidad")).toHaveAttribute("href", "/politicas-privacidad")
  })

  it("renders logo in footer", () => {
    render(<Footer />)
    const logoLinks = screen.getAllByRole("link", { name: /dubraska mago/i })
    expect(logoLinks.length).toBeGreaterThan(0)
  })
})
