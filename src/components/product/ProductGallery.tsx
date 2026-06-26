"use client"

import { useCallback } from "react"

const GALLERY_LABELS = [
  "Vista principal",
  "Detalle de material",
  "Visto en persona",
  "Referencia de tamaño",
]

interface ProductGalleryProps {
  gallery: string[]
  selectedImage: number
  onSelectImage: (index: number) => void
  badge?: string | null
  discount?: number | null
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void
  onMouseLeave: () => void
  zoomRef?: React.Ref<HTMLDivElement>
  ref?: React.Ref<HTMLDivElement>
}

function ProductGallery({
  gallery,
  selectedImage,
  onSelectImage,
  badge,
  discount,
  onMouseMove,
  onMouseLeave,
  zoomRef,
  ref,
}: ProductGalleryProps): React.JSX.Element {
  return (
    <div ref={ref}>
      <div
        className="relative aspect-square rounded-xl overflow-hidden bg-[var(--color-dark-card)] border border-white/5 cursor-crosshair"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-oklch(0.2 0.02 60) via-[var(--color-dark-card)] to-[var(--color-bg)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--color-gold)]/20 to-[var(--color-gold)]/5 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <span className="text-xs text-[var(--color-muted)] block" style={{ fontFamily: "var(--font-dm-sans)" }}>
              {GALLERY_LABELS[selectedImage]}
            </span>
          </div>
        </div>
        <div
          ref={zoomRef}
          className="absolute inset-0 bg-gradient-to-br from-[var(--color-gold)]/5 to-transparent pointer-events-none transition-opacity duration-200"
          style={{ opacity: 0 }}
        />
        {badge && (
          <span
            className={`absolute top-4 left-4 px-3 py-1.5 text-[11px] font-semibold tracking-wider rounded ${
              badge === "OFERTA"
                ? "bg-red-500/90 text-white"
                : badge === "NUEVO"
                ? "bg-[var(--color-gold)] text-[var(--color-bg)]"
                : badge === "LIMITADO"
                ? "bg-white/10 text-white border border-white/20"
                : "bg-[var(--color-gold)]/90 text-[var(--color-bg)]"
            }`}
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {badge}
          </span>
        )}
        {discount && (
          <span
            className="absolute top-4 right-4 px-3 py-1.5 text-[11px] font-bold bg-red-500 text-white rounded"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            -{discount}%
          </span>
        )}
      </div>

      <div className="flex gap-3 mt-4">
        {gallery.slice(0, 4).map((_, i) => (
          <button
            key={i}
            onClick={() => onSelectImage(i)}
            className={`relative w-full aspect-square max-w-[100px] rounded-lg overflow-hidden border-2 transition-all duration-200 ${
              selectedImage === i
                ? "border-[var(--color-gold)] shadow-[0_0_12px_rgba(212,175,55,0.3)]"
                : "border-white/10 hover:border-white/30"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-oklch(0.2 0.02 60) via-[var(--color-dark-card)] to-[var(--color-bg)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[9px] text-[var(--color-muted)] text-center px-1" style={{ fontFamily: "var(--font-dm-sans)" }}>
                {GALLERY_LABELS[i]}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ProductGallery
