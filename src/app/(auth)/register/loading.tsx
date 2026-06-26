import { RegisterFormSkeleton } from "@/components/skeletons/AuthSkeleton"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <RegisterFormSkeleton />
    </div>
  )
}
