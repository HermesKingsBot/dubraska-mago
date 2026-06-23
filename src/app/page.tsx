import VideoBackground from "@/components/VideoBackground";
import NavigationBar from "@/components/NavigationBar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import BestSellers from "@/components/BestSellers";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturesSection from "@/components/FeaturesSection";
import ColorGuideSection from "@/components/ColorGuideSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative w-full bg-[#050505]">
      {/* ===== HERO SECTION (full viewport) ===== */}
      <section className="relative h-screen w-full overflow-hidden">
        <VideoBackground />
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, #050505 0%, rgba(5,5,5,0.4) 30%, rgba(5,5,5,0.5) 60%, #050505 100%)",
          }}
        />
        <NavigationBar />
        <HeroSection />
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <AboutSection />

      {/* ===== BEST SELLERS ===== */}
      <BestSellers />

      {/* ===== CATEGORIES ===== */}
      <CategoriesSection />

      {/* ===== FEATURES (Calidad) ===== */}
      <FeaturesSection />

      {/* ===== COLOR GUIDE ===== */}
      <ColorGuideSection />

      {/* ===== TESTIMONIOS ===== */}
      <TestimonialsSection />

      {/* ===== FOOTER ===== */}
      <Footer />
    </div>
  );
}
