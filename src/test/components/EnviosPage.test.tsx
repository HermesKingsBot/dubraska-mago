import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import HeroEnvios from "@/components/envios/HeroEnvios"
import TransportadorasCards from "@/components/envios/TransportadorasCards"
import EnvioDetalle from "@/components/envios/EnvioDetalle"
import CobroDestinoInfo from "@/components/envios/CobroDestinoInfo"
import BannerDevoluciones from "@/components/envios/BannerDevoluciones"

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div>{children}</div>
    ),
    a: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <a {...filterLinks(props)}>{children}</a>
    ),
  },
}))

function filterLinks(props: Record<string, unknown>) {
  const filtered: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(props)) {
    if (["href", "target", "rel", "className", "style", "onClick", "onMouseDown"].includes(key)) {
      filtered[key] = value
    }
  }
  return filtered
}

vi.mock("@gsap/react", () => ({
  useGSAP: vi.fn(),
}))

vi.mock("gsap", () => ({
  default: {
    fromTo: vi.fn(),
    set: vi.fn(),
    to: vi.fn(),
    matchMedia: vi.fn(() => ({
      add: vi.fn((_: string, cb: () => void) => cb()),
      revert: vi.fn(),
    })),
  },
}))

describe("HeroEnvios", () => {
  it("renderiza titulo Envíos", () => {
    render(<HeroEnvios />)
    expect(screen.getByText("Envíos")).toBeInTheDocument()
  })

  it("renderiza subtitulo sobre envios", () => {
    render(<HeroEnvios />)
    expect(screen.getByText(/Enviamos tus piezas de joyería/)).toBeInTheDocument()
  })

  it("renderiza fecha de actualización", () => {
    render(<HeroEnvios />)
    expect(screen.getByText(/Envíos nacionales con cobro destino/)).toBeInTheDocument()
  })
})

describe("TransportadorasCards", () => {
  it("renderiza las 4 transportadoras", () => {
    render(<TransportadorasCards />)
    expect(screen.getByText("MRW")).toBeInTheDocument()
    expect(screen.getByText("Zoom")).toBeInTheDocument()
    expect(screen.getByText("TEALCA")).toBeInTheDocument()
    expect(screen.getByText("Domesa")).toBeInTheDocument()
  })

  it("renderiza badge Cobro Destino en cada transportadora", () => {
    render(<TransportadorasCards />)
    const badges = screen.getAllByText("Cobro Destino")
    expect(badges.length).toBe(4)
  })

  it("renderiza descripciones de cada transportadora", () => {
    render(<TransportadorasCards />)
    expect(screen.getByText(/Cobertura nacional amplia/)).toBeInTheDocument()
    expect(screen.getByText(/Entrega rápida con seguimiento/)).toBeInTheDocument()
    expect(screen.getByText(/Cobertura en zonas rurales/)).toBeInTheDocument()
    expect(screen.getByText(/Opción económica/)).toBeInTheDocument()
  })
})

describe("EnvioDetalle", () => {
  it("renderiza los 5 pasos numerados", () => {
    render(<EnvioDetalle />)
    expect(screen.getByText("PASO 01")).toBeInTheDocument()
    expect(screen.getByText("PASO 02")).toBeInTheDocument()
    expect(screen.getByText("PASO 03")).toBeInTheDocument()
    expect(screen.getByText("PASO 04")).toBeInTheDocument()
    expect(screen.getByText("PASO 05")).toBeInTheDocument()
  })

  it("renderiza los titulos de cada paso", () => {
    render(<EnvioDetalle />)
    expect(screen.getByText("Confirmas tu pedido")).toBeInTheDocument()
    expect(screen.getByText("Empaquetamos con protección premium")).toBeInTheDocument()
    expect(screen.getByText("Despachamos tu envío")).toBeInTheDocument()
    expect(screen.getByText("Recibes tu guía de seguimiento")).toBeInTheDocument()
    expect(screen.getByText("Retiras y pagas en la oficina")).toBeInTheDocument()
  })

  it("renderiza la sección de timeline", () => {
    render(<EnvioDetalle />)
    expect(screen.getByText(/Así funciona tu/)).toBeInTheDocument()
  })
})

describe("CobroDestinoInfo", () => {
  it("renderiza explicación de cobro destino", () => {
    render(<CobroDestinoInfo />)
    expect(screen.getByText(/¿Qué es/)).toBeInTheDocument()
    expect(screen.getByText(/El costo del envío se paga al retirar/)).toBeInTheDocument()
  })

  it("renderiza la tabla de costos por zona", () => {
    render(<CobroDestinoInfo />)
    expect(screen.getByText("Caracas y gran Caracas")).toBeInTheDocument()
    expect(screen.getByText("Ciudades principales")).toBeInTheDocument()
    expect(screen.getByText("Estados cercanos")).toBeInTheDocument()
    expect(screen.getByText(/Interior del país/)).toBeInTheDocument()
  })

  it("renderiza los beneficios", () => {
    render(<CobroDestinoInfo />)
    expect(screen.getByText("No pagas por adelantado")).toBeInTheDocument()
    expect(screen.getByText("Solo necesitas tu cédula")).toBeInTheDocument()
    expect(screen.getByText("Retiras cuando puedas")).toBeInTheDocument()
  })
})

describe("BannerDevoluciones", () => {
  it("renderiza texto de 7 días", () => {
    render(<BannerDevoluciones />)
    expect(screen.getByText(/Tienes 7 días/)).toBeInTheDocument()
  })

  it("renderiza botón de política de devoluciones", () => {
    render(<BannerDevoluciones />)
    const link = screen.getByText("Ver Política de Devoluciones")
    expect(link).toBeInTheDocument()
  })

  it("renderiza link correcto a devoluciones", () => {
    render(<BannerDevoluciones />)
    const link = screen.getByRole("link", { name: /ver política de devoluciones/i })
    expect(link).toHaveAttribute("href", "/envios/devoluciones")
  })
})
