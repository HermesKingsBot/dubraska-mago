import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import PrivacidadHero from "@/components/privacidad/PrivacidadHero"
import InfoRecopilada from "@/components/privacidad/InfoRecopilada"
import ComoUsamos from "@/components/privacidad/ComoUsamos"
import Proteccion from "@/components/privacidad/Proteccion"
import Derechos from "@/components/privacidad/Derechos"
import Cookies from "@/components/privacidad/Cookies"
import Terceros from "@/components/privacidad/Terceros"
import Retencion from "@/components/privacidad/Retencion"
import WebSegura from "@/components/privacidad/WebSegura"
import PrivacidadCTA from "@/components/privacidad/PrivacidadCTA"

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  },
}))

vi.mock("@gsap/react", () => ({
  useGSAP: vi.fn(),
}))

vi.mock("gsap", () => ({
  default: {
    fromTo: vi.fn(),
    set: vi.fn(),
    timeline: vi.fn(() => ({
      fromTo: vi.fn().mockReturnThis(),
    })),
  },
}))

describe("PrivacidadHero", () => {
  it("renderiza título Política de Privacidad", () => {
    render(<PrivacidadHero />)
    expect(screen.getByText("Política de")).toBeInTheDocument()
    expect(screen.getByText("Privacidad")).toBeInTheDocument()
  })

  it("renderiza subtítulo", () => {
    render(<PrivacidadHero />)
    expect(screen.getByText("Tu información personal es importante para nosotros")).toBeInTheDocument()
  })

  it("renderiza fecha de actualización", () => {
    render(<PrivacidadHero />)
    expect(screen.getByText("Última actualización: Junio 2026")).toBeInTheDocument()
  })
})

describe("InfoRecopilada", () => {
  it("renderiza tabla con columnas correctas", () => {
    render(<InfoRecopilada />)
    expect(screen.getByText("Dato")).toBeInTheDocument()
    expect(screen.getByText("Ejemplo")).toBeInTheDocument()
    expect(screen.getByText("¿Por qué?")).toBeInTheDocument()
  })

  it("renderiza datos recopilados", () => {
    render(<InfoRecopilada />)
    expect(screen.getByText("Nombre completo")).toBeInTheDocument()
    expect(screen.getByText("Teléfono")).toBeInTheDocument()
    expect(screen.getByText("Cédula o RIF")).toBeInTheDocument()
    expect(screen.getByText("Dirección de envío")).toBeInTheDocument()
  })
})

describe("ComoUsamos", () => {
  it("renderiza grid de usos de información", () => {
    render(<ComoUsamos />)
    expect(screen.getByText("Cómo usamos tu información")).toBeInTheDocument()
  })

  it("renderiza al menos 7 cards de usos", () => {
    render(<ComoUsamos />)
    expect(screen.getByText("Procesar pedidos")).toBeInTheDocument()
    expect(screen.getByText("Comunicarnos contigo")).toBeInTheDocument()
    expect(screen.getByText("Coordinar envíos")).toBeInTheDocument()
    expect(screen.getByText("Mejorar la web")).toBeInTheDocument()
    expect(screen.getByText("Email marketing")).toBeInTheDocument()
    expect(screen.getByText("Prevenir fraude")).toBeInTheDocument()
    expect(screen.getByText("Analytics")).toBeInTheDocument()
  })
})

describe("Proteccion", () => {
  it("renderiza lista de medidas de protección", () => {
    render(<Proteccion />)
    expect(screen.getByText("Protección de datos")).toBeInTheDocument()
    expect(screen.getByText(/Encriptación SSL\/TLS/)).toBeInTheDocument()
    expect(screen.getByText(/Autenticación JWT/)).toBeInTheDocument()
  })

  it("renderiza nota destacada Nunca almacenamos datos de tarjetas", () => {
    render(<Proteccion />)
    expect(screen.getByText(/Nunca almacenamos datos de tarjetas/)).toBeInTheDocument()
  })
})

