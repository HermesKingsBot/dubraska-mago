import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Carrito de Compras | Dubraska Mago®",
  description: "Revisa los productos en tu carrito de compras y procede al checkout. Joyería de lujo en acero inoxidable bañado en oro 18K.",
}

export default function CarritoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
