import Hero from "../../components/hero";
import DroneCarouselSection from "../../components/drone-carousel-section";
import FocusAreasSection from "../../components/focus-areas-section";
import SystemIntegrationSection from "../../components/system-integration-section";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#201E5F]">
      <Hero />
      <DroneCarouselSection />
      <FocusAreasSection />
      <SystemIntegrationSection />
    </main>
  );
}
