import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"
import CartDrawer from "@/components/cart/CartDrawer"

const mockUseCart = vi.fn()

vi.mock("@/context/CartContext", () => ({
  useCart: () => mockUseCart(),
}))

vi.mock("@/components/EmptyStates", () => ({
  default: ({ variant, onAction }: { variant: string; onAction?: () => void }) => (
    <div data-testid="empty-states">
      <span>{variant}</span>
      {onAction && <button onClick={onAction}>Cerrar</button>}
    </div>
  ),
}))

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...filterMotionProps(props)}>{children}</div>
    ),
    button: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <button {...filterMotionProps(props)}>{children}</button>
    ),
    span: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <span>{children}</span>
    ),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}))

function filterMotionProps(props: Record<string, unknown>) {
  const filtered: Record<string, unknown> = {}
  const keep = ["role", "aria-label", "aria-modal", "onClick", "className", "style", "type", "disabled"]
  for (const key of keep) {
    if (props[key] !== undefined) filtered[key] = props[key]
  }
  return filtered
}

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<{ href: string } & Record<string, unknown>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

const mockCartItem = {
  id: "item-1",
  productId: "prod-1",
  quantity: 2,
  product: {
    id: "prod-1",
    name: "Collar Dorado",
    slug: "collar-dorado",
    price: 29.99,
    image: "/images/collar.jpg",
    category: "collares",
    description: "Collar hermoso",
  },
}

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
}

beforeEach(() => {
  vi.clearAllMocks()
  mockUseCart.mockReturnValue({
    cartItems: [mockCartItem],
    cartTotal: 59.98,
    removeFromCart: vi.fn().mockResolvedValue(undefined),
    updateQuantity: vi.fn().mockResolvedValue(undefined),
  })
})

describe("CartDrawer", () => {
  it("renderiza título Tu carrito con contador", () => {
    render(<CartDrawer {...defaultProps} />)
    expect(screen.getByText(/Tu carrito/)).toBeInTheDocument()
    expect(screen.getByText("1")).toBeInTheDocument()
  })

  it("renderiza role dialog y aria-modal", () => {
    render(<CartDrawer {...defaultProps} />)
    const dialog = screen.getByRole("dialog")
    expect(dialog).toHaveAttribute("aria-modal", "true")
    expect(dialog).toHaveAttribute("aria-label", "Carrito de compras")
  })

  it("muestra EmptyStates cuando el carrito está vacío", () => {
    mockUseCart.mockReturnValue({
      cartItems: [],
      cartTotal: 0,
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
    })
    render(<CartDrawer {...defaultProps} />)
    expect(screen.getByTestId("empty-states")).toBeInTheDocument()
  })

  it("renderiza items del carrito con nombre y precio", () => {
    render(<CartDrawer {...defaultProps} />)
    expect(screen.getByText("Collar Dorado")).toBeInTheDocument()
    expect(screen.getAllByText(/\$59\.98/).length).toBeGreaterThanOrEqual(1)
  })

  it("botón de aumentar cantidad funciona", async () => {
    const updateQuantity = vi.fn().mockResolvedValue(undefined)
    mockUseCart.mockReturnValue({
      cartItems: [mockCartItem],
      cartTotal: 59.98,
      removeFromCart: vi.fn(),
      updateQuantity,
    })
    render(<CartDrawer {...defaultProps} />)
    const increaseBtn = screen.getByRole("button", { name: /aumentar cantidad/i })
    await userEvent.click(increaseBtn)
    expect(updateQuantity).toHaveBeenCalledWith("item-1", 3)
  })

  it("botón de reducir cantidad funciona", async () => {
    const updateQuantity = vi.fn().mockResolvedValue(undefined)
    mockUseCart.mockReturnValue({
      cartItems: [mockCartItem],
      cartTotal: 59.98,
      removeFromCart: vi.fn(),
      updateQuantity,
    })
    render(<CartDrawer {...defaultProps} />)
    const decreaseBtn = screen.getByRole("button", { name: /reducir cantidad/i })
    await userEvent.click(decreaseBtn)
    expect(updateQuantity).toHaveBeenCalledWith("item-1", 1)
  })

  it("botón eliminar muestra confirmación con doble click", async () => {
    const removeFromCart = vi.fn().mockResolvedValue(undefined)
    mockUseCart.mockReturnValue({
      cartItems: [mockCartItem],
      cartTotal: 59.98,
      removeFromCart,
      updateQuantity: vi.fn(),
    })
    render(<CartDrawer {...defaultProps} />)
    const removeBtn = screen.getByRole("button", { name: /eliminar/i })
    await userEvent.click(removeBtn)
    expect(screen.getByRole("button", { name: /confirmar eliminación/i })).toBeInTheDocument()
    await userEvent.click(screen.getByRole("button", { name: /confirmar eliminación/i }))
    expect(removeFromCart).toHaveBeenCalledWith("item-1")
  })

  it("renderiza botón WhatsApp", () => {
    render(<CartDrawer {...defaultProps} />)
    expect(screen.getByText("Preguntar por WhatsApp")).toBeInTheDocument()
  })

  it("renderiza links Ver carrito y Checkout", () => {
    render(<CartDrawer {...defaultProps} />)
    expect(screen.getByRole("link", { name: /ver carrito/i })).toHaveAttribute("href", "/carrito")
    expect(screen.getByRole("link", { name: /checkout/i })).toHaveAttribute("href", "/checkout")
  })

  it("botón cerrar carrito funciona", async () => {
    const onClose = vi.fn()
    render(<CartDrawer isOpen={true} onClose={onClose} />)
    const closeBtn = screen.getByRole("button", { name: /cerrar carrito/i })
    await userEvent.click(closeBtn)
    expect(onClose).toHaveBeenCalled()
  })

  it("no renderiza nada cuando isOpen es false", () => {
    render(<CartDrawer isOpen={false} onClose={vi.fn()} />)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })
})
