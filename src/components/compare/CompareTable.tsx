"use client"

import { Product } from "@/types/product"
import { useCompare } from "@/context/CompareContext"
import RatingStars from "@/components/product/reviews/RatingStars"

interface CompareTableProps {
  products: Product[]
}

interface Row {
  label: string
  key: string
  render: (p: Product) => React.ReactNode
}

const ROWS: Row[] = [
  {
    label: "Imagen",
    key: "image",
    render: (p) => (
      <img src={p.image} alt={p.name} className="w-full aspect-square object-cover rounded-lg" />
    ),
  },
  {
    label: "Nombre",
    key: "name",
    render: (p) => (
      <span className="text-white text-sm font-medium" style={{ fontFamily: "var(--font-inter)" }}>
        {p.name}
      </span>
    ),
  },
  {
    label: "Precio",
    key: "price",
    render: (p) => (
      <span className="text-[var(--color-gold)] text-lg font-semibold" style={{ fontFamily: "var(--font-inter)" }}>
        ${(p.price ?? 0).toFixed(2)}
      </span>
    ),
  },
  {
    label: "Material",
    key: "material",
    render: (p) => (
      <span className="text-sm text-[var(--color-muted)]" style={{ fontFamily: "var(--font-inter)" }}>
        {p.material}
      </span>
    ),
  },
  {
    label: "Color",
    key: "color",
    render: (p) => (
      <span className="text-sm text-[var(--color-muted)]" style={{ fontFamily: "var(--font-inter)" }}>
        {p.color ? p.color.charAt(0).toUpperCase() + p.color.slice(1) : "—"}
      </span>
    ),
  },
  {
    label: "Dimensiones",
    key: "dimensions",
    render: (p) => (
      <span className="text-sm text-[var(--color-muted)]" style={{ fontFamily: "var(--font-inter)" }}>
        {(p as any).dimensions || "—"}
      </span>
    ),
  },
  {
    label: "Peso",
    key: "weight",
    render: (p) => (
      <span className="text-sm text-[var(--color-muted)]" style={{ fontFamily: "var(--font-inter)" }}>
        {p.weight || "—"}
      </span>
    ),
  },
  {
    label: "Categoría",
    key: "category",
    render: (p) => (
      <span className="text-sm text-[var(--color-muted)]" style={{ fontFamily: "var(--font-inter)" }}>
        {p.category}
      </span>
    ),
  },
  {
    label: "Stock",
    key: "stock",
    render: (p) => (
      <span className={`text-sm ${p.inStock ? "text-green-400" : "text-red-400"}`} style={{ fontFamily: "var(--font-inter)" }}>
        {p.inStock ? `Disponible (${p.stock})` : "Agotado"}
      </span>
    ),
  },
  {
    label: "SKU",
    key: "sku",
    render: (p) => (
      <span className="text-xs text-[var(--color-muted)]" style={{ fontFamily: "var(--font-inter)" }}>
        {p.sku}
      </span>
    ),
  },
]

export default function CompareTable({ products }: CompareTableProps) {
  const { removeFromCompare } = useCompare()

  const diffKeys = new Set<string>()
  ROWS.forEach((row) => {
    if (row.key === "image") return
    const vals = products.map((p) => {
      const val = (p as any)[row.key]
      return typeof val === "number" ? val : String(val || "")
    })
    if (new Set(vals).size > 1) diffKeys.add(row.key)
  })

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px]">
        <div className="grid gap-4" style={{ gridTemplateColumns: `120px repeat(${products.length}, 1fr)` }}>
          {ROWS.map((row) => (
            <>
              <div
                key={`label-${row.key}`}
                className="flex items-center p-3 text-xs text-[var(--color-muted)] font-medium sticky left-0 bg-[var(--color-bg)] z-10"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {row.label}
              </div>
              {products.map((product) => (
                <div
                  key={`${row.key}-${product.id}`}
                  className={`p-3 rounded-lg ${
                    diffKeys.has(row.key) ? "bg-[var(--color-gold)]/5 border border-[var(--color-gold)]/10" : ""
                  }`}
                >
                  {row.render(product)}
                </div>
              ))}
            </>
          ))}
        </div>
      </div>
    </div>
  )
}
