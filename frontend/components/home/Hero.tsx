"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const backgroundImages = [
  "/hero-bg-1.jpg",
  "/hero-bg-2.jpg",
  "/hero-bg-3.jpg",
  "/hero-bg-4.jpg",
  "/hero-bg-5.jpg",
];

const FADE_DURATION_MS = 1000;

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [nextSlide, setNextSlide] = useState<number | null>(null);
  const [isFading, setIsFading] = useState(false);
  const { t } = useTranslation();
  const currentImage = backgroundImages[currentSlide] ?? backgroundImages[0];
  const nextSlideAltIndex = nextSlide !== null ? nextSlide + 1 : 1;
  const nextImage =
    nextSlide !== null ? (backgroundImages[nextSlide] ?? backgroundImages[0]) : null;

  useEffect(() => {
    if (nextSlide !== null) {
      return;
    }

    const timer = window.setTimeout(() => {
      setNextSlide((currentSlide + 1) % backgroundImages.length);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [currentSlide, nextSlide]);

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
    const baseSlide = nextSlide ?? currentSlide;
    const nextSlideIndex = (baseSlide + 1) % backgroundImages.length;
    const preloadImage = new Image();
    preloadImage.src = backgroundImages[nextSlideIndex];
  }, [currentSlide, nextSlide]);

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
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ) : null}

        <div
          className={`absolute inset-0 ${
            nextImage ? "transition-opacity duration-1000" : ""
          } ${
            nextImage && isFading ? "opacity-0" : "opacity-100"
          }`}
          aria-hidden={nextImage ? "true" : undefined}
        >
          <img
            src={currentImage || "/placeholder.svg"}
            alt={t("main.hero.slideAlt", { index: currentSlide + 1 })}
            className="h-full w-full object-cover"
            loading="eager"
            fetchPriority={currentSlide === 0 ? "high" : "auto"}
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      </div>

      <div className="relative z-10 container mx-auto max-md:mt-20">
        <div className="flex justify-center">
          <div className="flex max-w-4xl flex-col items-center justify-center">
            <h1 className="mb-6 text-center text-7xl font-bold text-balance text-white max-lg:mb-3 max-lg:text-6xl max-md:text-5xl max-sm:text-4xl lg:leading-22">
              {t("main.hero.title")}
            </h1>
            <p className="max-w-3xl text-center text-lg leading-8.5 text-pretty text-white/90 max-sm:text-base max-sm:leading-5 lg:text-xl">
              {t("main.hero.description")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
