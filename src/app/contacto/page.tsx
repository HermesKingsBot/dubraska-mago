import type { Metadata } from "next"
import ContactClient from "./ContactClient"

export const metadata: Metadata = {
  title: "Contacto | Dubraska Mago®",
  description:
    "Contáctanos para consultas, pedidos personalizados o soporte. Estamos aquí para ayudarte.",
}

export default function ContactoPage() {
  return <ContactClient />
}
