"use client"

import { Product } from "@/types/product"
import ProductCard from "@/components/catalog/ProductCard"

interface CustomersAlsoBoughtProps {
  products: Product[]
  ref?: React.Ref<HTMLDivElement>
}

function CustomersAlsoBought({ products, ref }: CustomersAlsoBoughtProps): React.JSX.Element {
  if (products.length === 0) return <></>

  return (
    <div ref={ref} className="mt-16">
      <h2
        className="text-2xl sm:text-3xl text-white mb-4"
        style={{ fontFamily: "var(--font-instrument-serif)" }}
      >
        Los clientes también <em className="text-[var(--color-gold)]">compraron</em>
      </h2>

      <div className="p-4 rounded-xl bg-[var(--color-dark-card)] border border-white/5 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
          </svg>
          <span
            className="text-sm text-[var(--color-gold)] font-medium"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Comprados juntos frecuentemente
          </span>
        </div>
        <p
          className="text-xs text-[var(--color-muted)]"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Compra 2 y obtén 10% de descuento en tu pedido
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
        {products.slice(0, 3).map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </div>
  )
}

export default CustomersAlsoBought
