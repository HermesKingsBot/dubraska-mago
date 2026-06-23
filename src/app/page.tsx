import VideoBackground from "@/components/VideoBackground";
import NavigationBar from "@/components/NavigationBar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";

export default function Home() {
  return (
    <div className="relative w-full bg-[#050505]">
      {/* ===== HERO SECTION (full viewport) ===== */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Layer 0: Video Background */}
        <VideoBackground />

        {/* Layer 1: Gradient Overlay */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, #050505 0%, rgba(5,5,5,0.4) 30%, rgba(5,5,5,0.5) 60%, #050505 100%)",
          }}
        />

        {/* Layer 2: Navigation */}
        <NavigationBar />

        {/* Layer 3: Hero Content */}
        <HeroSection />
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <AboutSection />

      {/* ===== FUTURE SECTIONS ===== */}
      {/* Best Sellers — coming next */}
      {/* Categories — coming next */}
      {/* Features — coming next */}
      {/* Color Guide — coming next */}
      {/* Clientes Felices — coming next */}
      {/* Footer — coming next */}
    </div>
  );
}
