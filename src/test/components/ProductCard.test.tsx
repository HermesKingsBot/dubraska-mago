import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import ProductCard from "@/components/catalog/ProductCard"
import { Product } from "@/types/product"

vi.mock("@gsap/react", () => ({
  useGSAP: vi.fn(),
}))

vi.mock("gsap", () => ({
  default: {
    fromTo: vi.fn(),
  },
}))

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...filterProps(props)}>{children}</div>
    ),
  },
}))

function filterProps(props: Record<string, unknown>) {
  const filtered: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(props)) {
    if (key !== "whileHover" && key !== "transition") {
      filtered[key] = value
    }
  }
  return filtered
}

const mockProduct: Product = {
  id: "1",
  name: "Collar Sol Dorado",
  slug: "collar-sol-dorado",
  description: "Hermoso collar dorado",
  price: 29.99,
  oldPrice: 45.99,
  category: "collares",
  color: "dorado",
  badge: "NUEVO",
  image: "/images/collar.jpg",
  material: "Acero inoxidable bañado en oro 18K",
  inStock: true,
  featured: true,
  stock: 10,
  lowStockThreshold: 3,
  sku: "COL-001",
}

describe("ProductCard", () => {
  it("renders product name and price", () => {
    render(<ProductCard product={mockProduct} index={0} />)
    expect(screen.getByText("Collar Sol Dorado")).toBeInTheDocument()
    expect(screen.getByText("$29.99")).toBeInTheDocument()
  })

  it("renders product image", () => {
    render(<ProductCard product={mockProduct} index={0} />)
    const img = screen.getByRole("img", { name: "Collar Sol Dorado" })
    expect(img).toHaveAttribute("src", "/images/collar.jpg")
  })

  it("shows badge when product has one", () => {
    render(<ProductCard product={mockProduct} index={0} />)
    expect(screen.getByText("NUEVO")).toBeInTheDocument()
  })

  it("shows old price with strikethrough when on sale", () => {
    render(<ProductCard product={mockProduct} index={0} />)
    expect(screen.getByText("$45.99")).toBeInTheDocument()
  })

  it("shows discount percentage", () => {
    render(<ProductCard product={mockProduct} index={0} />)
    const discount = Math.round(((45.99 - 29.99) / 45.99) * 100)
    expect(screen.getByText(`-${discount}%`)).toBeInTheDocument()
  })

  it("shows WhatsApp CTA with correct link", () => {
    render(<ProductCard product={mockProduct} index={0} />)
    const link = screen.getByRole("link", { name: /preguntar por whatsapp/i })
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
    expect(link.getAttribute("href")).toContain("wa.me")
  })

  it("renders category text", () => {
    render(<ProductCard product={mockProduct} index={0} />)
    expect(screen.getByText("collares")).toBeInTheDocument()
  })

  it("renders material text", () => {
    render(<ProductCard product={mockProduct} index={0} />)
    expect(screen.getByText("Acero inoxidable bañado en oro 18K")).toBeInTheDocument()
  })

  it("does not show old price when not on sale", () => {
    const noSaleProduct = { ...mockProduct, oldPrice: null }
    render(<ProductCard product={noSaleProduct} index={0} />)
    expect(screen.queryByText("$45.99")).not.toBeInTheDocument()
  })

  it("does not show badge when null", () => {
    const noBadgeProduct = { ...mockProduct, badge: null }
    render(<ProductCard product={noBadgeProduct} index={0} />)
    expect(screen.queryByText("NUEVO")).not.toBeInTheDocument()
  })

  it("shows LIMITADO badge styling", () => {
    const limitedProduct = { ...mockProduct, badge: "LIMITADO" }
    render(<ProductCard product={limitedProduct} index={0} />)
    expect(screen.getByText("LIMITADO")).toBeInTheDocument()
  })

  it("shows OFERTA badge styling", () => {
    const oferProduct = { ...mockProduct, badge: "OFERTA" }
    render(<ProductCard product={oferProduct} index={0} />)
    expect(screen.getByText("OFERTA")).toBeInTheDocument()
  })
})
