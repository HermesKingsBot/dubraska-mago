import { FilterBarSkeleton, ProductGridSkeleton } from "@/components/skeletons/CatalogSkeleton"

export default function Loading() {
  return (
    <div>
      <FilterBarSkeleton />
      <ProductGridSkeleton />
    </div>
  )
}
