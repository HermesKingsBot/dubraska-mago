import type { Metadata } from "next"
import PoliticasClient from "./PoliticasClient"

export const metadata: Metadata = {
  title: "Políticas de Cambios y Devoluciones | Dubraska Mago®",
  description:
    "Conoce nuestras políticas de cambios, devoluciones, envíos y cuidados de las piezas.",
}

export default function PoliticasPage() {
  return <PoliticasClient />
}
