"use client";

import { useTranslation } from "react-i18next";
import { Carousel, Card } from "../ui/apple-cards-carousel";
import { ScrollReveal } from "../ui/scroll-reveal";

export default function DroneCarouselSection() {
  const { t } = useTranslation();
  const cards = data.map((card, index) => (
    <Card
      key={card.key}
      card={{
        category: t(card.categoryKey),
        title: t(card.titleKey),
        description: t(card.descriptionKey),
        href: card.href,
        bg: card.bg,
        video: `/drone-carousel-video-${index + 1}.MP4`,
      }}
      index={index}
    />
  ));

  return (
    <div className="container mx-auto h-full w-full px-5 py-25">
      <ScrollReveal delay={0.12}>
        <Carousel
          paragraph={t("main.droneCarousel.description")}
          carouselTitle={t("main.droneCarousel.title")}
          items={cards}
        />
      </ScrollReveal>
    </div>
  );
}

type CarouselItem = {
  key: string;
  categoryKey: string;
  titleKey: string;
  descriptionKey: string;
  href: string;
  bg: string;
};

const data: CarouselItem[] = [
  {
    key: "ax2ng",
    categoryKey: "main.droneCarousel.items.ax2ng.category",
    titleKey: "main.droneCarousel.items.ax2ng.title",
    descriptionKey: "main.droneCarousel.items.ax2ng.description",
    href: "products/ax2ng-krakatit",
    bg: "/drone-carousel-bg-1.png",
  },
  {
    key: "axq",
    categoryKey: "main.droneCarousel.items.axq.category",
    titleKey: "main.droneCarousel.items.axq.title",
    descriptionKey: "main.droneCarousel.items.axq.description",
    href: "products/axq-quadrocopter",
    bg: "/drone-carousel-bg-2.png",
  },
  {
    key: "gcs",
    categoryKey: "main.droneCarousel.items.gcs.category",
    titleKey: "main.droneCarousel.items.gcs.title",
    descriptionKey: "main.droneCarousel.items.gcs.description",
    href: "products/ground-control-station",
    bg: "/drone-carousel-bg-3.png",
  },
  {
    key: "ugv",
    categoryKey: "main.droneCarousel.items.ugv.category",
    titleKey: "main.droneCarousel.items.ugv.title",
    descriptionKey: "main.droneCarousel.items.ugv.description",
    href: "products/ugv-150-dup",
    bg: "/drone-carousel-bg-4.png",
  },
  {
    key: "av1",
    categoryKey: "main.droneCarousel.items.av1.category",
    titleKey: "main.droneCarousel.items.av1.title",
    descriptionKey: "main.droneCarousel.items.av1.description",
    href: "products/av-1-vtol",
    bg: "/drone-carousel-bg-5.png",
  },
];
