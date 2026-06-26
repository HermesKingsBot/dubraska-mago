import type { Metadata } from "next"
import "../globals.css"

export const metadata: Metadata = {
  title: {
    default: "Iniciar Sesión | Dubraska Mago®",
    template: "%s | Dubraska Mago®",
  },
  description: "Accede a tu cuenta de Dubraska Mago®. Joyería de lujo en acero y oro 18K.",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-px bg-[var(--color-gold)] mx-auto mb-6" />
          <h1 className="text-2xl font-light tracking-[0.2em] text-[var(--color-white)]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            DUBRASKA MAGO®
          </h1>
          <div className="w-12 h-px bg-[var(--color-gold)] mx-auto mt-6" />
        </div>
        {children}
      </div>
    </div>
  )
}
