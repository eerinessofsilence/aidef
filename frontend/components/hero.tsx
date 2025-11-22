"use client";

import { useState, useEffect } from "react";

const backgroundImages = [
  "/hero-bg-1.png",
  "/hero-bg-2.png",
  "/hero-bg-3.png",
  "/hero-bg-4.png",
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative flex min-h-screen items-end pb-25 max-[1281px]:px-5 max-md:pb-5">
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

      <div className="relative z-10 container mx-auto">
        <div className="max-w-7xl">
          <div className="max-w-4xl">
            <h1 className="mb-6 text-6xl font-bold text-balance text-white max-lg:mb-3 max-lg:text-4xl">
              Autonomous combat
              <br />
              UAV & Robotic systems
            </h1>
            <p className="max-w-3xl text-lg text-pretty text-white/90 lg:text-xl">
              We are a system integrator delivering kamikaze UAV, UGV and GCS,
              integrated into military vehicle systems via open C2 APIs and
              third-party system integration.
            </p>
          </div>
        </div>

        <div className="z-20 flex justify-center gap-2 py-5">
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
      </div>
    </section>
  );
}
