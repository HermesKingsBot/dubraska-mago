import type { Metadata } from "next"
import { Instrument_Serif, Inter } from "next/font/google"
import "./globals.css"
import NavigationBar from "@/components/NavigationBar"
import Footer from "@/components/Footer"

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-instrument-serif",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Dubraska Mago® | Joyería de Lujo",
  description:
    "Acero inoxidable bañado en oro 18K. Piezas mínimas, atemporales y hechas para tu día a día.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${instrumentSerif.variable} ${inter.variable}`}>
      <body className="bg-[var(--color-bg)] text-white antialiased">
        <NavigationBar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
