import VideoBackground from "@/components/VideoBackground"
import HeroSection from "@/components/HeroSection"
import AboutSection from "@/components/AboutSection"
import BestSellers from "@/components/BestSellers"
import CategoriesSection from "@/components/CategoriesSection"
import FeaturesSection from "@/components/FeaturesSection"
import ColorGuideSection from "@/components/ColorGuideSection"
import TestimonialsSection from "@/components/TestimonialsSection"
import StructuredData from "@/components/StructuredData"

const organizationData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Dubraska Mago",
  url: "https://dubraska-mago.vercel.app",
  logo: "https://dubraska-mago.vercel.app/logo.png",
  description: "Joyería de lujo en acero inoxidable bañado en oro 18K",
  address: {
    "@type": "PostalAddress",
    addressCountry: "VE",
    addressLocality: "Venezuela",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+58-414-123-4567",
    contactType: "sales",
    availableLanguage: ["Spanish"],
  },
  sameAs: [
    "https://instagram.com/dubraskamago",
    "https://facebook.com/dubraskamago",
  ],
}

const websiteData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Dubraska Mago",
  url: "https://dubraska-mago.vercel.app",
  potentialAction: {
    "@type": "SearchAction",
    target:
      "https://dubraska-mago.vercel.app/colecciones?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
}

export default function Home() {
  return (
    <div className="relative w-full bg-[var(--color-bg)]">
      <section className="relative h-screen w-full overflow-hidden">
        <VideoBackground />
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, var(--color-bg) 0%, rgba(5,5,5,0.4) 30%, rgba(5,5,5,0.5) 60%, var(--color-bg) 100%)",
          }}
        />
        <HeroSection />
      </section>

      <AboutSection />
      <BestSellers />
      <CategoriesSection />
      <FeaturesSection />
      <ColorGuideSection />
      <TestimonialsSection />

      <StructuredData data={organizationData} />
      <StructuredData data={websiteData} />
    </div>
  )
}
