import type { Metadata } from "next"
import PrivacidadClient from "./PrivacidadClient"

export const metadata: Metadata = {
  title: "Política de Privacidad | Dubraska Mago®",
  description: "Conoce cómo protegemos tus datos personales en Dubraska Mago. Compromiso con la seguridad y privacidad de tu información.",
}

export default function PrivacidadPage() {
  return <PrivacidadClient />
}
