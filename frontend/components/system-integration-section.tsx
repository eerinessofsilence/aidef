"use client";

import { ScrollReveal } from "./ui/scroll-reveal";

const CARDS = [
  {
    icon: "system-integration-1.svg",
    title: "Integration via C2 API",
    description: "User BMS/C2 connection",
  },
  {
    icon: "system-integration-2.svg",
    title: "Vehicle-mounted control terminals",
    description: "GCS inside the combat vehicle interior",
  },
  {
    icon: "system-integration-3.svg",
    title: "Third-party system integration",
    description: "Integration of sensors, weapon stations, and ISR modules",
  },
];

export default function SystemIntegrationSection() {
  return (
    <section className="container mx-auto flex flex-col items-center justify-center space-y-25 py-25 max-[1281px]:px-5 max-lg:space-y-15 max-lg:py-12.5">
      <ScrollReveal
        className="flex flex-col items-center gap-y-10 max-lg:gap-y-5"
        amount={0.65}
        from="down"
        duration={1.1}
        distance={0}
      >
        <h1 className="text-center text-5xl font-bold max-[1281px]:text-4xl max-md:text-3xl">
          System Integration for Military Vehicles
        </h1>
        <p className="text-center text-lg max-md:text-base">
          We integrate our UAV, UGV and GCS into armoured and soft-skin military{" "}
          <br />
          vehicles. Our systems expose open C2 APIs and are designed for
          integration <br /> with third-party sensors and efectors.
        </p>
      </ScrollReveal>
      <div className="grid grid-cols-3 gap-17.5 max-[1281px]:gap-10 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-5">
        {CARDS.map((item, index) => (
          <ScrollReveal
            key={item.title}
            delay={index * 0.25}
            amount={0.2}
            from="down"
            duration={1.15}
            distance={0}
          >
            <div className="transition-all duration-300 hover:-translate-y-0.5 hover:scale-105">
              <div className="border-border/15 h-70 w-full rounded-[20px] border-2 bg-white/5 p-10 shadow-lg backdrop-blur-xl transition-all hover:border-white/30 hover:bg-white/15 hover:shadow-xl">
                <img src={item.icon} className="mb-5 max-w-15" alt="" />
                <h3 className="mb-2.5 text-xl font-bold text-white">
                  {item.title}
                </h3>
                <p className="text-white/75 capitalize">{item.description}</p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
