import { lazy, Suspense, useEffect, useState } from "react";
import Hero from "../../components/home/Hero";

const DroneCarousel = lazy(() => import("../../components/home/DroneCarousel"));
const FocusAreas = lazy(() => import("../../components/home/FocusAreas"));
const SystemIntegration = lazy(
  () => import("../../components/home/SystemIntegration"),
);
const CustomerBenefits = lazy(
  () => import("../../components/home/CustomerBenefits"),
);
const BlogPosts = lazy(() => import("../../components/home/BlogPosts"));

function HomeSectionsFallback() {
  return <div className="min-h-[120vh]" aria-hidden="true" />;
}

export default function Home() {
  const [showDeferredSections, setShowDeferredSections] = useState(false);

  useEffect(() => {
    if (showDeferredSections || typeof window === "undefined") {
      return;
    }

    const revealSections = () => setShowDeferredSections(true);
    const revealThreshold = Math.max(96, Math.round(window.innerHeight * 0.2));
    const handleScroll = () => {
      if (window.scrollY >= revealThreshold) {
        revealSections();
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showDeferredSections]);

  return (
    <main className="relative min-h-screen">
      <Hero />
      {showDeferredSections ? (
        <Suspense fallback={<HomeSectionsFallback />}>
          <DroneCarousel />
          <FocusAreas />
          <SystemIntegration />
          <BlogPosts />
          <CustomerBenefits />
        </Suspense>
      ) : (
        <HomeSectionsFallback />
      )}
    </main>
  );
}
