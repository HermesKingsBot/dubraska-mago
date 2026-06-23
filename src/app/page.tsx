import VideoBackground from "@/components/VideoBackground";
import NavigationBar from "@/components/NavigationBar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import BestSellers from "@/components/BestSellers";

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

      {/* ===== FUTURE SECTIONS ===== */}
      {/* Categories — coming next */}
      {/* Features — coming next */}
      {/* Color Guide — coming next */}
      {/* Clientes Felices — coming next */}
      {/* Footer — coming next */}
    </div>
  );
}
