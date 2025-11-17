"use client";

import { useCallback, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DRONE_SLIDES = [
  {
    name: "AX1",
    description:
      "Electric kamikaze platform engineered for stealth strikes across 15 km corridors with AI-guided approach vectors.",
    stats: ["48MP", "MD550"],
    image: "/our-products-drone-1.png",
    imageAlt: "AX1 tactical drone",
    cta: "#",
  },
  {
    name: "AX2NG",
    description:
      "Next-generation jet craft pairs ram-air propulsion with onboard autonomy for deep strike saturation missions.",
    stats: ["JET", "AI OPS"],
    image: "/our-products-drone-2.png",
    imageAlt: "AX2NG jet powered drone",
    cta: "#",
  },
  {
    name: "AV-1",
    description:
      "Hybrid VTOL aircraft covering ISR sweeps and precision supply drops with 65-minute loiter endurance.",
    stats: ["65 MIN", "VTOL"],
    image: "/our-products-drone-3.png",
    imageAlt: "AV-1 VTOL aircraft",
    cta: "#",
  },
] as const;

export default function DroneCarouselSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const slideCount = DRONE_SLIDES.length;

  const showNextSlide = useCallback(() => {
    setActiveIndex((index) => (index + 1) % slideCount);
  }, [slideCount]);

  const showPreviousSlide = useCallback(() => {
    setActiveIndex((index) => (index - 1 + slideCount) % slideCount);
  }, [slideCount]);

  return (
    <section
      id="drone-carousel-section"
      className="relative bg-[url('/site-bg.png')] bg-cover bg-center px-10 py-25 max-[400px]:px-0 max-xl:py-12.5"
    >
      <div className="backdrop-blur-px absolute -top-6 right-0 left-0 z-1 h-16 bg-linear-to-t from-[#2F4B75]/0 via-[#314D77] to-[#2A456A]/0" />
      <div className="relative container mx-auto">
        <div className="relative overflow-hidden">
          <div
            className="flex w-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {DRONE_SLIDES.map((slide, index) => (
              <div
                key={slide.name}
                className="flex w-full shrink-0 justify-center"
                aria-hidden={activeIndex !== index}
              >
                <div className="relative mx-auto aspect-1140/640 w-full bg-[url(/drone-carousel-bg.svg)] bg-cover bg-center bg-no-repeat max-lg:aspect-335/610 max-lg:w-auto max-lg:bg-[url(/drone-carousel-bg-mobile.svg)]">
                  <div className="flex justify-between max-lg:flex-col-reverse">
                    <div className="max-lg:mx-auto max-lg:text-center max-md:space-y-4 lg:mt-55 lg:ml-10 xl:mt-85 xl:ml-15 2xl:mt-100 2xl:ml-25">
                      <h1 className="text-background mb-3 text-6xl font-bold">
                        {slide.name}
                      </h1>
                      <p className="text-background/70 mb-10 max-w-115 text-lg leading-[31px] tracking-wide max-lg:max-w-65 max-lg:text-lg max-lg:leading-6 max-lg:text-balance">
                        {slide.description}
                      </p>
                      <a
                        href={slide.cta}
                        className="text-foreground bg-background rounded-[9px] px-[30px] py-[22.5px] text-lg font-bold uppercase transition-all duration-300 hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.35),inset_0_-6px_20px_rgba(0,0,0,0.45)] active:scale-[0.93] active:shadow-[inset_0_1px_6px_rgba(255,255,255,0.4),inset_0_-6px_18px_rgba(0,0,0,0.7)] max-md:px-[25px] max-md:py-[17.5px] max-md:text-base"
                      >
                        View
                      </a>
                    </div>

                    <div className="mx-auto mt-20 flex w-full items-center justify-center max-lg:mt-30 max-lg:mb-15 max-md:mt-30 max-sm:mt-20">
                      <img
                        src={slide.image}
                        className="h-96 w-auto max-w-full max-lg:h-60 max-md:h-52 max-sm:h-44"
                        alt={slide.imageAlt}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            aria-label="Show previous drone"
            onClick={showPreviousSlide}
            className="bg-background text-text hover:bg-background/80 focus-visible:outline-background/60 absolute top-1/2 left-6 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-colors duration-300 max-md:h-10 max-md:w-10 max-sm:left-2"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            aria-label="Show next drone"
            onClick={showNextSlide}
            className="bg-background text-text hover:bg-background/80 focus-visible:outline-background/60 absolute top-1/2 right-6 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-colors duration-300 max-md:h-10 max-md:w-10 max-sm:right-2"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
