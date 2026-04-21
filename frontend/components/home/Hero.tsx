"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { dispatchOpenContactModal } from "../../lib/contact-modal";

const backgroundImages = [
  "/hero-bg-1.jpg",
  "/hero-bg-2.jpg",
  "/hero-bg-3.jpg",
  "/hero-bg-4.jpg",
  "/hero-bg-5.jpg",
];

const FADE_DURATION_MS = 1000;
const HERO_IMAGE_WIDTH = 1440;
const HERO_IMAGE_HEIGHT = 900;
const HERO_IMAGE_PROPS = {
  width: HERO_IMAGE_WIDTH,
  height: HERO_IMAGE_HEIGHT,
  sizes: "100vw",
  style: { aspectRatio: `${HERO_IMAGE_WIDTH} / ${HERO_IMAGE_HEIGHT}` },
} as const;

export default function Hero() {
  const openContactModal = () => dispatchOpenContactModal();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [nextSlide, setNextSlide] = useState<number | null>(null);
  const [isFading, setIsFading] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const { t } = useTranslation();
  const currentImage = backgroundImages[currentSlide] ?? backgroundImages[0];
  const nextSlideAltIndex = nextSlide !== null ? nextSlide + 1 : 1;
  const nextImage =
    nextSlide !== null
      ? (backgroundImages[nextSlide] ?? backgroundImages[0])
      : null;

  useEffect(() => {
    if (hasUserInteracted || typeof window === "undefined") {
      return;
    }

    const handleFirstInteraction = () => {
      setHasUserInteracted(true);
    };

    window.addEventListener("pointerdown", handleFirstInteraction, {
      once: true,
      passive: true,
    });
    window.addEventListener("touchstart", handleFirstInteraction, {
      once: true,
      passive: true,
    });
    window.addEventListener("keydown", handleFirstInteraction, {
      once: true,
    });
    window.addEventListener("scroll", handleFirstInteraction, {
      once: true,
      passive: true,
    });

    return () => {
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      window.removeEventListener("scroll", handleFirstInteraction);
    };
  }, [hasUserInteracted]);

  useEffect(() => {
    if (!hasUserInteracted || nextSlide !== null) {
      return;
    }

    const timer = window.setTimeout(() => {
      setNextSlide((currentSlide + 1) % backgroundImages.length);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [currentSlide, hasUserInteracted, nextSlide]);

  useEffect(() => {
    if (nextSlide === null || nextSlide === currentSlide) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setIsFading(true);
    });
    const timer = window.setTimeout(() => {
      setCurrentSlide(nextSlide);
      setNextSlide(null);
      setIsFading(false);
    }, FADE_DURATION_MS);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [currentSlide, nextSlide]);

  useEffect(() => {
    if (!hasUserInteracted) {
      return;
    }

    const baseSlide = nextSlide ?? currentSlide;
    const nextSlideIndex = (baseSlide + 1) % backgroundImages.length;
    const preloadImage = new Image();
    preloadImage.src = backgroundImages[nextSlideIndex];
  }, [currentSlide, hasUserInteracted, nextSlide]);

  return (
    <section className="relative flex h-screen items-center max-lg:h-[75vh] max-sm:h-screen">
      <div className="absolute inset-0 overflow-hidden">
        {nextImage ? (
          <div className="absolute inset-0">
            <img
              src={nextImage}
              alt={t("main.hero.slideAlt", { index: nextSlideAltIndex })}
              className="h-full w-full object-cover"
              loading="eager"
              decoding="async"
              {...HERO_IMAGE_PROPS}
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ) : null}

        <div
          className={`absolute inset-0 ${
            nextImage ? "transition-opacity duration-1000" : ""
          } ${nextImage && isFading ? "opacity-0" : "opacity-100"}`}
          aria-hidden={nextImage ? "true" : undefined}
        >
          <img
            src={currentImage || "/placeholder.svg"}
            alt={t("main.hero.slideAlt", { index: currentSlide + 1 })}
            className="h-full w-full object-cover"
            loading="eager"
            fetchPriority={currentSlide === 0 ? "high" : "auto"}
            decoding="async"
            {...HERO_IMAGE_PROPS}
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      </div>

      <div className="relative z-10 container mx-auto max-md:mt-20">
        <div className="flex justify-center">
          <div className="flex max-w-4xl flex-col items-center justify-center gap-y-6">
            <div className="flex flex-col items-center">
              <h1 className="text-text text-center text-4xl font-bold text-balance max-lg:mb-3 max-md:leading-11 md:text-5xl lg:text-6xl lg:leading-22 xl:text-7xl">
                {t("main.hero.title")}
              </h1>
              <p className="text-text/75 max-w-xs text-center leading-6.5 text-pretty md:max-w-3xl md:text-lg md:leading-8 lg:text-xl">
                {t("main.hero.description")}
              </p>
            </div>
            <a
              onClick={openContactModal}
              className="group relative inline-flex h-14 w-48 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-white text-center text-lg font-bold text-black uppercase transition-all duration-300 ease-out will-change-transform hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.35),inset_0_-6px_20px_rgba(0,0,0,0.45)] active:scale-[0.93] active:shadow-[inset_0_1px_6px_rgba(255,255,255,0.5),inset_0_-8px_22px_rgba(0,0,0,0.65)] max-md:h-12 max-md:w-42 max-md:text-base"
            >
              {t("main.hero.cta")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
