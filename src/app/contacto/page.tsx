import type { Metadata } from "next"
import ContactClient from "./ContactClient"

export const metadata: Metadata = {
  title: "Contacto | Dubraska Mago®",
  description: "Contáctanos por WhatsApp, email o Instagram. Estamos para atenderte. Envíos a toda Venezuela.",
}

export default function ContactoPage() {
  return <ContactClient />
}
