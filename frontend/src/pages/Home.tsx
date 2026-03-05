import Hero from "../../components/home/Hero";
import DroneCarousel from "../../components/home/DroneCarousel";
import FocusAreas from "../../components/home/FocusAreas";
import SystemIntegration from "../../components/home/SystemIntegration";
import CustomerBenefits from "../../components/home/CustomerBenefits";
import BlogPosts from "../../components/home/BlogPosts";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Hero />
      <DroneCarousel />
      <FocusAreas />
      <SystemIntegration />
      <BlogPosts />
      <CustomerBenefits />
    </main>
  );
}
