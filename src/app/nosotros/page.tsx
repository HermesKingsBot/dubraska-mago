import type { Metadata } from "next"
import NosotrosClient from "./NosotrosClient"

export const metadata: Metadata = {
  title: "Sobre Mí | Dubraska Mago®",
  description: "Conoce la historia detrás de Dubraska Mago. Joyería de lujo en acero inoxidable bañado en oro 18K, diseñada para mujeres que brillan con fuerza.",
}

export default function NosotrosPage() {
  return <NosotrosClient />
}
