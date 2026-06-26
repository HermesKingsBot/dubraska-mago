import type { Metadata } from "next"
import EnviosClient from "./EnviosClient"

export const metadata: Metadata = {
  title: "Envíos | Dubraska Mago®",
  description:
    "Conoce nuestras opciones de envío nacional para joyería de lujo. Envíos seguros con cobro destino a toda Venezuela.",
}

export default function EnviosPage() {
  return <EnviosClient />
}
