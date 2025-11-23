"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

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

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const headingY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const paragraphY = useTransform(scrollYProgress, [0, 1], [0, -48]);
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const indicatorY = useTransform(scrollYProgress, [0, 1], [0, -20]);

  return (
    <section
      ref={heroRef}
      className="relative flex items-center pb-25 max-[1281px]:px-5 max-md:min-h-[75vh] max-md:items-center max-md:pt-20 md:min-h-screen"
    >
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
            <motion.h1
              className="mb-6 text-7xl font-bold text-balance text-white max-lg:mb-3 max-lg:text-6xl max-md:text-center max-md:text-5xl lg:leading-22"
              style={{ y: headingY }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              Autonomous combat
              <br />
              UAV & Robotic systems
            </motion.h1>
            <motion.p
              className="max-w-3xl text-lg leading-8.5 text-pretty text-white/90 max-md:text-center lg:text-xl"
              style={{ y: paragraphY }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.22 }}
            >
              We are a system integrator delivering kamikaze UAV, UGV and GCS,
              integrated into military vehicle systems via open C2 APIs and
              third-party system integration.
            </motion.p>
          </div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 max-md:bottom-6"
        style={{ opacity: indicatorOpacity, y: indicatorY }}
      >
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
      </motion.div>
    </section>
  );
}
