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
    if (typeof window === "undefined") {
      return;
    }

    const revealSections = () => setShowDeferredSections(true);

    if ("requestIdleCallback" in window) {
      const idleCallbackId = window.requestIdleCallback(revealSections, {
        timeout: 1200,
      });
      return () => window.cancelIdleCallback(idleCallbackId);
    }

    const timeoutId = setTimeout(revealSections, 400);
    return () => clearTimeout(timeoutId);
  }, []);

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
