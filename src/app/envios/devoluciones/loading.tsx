import { HeroEnviosSkeleton, EnvioDetalleSkeleton, BannerDevolucionesSkeleton } from "@/components/skeletons/EnviosSkeleton"

export default function Loading() {
  return (
    <div>
      <HeroEnviosSkeleton />
      <EnvioDetalleSkeleton />
      <BannerDevolucionesSkeleton />
    </div>
  )
}
