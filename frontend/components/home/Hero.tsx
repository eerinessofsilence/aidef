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

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative flex h-screen items-center max-lg:h-[75vh] max-sm:h-screen">
      <div className="absolute inset-0 overflow-hidden">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image || "/placeholder.svg"}
              alt={t("main.hero.slideAlt", { index: index + 1 })}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ))}
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

      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 max-md:bottom-6">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50"
            }`}
            aria-label={t("main.hero.slideAria", { index: index + 1 })}
          />
        ))}
      </div>
    </section>
  );
}
