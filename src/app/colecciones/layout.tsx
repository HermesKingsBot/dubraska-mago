import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Colecciones | DUBRASKA MAGO®",
  description:
    "Explora nuestra colección de joyería en acero inoxidable bañado en oro 18K. Collares, pulseras, aretes y sets para toda ocasión.",
}

export default function ColeccionesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-[#050505]">
      {children}
    </main>
  )
}