describe("Cookies", () => {
  it("renderiza tabla de cookies con columnas", () => {
    render(<Cookies />)
    expect(screen.getByText("Cookies y tecnologías")).toBeInTheDocument()
  })

  it("renderiza cookies específicas", () => {
    render(<Cookies />)
    expect(screen.getByText("auth_token")).toBeInTheDocument()
    expect(screen.getByText("cart_data")).toBeInTheDocument()
    expect(screen.getByText("_ga / _gid")).toBeInTheDocument()
  })
})

describe("Derechos", () => {
  it("renderiza 4 derechos ARCO", () => {
    render(<Derechos />)
    expect(screen.getByText("Acceso")).toBeInTheDocument()
    expect(screen.getByText("Rectificación")).toBeInTheDocument()
    expect(screen.getByText("Cancelación")).toBeInTheDocument()
    expect(screen.getByText("Oposición")).toBeInTheDocument()
  })

  it("renderiza descripción de derechos", () => {
    render(<Derechos />)
    expect(screen.getByText("Tus derechos")).toBeInTheDocument()
    expect(screen.getByText(/Conforme a la legislación venezolana/)).toBeInTheDocument()
  })
})

describe("Terceros", () => {
  it("renderiza lista de servicios de terceros", () => {
    render(<Terceros />)
    expect(screen.getByText(/Meta \/ WhatsApp Business API/)).toBeInTheDocument()
    expect(screen.getByText(/Google Analytics/)).toBeInTheDocument()
    expect(screen.getByText("Vercel")).toBeInTheDocument()
    expect(screen.getByText(/Neon \(PostgreSQL\)/)).toBeInTheDocument()
  })

  it("renderiza nota sobre no compartir datos", () => {
    render(<Terceros />)
    expect(screen.getByText(/No vendemos, alquilamos ni compartimos/)).toBeInTheDocument()
  })
})

describe("Retencion", () => {
  it("renderiza timeline de períodos de retención", () => {
    render(<Retencion />)
    expect(screen.getByText("Retención de datos")).toBeInTheDocument()
    expect(screen.getByText("Datos de cuenta")).toBeInTheDocument()
    expect(screen.getByText("Historial de pedidos")).toBeInTheDocument()
    expect(screen.getByText("Datos fiscales")).toBeInTheDocument()
    expect(screen.getByText("Datos de navegación")).toBeInTheDocument()
  })
})

describe("WebSegura", () => {
  it("renderiza badges de seguridad", () => {
    render(<WebSegura />)
    expect(screen.getByText("SSL/TLS Activo")).toBeInTheDocument()
    expect(screen.getByText("Vercel")).toBeInTheDocument()
    expect(screen.getByText("Neon PostgreSQL")).toBeInTheDocument()
  })

  it("renderiza lista de medidas de seguridad web", () => {
    render(<WebSegura />)
    expect(screen.getByText(/Conexión segura con certificado SSL\/TLS/)).toBeInTheDocument()
    expect(screen.getByText(/Hosting en Vercel/)).toBeInTheDocument()
  })
})

describe("PrivacidadCTA", () => {
  it("renderiza botón de WhatsApp", () => {
    render(<PrivacidadCTA />)
    const whatsappLink = screen.getByText("Escribir por WhatsApp")
    expect(whatsappLink).toBeInTheDocument()
  })

  it("renderiza botón de email", () => {
    render(<PrivacidadCTA />)
    const emailLink = screen.getByText("Enviar email")
    expect(emailLink).toBeInTheDocument()
  })

  it("WhatsApp tiene link correcto", () => {
    render(<PrivacidadCTA />)
    const link = screen.getByRole("link", { name: /escribir por whatsapp/i })
    expect(link).toHaveAttribute("href", expect.stringContaining("wa.me"))
  })

  it("Email tiene link mailto correcto", () => {
    render(<PrivacidadCTA />)
    const link = screen.getByRole("link", { name: /enviar email/i })
    expect(link).toHaveAttribute("href", "mailto:info@dubraskamago.com")
  })
})
