import { WishlistSkeleton } from "@/components/skeletons/CustomerAccountSkeleton"

export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <WishlistSkeleton />
    </div>
  )
}
