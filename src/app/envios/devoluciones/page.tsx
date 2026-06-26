import type { Metadata } from "next"
import DevolucionesClient from "./DevolucionesClient"

export const metadata: Metadata = {
  title: "Política de Devoluciones | Dubraska Mago®",
  description:
    "Conoce nuestra política de devoluciones y cambios. Protegemos tu compra con garantía de satisfacción.",
}

export default function DevolucionesPage() {
  return <DevolucionesClient />
}
