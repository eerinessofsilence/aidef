"use client";

import { Carousel, Card } from "./ui/apple-cards-carousel";
import { ScrollReveal } from "./ui/scroll-reveal";

export default function DroneCarouselSection() {
  const cards = data.map((card, index) => (
    <Card
      key={index}
      card={{ ...card, video: `/drone-carousel-video-${index + 1}.MP4` }}
      index={index}
    />
  ));

  return (
    <div className="container mx-auto h-full w-full px-5 py-25">
      <ScrollReveal delay={0.12} amount={0.3}>
        <Carousel carouselTitle="Unmanned Systems Portfolio" items={cards} />
      </ScrollReveal>
    </div>
  );
}

const data = [
  {
    category: "Drone",
    title: "AX2NG KRAKATIT",
    href: "products/ax2ng-krakatit",
    description: "Jet engine KAMIKAZE drone with AI",
    bg: "/drone-carousel-bg-1.png",
  },
  {
    category: "Drone",
    title: "AV2 VTOL",
    href: "products/av2-vtol",
    description: "Vertical take-of and landing aircraft",
    bg: "/drone-carousel-bg-2.png",
  },
  {
    category: "Quadrocopter",
    title: "AXQ",
    href: "products/axq-quadrocopter",
    description: "Lightweight 10-inch multicopter",
    bg: "/drone-carousel-bg-3.png",
  },

  {
    category: "UGV",
    title: "UGV 150-DUP",
    href: "products/ugv-150-dup",
    description: "Unmanned ground platform",
    bg: "/drone-carousel-bg-4.png",
  },
  {
    category: "Drone controls",
    title: "Ground Control Station",
    href: "products/ground-control-station",
    description: " Unihed control for all platforms",
    bg: "/drone-carousel-bg-5.png",
  },
];
