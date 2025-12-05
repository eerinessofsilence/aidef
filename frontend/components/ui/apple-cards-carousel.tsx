"use client";
import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  type JSX,
} from "react";
import { IconArrowNarrowLeft, IconArrowNarrowRight } from "@tabler/icons-react";
import { cn } from "../../lib/utils";
import { motion } from "motion/react";
import { type ImageProps } from "next/image";

interface CarouselProps {
  carouselTitle?: string;
  items?: JSX.Element[];
  initialScroll?: number;
}

type Card = {
  bg: string;
  title: string;
  category: string;
  video?: string;
  href?: string;
};

const normalizeHref = (href: string) => {
  if (/^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(href)) {
    return href;
  }
  return href.startsWith("/") ? href : `/${href}`;
};

const buildProductHref = (card: Card) => {
  if (card.href && card.href !== "#") {
    return normalizeHref(card.href);
  }

  const slug = card.title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug ? `/products/${slug}` : "#";
};

const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

export const Carousel = ({
  carouselTitle,
  items = [],
  initialScroll = 0,
}: CarouselProps) => {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const handleCardClose = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = isMobile() ? 230 : 384; // (md:w-96)
      const gap = isMobile() ? 4 : 8;
      const scrollPosition = (cardWidth + gap) * (index + 1);
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  const isMobile = () => {
    return window && window.innerWidth < 768;
  };

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex }}
    >
      <div className="relative w-full">
        <div className="flex justify-between gap-3 max-[360px]:flex-col">
          {carouselTitle ? (
            <div>
              <h2 className="text-text text-5xl font-bold max-lg:text-4xl max-md:text-3xl">
                {carouselTitle}
              </h2>
            </div>
          ) : null}
          <div className="flex justify-end gap-2">
            <button
              className="relative z-40 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-100 disabled:opacity-50"
              onClick={scrollLeft}
              disabled={!canScrollLeft}
            >
              <IconArrowNarrowLeft className="h-6 w-6 text-gray-500" />
            </button>
            <button
              className="relative z-40 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-100 disabled:opacity-50"
              onClick={scrollRight}
              disabled={!canScrollRight}
            >
              <IconArrowNarrowRight className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>
        <div
          className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth py-10 [scrollbar-width:none]"
          ref={carouselRef}
          onScroll={checkScrollability}
        >
          <div
            className={cn(
              "absolute right-0 z-1000 h-auto w-[5%] overflow-hidden bg-linear-to-l",
            )}
          ></div>

          <div className="flex max-w-7xl flex-row flex-nowrap justify-start gap-6 max-lg:gap-3">
            {items.map((item, index) => (
              <div
                key={"card" + index}
                className="h-162.5 w-125 max-md:h-97.5 max-md:w-75"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const Card = ({
  card,
  index,
  layout = false,
}: {
  card: Card;
  index: number;
  layout?: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const productHref = buildProductHref(card);

  const handleMouseEnter = () => {
    setIsHovered(true);
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  };

  const handleMouseLeave = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    setIsHovered(false);
  };

  return (
    <>
      <motion.a
        href={productHref}
        layoutId={layout ? `card-${card.title}` : undefined}
        className="relative z-10 flex h-162.5 w-125 cursor-pointer flex-col justify-end overflow-hidden rounded-[10px] bg-center p-6 text-right transition-all duration-300 hover:shadow-md hover:shadow-black/50 max-md:h-97.5 max-md:w-75"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-card-index={index}
      >
        <div className="absolute inset-0">
          <img
            src={card.bg}
            alt={`${card.title} preview`}
            className="h-full w-full object-cover"
          />
          {card.video && (
            <video
              ref={videoRef}
              src={card.video}
              poster={card.bg}
              muted
              loop
              playsInline
              preload="none"
              autoPlay={isHovered}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ease-in-out ${isHovered ? "opacity-100" : "opacity-0"}`}
            />
          )}
        </div>

        <div className="pointer-events-none absolute inset-0 z-30 bg-linear-to-b from-black/50 via-black/25 to-transparent" />
        <div className="relative z-40">
          <motion.p
            layoutId={layout ? `category-${card.category}` : undefined}
            className="text-left font-sans text-base font-medium text-white"
          >
            {card.category}
          </motion.p>
          <motion.p
            layoutId={layout ? `title-${card.title}` : undefined}
            className="mt-2 max-w-xs text-left font-sans text-xl font-semibold text-balance text-white md:text-3xl"
          >
            {card.title}
          </motion.p>
        </div>
      </motion.a>
    </>
  );
};

export const BlurImage = ({
  height,
  width,
  src,
  className,
  alt,
  ...rest
}: ImageProps) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <img
      className={cn(
        "m-auto w-full transition duration-300",
        isLoading ? "blur-sm" : "blur-0",
        className,
      )}
      onLoad={() => setLoading(false)}
      src={src as string}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      blurDataURL={typeof src === "string" ? src : undefined}
      alt={alt ? alt : "Background of a beautiful view"}
      {...rest}
    />
  );
};
