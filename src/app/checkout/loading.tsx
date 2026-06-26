import { CheckoutProgressSkeleton, CheckoutFormSkeleton } from "@/components/skeletons/CartSkeleton"
import { OrderSummarySkeleton } from "@/components/skeletons/CheckoutSkeleton"

export default function Loading() {
  return (
    <div className="space-y-8">
      <CheckoutProgressSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CheckoutFormSkeleton />
        </div>
        <div>
          <OrderSummarySkeleton />
        </div>
      </div>
    </div>
  )
}
