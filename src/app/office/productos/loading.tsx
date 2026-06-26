import { ProductListSkeleton } from "@/components/skeletons/OfficeSkeleton"

export default function Loading() {
  return (
    <div className="p-6">
      <ProductListSkeleton />
    </div>
  )
}
