import { CartPageSkeleton, CartSummarySkeleton } from "@/components/skeletons/CartSkeleton"

export default function Loading() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <CartPageSkeleton />
      </div>
      <div>
        <CartSummarySkeleton />
      </div>
    </div>
  )
}
