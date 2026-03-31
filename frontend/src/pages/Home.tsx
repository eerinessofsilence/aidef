import { lazy, Suspense } from "react";
import Hero from "../../components/home/Hero";
import { useInViewOnce } from "../../hooks/use-in-view-once";

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
  const { ref: deferredSectionsRef, inView: showDeferredSections } =
    useInViewOnce({
      rootMargin: "0px 0px -35% 0px",
    });

  return (
    <main className="relative min-h-screen">
      <Hero />
      <div ref={deferredSectionsRef} className="h-px w-full" aria-hidden="true" />
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
