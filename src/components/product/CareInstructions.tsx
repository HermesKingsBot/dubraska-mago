"use client"

import { Product } from "@/types/product"

interface CareInstructionsProps {
  product: Product & {
    careInstructions: string
  }
  careOpen: boolean
  onToggleCare: () => void
  ref?: React.Ref<HTMLDivElement>
}

function CareInstructions({ product, careOpen, onToggleCare, ref }: CareInstructionsProps): React.JSX.Element {
  return (
    <div ref={ref} className="mt-2">
      <button
        onClick={onToggleCare}
        className="flex items-center justify-between w-full py-3 border-b border-white/10"
      >
        <span
          className="text-sm font-medium text-white"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Cuidados
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`text-[var(--color-muted)] transition-transform duration-200 ${careOpen ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {careOpen && (
        <div className="py-4">
          <div className="flex items-start gap-3">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-gold)"
              strokeWidth="2"
              className="mt-0.5 shrink-0"
            >
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <p
              className="text-sm text-[var(--color-muted)] leading-relaxed"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {product.careInstructions}
            </p>
          </div>
          <ul className="mt-4 space-y-2 ml-8">
            {[
              "Evita contacto con agua salada y cloro",
              "No apliques perfumes o cremas directamente",
              "Guarda en su empaque o bolsa suave",
              "Limpia con paño de microfibra",
            ].map((tip, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-xs text-[var(--color-muted)]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <span className="w-1 h-1 rounded-full bg-[var(--color-gold)] shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default CareInstructions
