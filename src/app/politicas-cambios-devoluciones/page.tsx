import type { Metadata } from "next"
import PoliticasClient from "./PoliticasClient"

export const metadata: Metadata = {
  title: "Política de Cambios y Devoluciones | Dubraska Mago®",
  description: "Política de cambios y devoluciones. 7 días para devolver tu pedido si llega dañado por el envío.",
}

export default function PoliticasPage() {
  return <PoliticasClient />
}
