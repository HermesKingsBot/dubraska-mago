import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Política de Privacidad | Dubraska Mago",
  description:
    "Conoce cómo Dubraska Mago recopila, usa y protege tu información personal. Política de privacidad completa para nuestro e-commerce de joyería de lujo.",
}

export default function PrivacidadLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
