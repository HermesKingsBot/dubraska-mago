import type { Metadata, Viewport } from "next"
import { Instrument_Serif, Inter } from "next/font/google"
import "./globals.css"
import NavigationBar from "@/components/NavigationBar"
import Footer from "@/components/Footer"
import { AuthProvider } from "@/context/AuthContext"
import { CustomerAuthProvider } from "@/context/CustomerAuthContext"
import { SettingsProvider } from "@/context/SettingsContext"
import { getServerSettings } from "@/lib/server-settings"

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

export async function generateMetadata(): Promise<Metadata> {
  const s = await getServerSettings()
  const name = s.company_name || "Dubraska Mago"
  const slogan = s.company_slogan || "Joyería de Lujo en Acero y Oro 18K"
  const desc = s.company_description || "Descubre la colección de joyería de lujo. Acero inoxidable bañado en oro 18K."
  const siteUrl = "https://dubraska-mago.vercel.app"

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${name}® | ${slogan}`,
      template: `%s | ${name}®`,
    },
    description: desc,
    keywords: [
      "joyería de lujo",
      "acero inoxidable oro 18k",
      "collares",
      "pulseras",
      "aretes",
      "sets de joyería",
      "joyería venezolana",
      name,
      "joyería minimalista",
      "regalos para ella",
      "joyería online venezuela",
      "comprar joyas online",
    ],
    authors: [{ name, url: siteUrl }],
    creator: name,
    publisher: name,
    formatDetection: {
      email: false,
      address: false,
      telephone: true,
    },
    alternates: {
      canonical: siteUrl,
      languages: {
        "es-VE": siteUrl,
      },
    },
    openGraph: {
      type: "website",
      locale: "es_VE",
      url: siteUrl,
      siteName: `${name}®`,
      title: `${name}® | ${slogan}`,
      description: desc,
      images: [
        {
          url: `${siteUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: `${name}® — Joyería de Lujo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name}® | Joyería de Lujo`,
      description: `${slogan}. Acero inoxidable bañado en oro 18K.`,
      images: [`${siteUrl}/og-image.jpg`],
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
            <SettingsProvider>
              <NavigationBar />
              <main>{children}</main>
              <Footer />
            </SettingsProvider>
          </CustomerAuthProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
