"use client"

import { forwardRef } from "react"
import { Product } from "@/types/product"

interface ProductDescriptionProps {
  product: Product & {
    details: string
    dimensions: string
    waterResistant: boolean
  }
  descOpen: boolean
  onToggleDesc: () => void
}

const ProductDescription = forwardRef<HTMLDivElement, ProductDescriptionProps>(
  function ProductDescription({ product, descOpen, onToggleDesc }, ref) {
    return (
      <div ref={ref} className="mt-6">
        <button
          onClick={onToggleDesc}
          className="flex items-center justify-between w-full py-3 border-b border-white/10"
        >
          <span
            className="text-sm font-medium text-white"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Descripción
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`text-[#8A8A8A] transition-transform duration-200 ${descOpen ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {descOpen && (
          <div className="py-4">
            <p
              className="text-sm text-[#8A8A8A] leading-relaxed mb-4"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {product.description}
            </p>
            <p
              className="text-sm text-[#8A8A8A] leading-relaxed mb-6"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {product.details}
            </p>
            <div className="border border-white/5 rounded-lg overflow-hidden">
              <table className="w-full text-sm" style={{ fontFamily: "var(--font-inter)" }}>
                <tbody>
                  {(
                    [
                      ["Material", product.material],
                      ["Medidas", product.dimensions],
                      product.weight ? ["Peso", product.weight] : null,
                      ["Resistencia al agua", product.waterResistant ? "Sí" : "No"],
                      ["Categoría", product.category.charAt(0).toUpperCase() + product.category.slice(1)],
                      ["Color", product.color.charAt(0).toUpperCase() + product.color.slice(1)],
                      ["Garantía", "6 meses"],
                    ] as [string, string][]
                  )
                    .filter((item): item is [string, string] => item !== null)
                    .map(([label, value], i) => (
                      <tr
                        key={i}
                        className={i % 2 === 0 ? "bg-white/[0.02]" : ""}
                      >
                        <td className="px-4 py-2.5 text-[#8A8A8A] border-r border-white/5">
                          {label}
                        </td>
                        <td className="px-4 py-2.5 text-white">{value}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    )
  }
)

export default ProductDescription
