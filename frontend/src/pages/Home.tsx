import Hero from "../../components/hero";
import DroneCarouselSection from "../../components/drone-carousel-section";
import FocusAreasSection from "../../components/focus-areas-section";
import OurTeamSection from "../../components/our-team-section";
import OurProductsSection from "../../components/our-products-section";
import GallerySection from "../../components/gallery-section";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <DroneCarouselSection />
      <OurProductsSection />
      <FocusAreasSection />
      <GallerySection />
      <OurTeamSection />
    </main>
  );
}
