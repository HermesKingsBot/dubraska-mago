import { AddressListSkeleton } from "@/components/skeletons/CustomerAccountSkeleton"

export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <AddressListSkeleton />
    </div>
  )
}
