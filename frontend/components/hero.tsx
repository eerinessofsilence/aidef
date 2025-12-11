"use client";

import { useEffect, useState } from "react";

const backgroundImages = [
  "/hero-bg-1.png",
  "/hero-bg-2.png",
  "/hero-bg-3.png",
  "/hero-bg-4.png",
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

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
              alt={`Background ${index + 1}`}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto max-md:mt-20">
        <div className="max-w-7xl">
          <div className="max-w-4xl">
            <h1 className="mb-6 text-7xl font-bold text-balance text-white max-lg:mb-3 max-lg:text-6xl max-md:text-center max-md:text-5xl max-sm:text-4xl lg:leading-22">
              Autonomous combat
              <br />
              UAV & Robotic systems
            </h1>
            <p className="max-w-3xl text-lg leading-8.5 text-pretty text-white/90 max-md:text-center max-sm:text-base max-sm:leading-5 lg:text-xl">
              We are a system integrator delivering kamikaze UAV, UGV and GCS,
              integrated into military vehicle systems via open C2 APIs and
              third-party system integration.
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
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
