import Hero from "../../components/hero";
import MissionSection from "../../components/mission-section";
import FocusAreasSection from "../../components/focus-areas-section";
import TeamSection from "../../components/team-section";
import VideoSection from "../../components/video-section";
import DroneVariant from "../../components/drone-variant";
import DroneGrid from "../../components/drone-grid";
import GallerySection from "../../components/gallery-section";

export default function Home() {
  return (
    <main className="bg-background min-h-screen">
      <Hero />
      <MissionSection />
      <DroneGrid />
      <GallerySection />
      <FocusAreasSection />
      <VideoSection />
      <TeamSection />
      <DroneVariant />
    </main>
  );
}
