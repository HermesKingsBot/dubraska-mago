"use client"

import { forwardRef } from "react"
import { Product } from "@/types/product"
import ProductCard from "@/components/catalog/ProductCard"

interface RelatedProductsProps {
  relatedProducts: Product[]
}

const RelatedProducts = forwardRef<HTMLDivElement, RelatedProductsProps>(
  function RelatedProducts({ relatedProducts }, ref) {
    if (relatedProducts.length === 0) return null

    return (
      <div ref={ref} className="mt-20">
        <h2
          className="text-2xl sm:text-3xl text-white mb-8"
          style={{ fontFamily: "var(--font-instrument-serif)" }}
        >
          También te puede <em className="text-[#D4AF37]">gustar</em>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
          {relatedProducts.map((rp, i) => (
            <ProductCard key={rp.id} product={rp} index={i} />
          ))}
        </div>
      </div>
    )
  }
)

export default RelatedProducts
