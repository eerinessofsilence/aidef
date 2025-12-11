import Hero from "../../components/Hero";
import DroneCarousel from "../../components/DroneCarousel";
import FocusAreas from "../../components/FocusAreas";
import SystemIntegration from "../../components/SystemIntegration";

export default function Home() {
  return (
    <main className="bg-background relative min-h-screen">
      <Hero />
      <DroneCarousel />
      <FocusAreas />
      <SystemIntegration />
    </main>
  );
}
