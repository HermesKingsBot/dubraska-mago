import { render, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"
import QuickViewModal from "@/components/catalog/QuickViewModal"
import { Product } from "@/types/product"

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { src, alt, width, height, ...rest } = props
    return <img src={src} alt={alt} width={width} height={height} {...rest} />
  },
}))

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...filterProps(props)}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}))

function filterProps(props: Record<string, unknown>) {
  const filtered: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(props)) {
    if (["onClick", "className", "style"].includes(key)) {
      filtered[key] = value
    }
  }
  return filtered
}

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<{ href: string } & Record<string, unknown>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

const mockProduct: Product = {
  id: "1",
  name: "Collar Dorado",
  slug: "collar-dorado",
  description: "Hermoso collar",
  price: 29.99,
  oldPrice: 45.99,
  category: "collares",
  color: "dorado",
  badge: "NUEVO",
  image: "/images/collar.jpg",
  material: "Acero inoxidable",
  inStock: true,
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("QuickViewModal", () => {
  it("muestra nombre del producto", () => {
    render(<QuickViewModal product={mockProduct} isOpen={true} onClose={vi.fn()} />)
    expect(screen.getByText("Collar Dorado")).toBeInTheDocument()
  })

  it("muestra precio del producto", () => {
    render(<QuickViewModal product={mockProduct} isOpen={true} onClose={vi.fn()} />)
    expect(screen.getByText("$29.99")).toBeInTheDocument()
  })

  it("muestra imagen del producto", () => {
    render(<QuickViewModal product={mockProduct} isOpen={true} onClose={vi.fn()} />)
    const img = screen.getByRole("img", { name: "Collar Dorado" })
    expect(img).toHaveAttribute("src", "/images/collar.jpg")
  })

  it("botón cerrar funciona", async () => {
    const onClose = vi.fn()
    render(<QuickViewModal product={mockProduct} isOpen={true} onClose={onClose} />)
    const closeBtn = screen.getByRole("button", { name: /cerrar vista rápida/i })
    await userEvent.click(closeBtn)
    expect(onClose).toHaveBeenCalled()
  })

  it("Escape cierra el modal", () => {
    const onClose = vi.fn()
    render(<QuickViewModal product={mockProduct} isOpen={true} onClose={onClose} />)
    fireEvent.keyDown(document, { key: "Escape" })
    expect(onClose).toHaveBeenCalled()
  })

  it("no renderiza nada cuando product es null", () => {
    render(<QuickViewModal product={null} isOpen={true} onClose={vi.fn()} />)
    expect(screen.queryByText("Collar Dorado")).not.toBeInTheDocument()
  })

  it("no renderiza nada cuando isOpen es false", () => {
    render(<QuickViewModal product={mockProduct} isOpen={false} onClose={vi.fn()} />)
    expect(screen.queryByText("Collar Dorado")).not.toBeInTheDocument()
  })

  it("muestra badge del producto", () => {
    render(<QuickViewModal product={mockProduct} isOpen={true} onClose={vi.fn()} />)
    expect(screen.getByText("NUEVO")).toBeInTheDocument()
  })

  it("muestra estado de stock", () => {
    render(<QuickViewModal product={mockProduct} isOpen={true} onClose={vi.fn()} />)
    expect(screen.getByText("En stock")).toBeInTheDocument()
  })

  it("muestra link Ver detalles con slug correcto", () => {
    render(<QuickViewModal product={mockProduct} isOpen={true} onClose={vi.fn()} />)
    const link = screen.getByRole("link", { name: /ver detalles/i })
    expect(link).toHaveAttribute("href", "/producto/collar-dorado")
  })
})
