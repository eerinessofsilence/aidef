"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Carousel, Card } from "../ui/apple-cards-carousel";
import { ScrollReveal } from "../ui/scroll-reveal";
import { resolveLanguage } from "../../src/i18n";

export default function DroneCarouselSection() {
  const { lng } = useParams<{ lng?: string }>();
  const activeLanguage = resolveLanguage(lng);
  const { t } = useTranslation();
  const [items, setItems] = useState<ProductListApiItem[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    setErrorMessage(null);
    axios
      .get<ProductListApiItem[]>(`${import.meta.env.VITE_API_URL}/items/`, {
        signal: controller.signal,
        params: { lang: activeLanguage },
      })
      .then((response) => {
        setItems(response.data);
        setStatus("ready");
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          return;
        }
        console.error("Unable to load DroneSlider products", error);
        setErrorMessage(t("productDetail.errors.list"));
        setStatus("error");
      });

    return () => controller.abort();
  }, [activeLanguage, t]);

  const cards = useMemo(
    () =>
      [...items]
        .filter((product) => Boolean(product.slug))
        .sort(
          (a, b) =>
            (a.order ?? Number.MAX_SAFE_INTEGER) -
              (b.order ?? Number.MAX_SAFE_INTEGER) || a.id - b.id,
        )
        .map((product, index) => (
          <Card
            key={product.id}
            card={{
              category: product.category ?? "",
              title: product.name,
              description: product.description?.trim() ?? "",
              href: `/products/${product.slug}`,
              bg:
                product.drone_slider?.image ??
                product.first_image?.url ??
                product.icon?.url ??
                "/placeholder.svg",
              video: product.drone_slider?.video ?? undefined,
            }}
            index={index}
          />
        )),
    [items],
  );

  return (
    <div className="container mx-auto h-full w-full px-5 py-16 max-lg:py-12">
      <ScrollReveal delay={0.12}>
        <Carousel
          paragraph={t("main.droneCarousel.description")}
          carouselTitle={t("main.droneCarousel.title")}
          items={cards}
        />
      </ScrollReveal>
      {status === "error" ? (
        <div className="mt-2 rounded-3xl border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-200">
          {errorMessage ?? t("productDetail.errors.catalogFallback")}
        </div>
      ) : null}
    </div>
  );
}

type ProductImagePreview = {
  url: string | null;
  alt?: string | null;
};

type ProductDroneSliderMedia = {
  image?: string | null;
  video?: string | null;
};

type ProductListApiItem = {
  id: number;
  slug: string;
  name: string;
  description?: string;
  category: string | null;
  order?: number | null;
  icon?: ProductImagePreview | null;
  first_image?: ProductImagePreview | null;
  drone_slider?: ProductDroneSliderMedia | null;
};
