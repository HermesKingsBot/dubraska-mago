import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { OfficeAuthProvider } from "@/context/OfficeAuthContext"
import OfficeLayout from "@/components/office/OfficeLayout"

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Dubraska Mago® — Admin",
  description: "Panel de administración Dubraska Mago",
}

function OfficeRootLayout({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <html lang="es" className={inter.variable}>
      <body className="bg-[var(--color-bg)] text-white antialiased">
        <OfficeAuthProvider>
          <OfficeLayout>{children}</OfficeLayout>
        </OfficeAuthProvider>
      </body>
    </html>
  )
}

export default OfficeRootLayout
