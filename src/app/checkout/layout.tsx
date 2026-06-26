import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Checkout | Dubraska Mago®",
  description: "Finaliza tu compra de joyería de lujo de forma segura. Envíos a toda Venezuela.",
}

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
