import type { Metadata } from "next"
import EnviosClient from "./EnviosClient"

export const metadata: Metadata = {
  title: "Envíos | Dubraska Mago®",
  description: "Envíos nacionales por MRW, Zoom, TEALCA y Domesa. Cobro destino. Recibe tu joya en cualquier rincón de Venezuela.",
}

export default function EnviosPage() {
  return <EnviosClient />
}
