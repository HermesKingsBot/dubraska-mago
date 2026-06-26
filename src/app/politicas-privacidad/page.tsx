import type { Metadata } from "next"
import PrivacidadClient from "./PrivacidadClient"

export const metadata: Metadata = {
  title: "Política de Privacidad | Dubraska Mago®",
  description:
    "Conoce cómo recopilamos, usamos y protegemos tu información personal en Dubraska Mago.",
}

export default function PrivacidadPage() {
  return <PrivacidadClient />
}
