import { ProductGallerySkeleton, ProductInfoSkeleton } from "@/components/skeletons/ProductDetailSkeleton"

export default function Loading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <ProductGallerySkeleton />
      <ProductInfoSkeleton />
    </div>
  )
}
