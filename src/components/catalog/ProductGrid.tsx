"use client";

import { Product } from "@/types/product";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  layout: 4 | 2 | 1;
}

export default function ProductGrid({ products, layout }: ProductGridProps) {
  const gridClass =
    layout === 4
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      : layout === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : "grid-cols-1";

  return (
    <div className={`grid ${gridClass} gap-4 sm:gap-6`}>
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
