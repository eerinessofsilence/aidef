import Hero from "../../components/Hero";
import DroneCarousel from "../../components/DroneCarousel";
import FocusAreas from "../../components/FocusAreas";
import SystemIntegration from "../../components/SystemIntegration";
import CustomerBenefits from "../../components/CustomerBenefits";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Hero />
      <DroneCarousel />
      <FocusAreas />
      <SystemIntegration />
      <CustomerBenefits />
    </main>
  );
}
