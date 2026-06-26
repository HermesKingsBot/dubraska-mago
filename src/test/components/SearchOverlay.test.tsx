import { render, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"
import SearchOverlay from "@/components/SearchOverlay"

vi.mock("@gsap/react", () => ({
  useGSAP: vi.fn(),
}))

vi.mock("gsap", () => ({
  default: {
    fromTo: vi.fn(),
    set: vi.fn(),
  },
}))

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("SearchOverlay", () => {
  it("renderiza dialog con aria-modal", () => {
    render(<SearchOverlay {...defaultProps} />)
    const dialog = screen.getByRole("dialog")
    expect(dialog).toHaveAttribute("aria-modal", "true")
    expect(dialog).toHaveAttribute("aria-label", "Buscar productos")
  })

  it("input tiene role combobox", () => {
    render(<SearchOverlay {...defaultProps} />)
    const input = screen.getByRole("combobox")
    expect(input).toHaveAttribute("aria-controls", "search-suggestions")
  })

  it("escribir 2+ caracteres muestra sugerencias", async () => {
    render(<SearchOverlay {...defaultProps} />)
    const input = screen.getByRole("combobox")
    await userEvent.type(input, "collar")
    await vi.waitFor(() => {
      expect(screen.getAllByRole("option").length).toBeGreaterThan(0)
    }, { timeout: 1500 })
  })

  it("escritura de menos de 2 caracteres no muestra opciones", async () => {
    render(<SearchOverlay {...defaultProps} />)
    const input = screen.getByRole("combobox")
    await userEvent.type(input, "c")
    expect(screen.queryAllByRole("option")).toHaveLength(0)
  })

  it("Escape cierra el overlay", async () => {
    const onClose = vi.fn()
    render(<SearchOverlay isOpen={true} onClose={onClose} />)
    const input = screen.getByRole("combobox")
    fireEvent.keyDown(input, { key: "Escape" })
    expect(onClose).toHaveBeenCalled()
  })

  it("muestra estado vacío con texto de no resultados", async () => {
    render(<SearchOverlay {...defaultProps} />)
    const input = screen.getByRole("combobox")
    await userEvent.type(input, "zzzzz")
    await vi.waitFor(() => {
      expect(screen.getByText(/No se encontraron resultados/)).toBeInTheDocument()
    }, { timeout: 1500 })
  })

  it("no renderiza nada cuando isOpen es false", () => {
    render(<SearchOverlay isOpen={false} onClose={vi.fn()} />)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("cierra con botón de cerrar", async () => {
    const onClose = vi.fn()
    render(<SearchOverlay isOpen={true} onClose={onClose} />)
    const closeBtn = screen.getByRole("button", { name: /cerrar búsqueda/i })
    await userEvent.click(closeBtn)
    expect(onClose).toHaveBeenCalled()
  })
})
