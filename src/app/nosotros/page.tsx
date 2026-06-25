import type { Metadata } from "next"
import NosotrosClient from "./NosotrosClient"

export const metadata: Metadata = {
  title: "Nuestra Historia | Dubraska Mago®",
  description:
    "Conoce la historia detrás de Dubraska Mago. Piezas creadas con pasión y dedicación en Venezuela.",
}

export default function NosotrosPage() {
  return <NosotrosClient />
}
