"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

const MODAL_TRANSITION_MS = 220;

const galleryImages = [
  {
    src: "./gallery-1.png",
    alt: "",
  },
  {
    src: "./gallery-2.png",
    alt: "",
  },
  {
    src: "./gallery-3.png",
    alt: "",
  },
  {
    src: "./gallery-4.png",
    alt: "",
  },
  {
    src: "./gallery-5.png",
    alt: "",
  },
  {
    src: "./gallery-6.png",
    alt: "",
  },
] as const;

export default function GallerySection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const imageCount = galleryImages.length;

  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current !== null) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const openModal = useCallback(
    (index: number) => {
      clearCloseTimeout();
      setActiveIndex(index);
    },
    [clearCloseTimeout],
  );

  const showNextImage = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) return current;
      return (current + 1) % imageCount;
    });
  }, [imageCount]);

  const showPreviousImage = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) return current;
      return (current - 1 + imageCount) % imageCount;
    });
  }, [imageCount]);

  const closeModal = useCallback(() => {
    setIsModalVisible(false);
    clearCloseTimeout();

    closeTimeoutRef.current = setTimeout(() => {
      setActiveIndex(null);
      closeTimeoutRef.current = null;
    }, MODAL_TRANSITION_MS);
  }, [clearCloseTimeout]);

  useEffect(() => {
    if (activeIndex !== null) {
      setIsModalVisible(true);
    }
  }, [activeIndex]);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", activeIndex !== null);

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [activeIndex]);

  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        showNextImage();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPreviousImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, closeModal, showNextImage, showPreviousImage]);

  useEffect(() => () => clearCloseTimeout(), [clearCloseTimeout]);

  const activeImage = activeIndex !== null ? galleryImages[activeIndex] : null;

  return (
    <section
      id="gallery"
      className="container mx-auto py-16 max-lg:px-10 max-lg:py-8"
    >
      <div className="flex w-full flex-col gap-10 max-lg:gap-5">
        <div className="space-y-6 max-lg:space-y-3">
          <p className="text-text/70 tracking-widest uppercase">
            Characteristics
          </p>
          <h2 className="text-text text-6xl font-bold capitalize max-lg:text-5xl">
            Aerial perspectives from recent operations
          </h2>
          <p className="text-text/70 max-w-3xl text-xl max-lg:text-lg">
            Browse a curated selection of sorties, showcasing the clarity,
            stability, and coverage of our autonomous fleet across challenging
            environments.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 max-lg:grid-cols-2">
          {galleryImages.map((image, index) => (
            <button
              key={image.alt}
              type="button"
              onClick={() => openModal(index)}
              className="group flex w-full flex-col gap-3 text-left text-[#ffffff] transition-transform duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-[#51656c]"
            >
              <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-[#3a414d] transition-transform duration-500 group-hover:scale-[1.02]">
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {activeImage ? (
        <div
          className={`fixed inset-0 z-40 flex items-center justify-center bg-[rgba(15,19,22,0.72)] px-4 transition-opacity duration-300 ${
            isModalVisible ? "opacity-100" : "opacity-0"
          }`}
          role="dialog"
          aria-modal="true"
          onClick={closeModal}
        >
          <div onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              aria-label="Show previous image"
              onClick={showPreviousImage}
              className="absolute top-1/2 left-90 z-50 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#435561] text-2xl leading-none text-[#ffffff] transition-colors duration-200 hover:bg-[#51656c] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#ffffff]/60"
            >
              <ChevronLeft size={32} className="mr-1"></ChevronLeft>
            </button>
            <button
              type="button"
              aria-label="Show next image"
              onClick={showNextImage}
              className="absolute top-1/2 right-90 z-50 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#435561] text-2xl leading-none text-[#ffffff] transition-colors duration-200 hover:bg-[#51656c] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#ffffff]/60"
            >
              <ChevronRight size={32} className="ml-1"></ChevronRight>
            </button>
            <button
              type="button"
              aria-label="Close image"
              onClick={closeModal}
              className="absolute top-20 right-90 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#435561] text-[#ffffff] transition-colors duration-200 hover:bg-[#51656c] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#ffffff]/60"
            >
              <X size={28}></X>
            </button>
          </div>
          <div
            className={`relative top-8.5 w-full max-w-5xl overflow-hidden rounded-3xl transition-all duration-300 ${
              isModalVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            <div className="relative w-full overflow-hidden rounded-2xl">
              <img
                src={activeImage.src}
                alt={activeImage.alt}
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
