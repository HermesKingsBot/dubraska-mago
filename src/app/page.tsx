import VideoBackground from "@/components/VideoBackground";
import NavigationBar from "@/components/NavigationBar";
import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#050505]">
      {/* Layer 0: Video Background */}
      <VideoBackground />

      {/* Layer 1: Gradient Overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, #050505 0%, rgba(5,5,5,0.6) 50%, #050505 100%)",
        }}
      />

      {/* Layer 2: Navigation */}
      <NavigationBar />

      {/* Layer 3: Hero Content */}
      <HeroSection />
    </main>
  );
}
