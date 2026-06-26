"use client"

interface CartItem {
  id: string
  productId: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    image: string
  }
}

interface OrderSummaryProps {
  items: CartItem[]
  shippingCost: number
  subtotal: number
}

export default function OrderSummary({
  items,
  shippingCost,
  subtotal,
}: OrderSummaryProps) {
  const total = subtotal + shippingCost

  return (
    <div
      className="rounded-xl p-5 space-y-4"
      style={{ backgroundColor: "var(--color-dark-card)" }}
    >
      <h3
        className="text-lg font-semibold"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Resumen del pedido
      </h3>

      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0"
              style={{ backgroundColor: "var(--color-dark-accent)" }}
            >
              {item.product.image && (
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[var(--color-white)] truncate">
                {item.product.name}
              </p>
              <p className="text-xs text-[var(--color-muted)]">
                {item.quantity} x ${Number(item.product.price).toFixed(2)}
              </p>
            </div>
            <p className="text-sm font-medium text-[var(--color-white)]">
              ${(Number(item.product.price) * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 pt-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--color-muted)]">Subtotal</span>
          <span className="text-[var(--color-white)]">
            ${subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--color-muted)]">Envío</span>
          <span className="text-[var(--color-white)]">
            {shippingCost === 0 ? "Gratis" : `$${shippingCost.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-base font-semibold pt-1">
          <span className="text-[var(--color-white)]">Total</span>
          <span className="text-[var(--color-gold)]">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}
