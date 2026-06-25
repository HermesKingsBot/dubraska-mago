import type { Metadata, Viewport } from "next"
import { Instrument_Serif, Inter } from "next/font/google"
import "./globals.css"
import NavigationBar from "@/components/NavigationBar"
import Footer from "@/components/Footer"
import { AuthProvider } from "@/context/AuthContext"
import { CustomerAuthProvider } from "@/context/CustomerAuthContext"

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

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL("https://dubraska-mago.vercel.app"),
  title: {
    default: "Dubraska Mago® | Joyería de Lujo en Acero y Oro 18K",
    template: "%s | Dubraska Mago®",
  },
  description:
    "Descubre la colección de joyería de lujo Dubraska Mago. Acero inoxidable bañado en oro 18K. Piezas mínimas, atemporales y hechas para tu día a día. Envíos a toda Venezuela.",
  keywords: [
    "joyería de lujo",
    "acero inoxidable oro 18k",
    "collares",
    "pulseras",
    "aretes",
    "sets de joyería",
    "joyería venezolana",
    "Dubraska Mago",
    "joyería minimalista",
    "regalos para ella",
    "joyería online venezuela",
    "comprar joyas online",
  ],
  authors: [{ name: "Dubraska Mago", url: "https://dubraska-mago.vercel.app" }],
  creator: "Dubraska Mago",
  publisher: "Dubraska Mago",
  formatDetection: {
    email: false,
    address: false,
    telephone: true,
  },
  alternates: {
    canonical: "https://dubraska-mago.vercel.app",
    languages: {
      "es-VE": "https://dubraska-mago.vercel.app",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_VE",
    url: "https://dubraska-mago.vercel.app",
    siteName: "Dubraska Mago®",
    title: "Dubraska Mago® | Joyería de Lujo en Acero y Oro 18K",
    description:
      "Descubre la colección de joyería de lujo Dubraska Mago. Acero inoxidable bañado en oro 18K. Piezas mínimas, atemporales y hechas para tu día a día.",
    images: [
      {
        url: "https://dubraska-mago.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dubraska Mago® — Joyería de Lujo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dubraska Mago® | Joyería de Lujo",
    description:
      "Acero inoxidable bañado en oro 18K. Piezas mínimas, atemporales.",
    images: ["https://dubraska-mago.vercel.app/og-image.jpg"],
    creator: "@dubraskamago",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "shopping",
  classification: "Jewelry Store",
  verification: {
    google: "GOOGLE_VERIFICATION_CODE",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${instrumentSerif.variable} ${inter.variable}`}>
      <body className="bg-[var(--color-bg)] text-white antialiased">
        <AuthProvider>
          <CustomerAuthProvider>
            <NavigationBar />
            <main>{children}</main>
            <Footer />
          </CustomerAuthProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
