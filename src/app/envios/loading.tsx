import { HeroEnviosSkeleton, TransportadorasSkeleton } from "@/components/skeletons/EnviosSkeleton"

export default function Loading() {
  return (
    <div>
      <HeroEnviosSkeleton />
      <TransportadorasSkeleton />
    </div>
  )
}
