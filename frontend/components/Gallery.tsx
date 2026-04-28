"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

const MODAL_TRANSITION_MS = 220;

export type GalleryImage = {
  src: string;
  alt?: string | null;
};

type GallerySectionProps = {
  images: Array<GalleryImage>;
};

export default function Gallery({ images }: GallerySectionProps) {
  const { t } = useTranslation();
  const galleryImages = useMemo(() => images, [images]);
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

  useEffect(() => {
    setActiveIndex(null);
    setIsModalVisible(false);
    clearCloseTimeout();
  }, [galleryImages, clearCloseTimeout]);

  const activeImage = activeIndex !== null ? galleryImages[activeIndex] : null;

  return (
    <section id="gallery" className="py-16 max-lg:py-8">
      <div>
        <div className="flex w-full flex-col gap-10 max-lg:gap-5">
          <div className="space-y-6 max-lg:space-y-3">
            <p className="text-text/70 tracking-widest uppercase">
              {t("gallery.kicker")}
            </p>
            <h2 className="text-text text-6xl font-bold capitalize max-lg:text-5xl max-md:text-4xl">
              {t("gallery.title")}
            </h2>
            <p className="text-text/70 max-w-3xl text-xl max-lg:text-lg">
              {t("gallery.description")}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1 lg:gap-3">
            {galleryImages.map((image, index) => (
              <button
                key={`${image.src}-${index}`}
                type="button"
                onClick={() => openModal(index)}
                className="group flex w-full cursor-pointer flex-col gap-3 text-left text-[#ffffff] transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-[#3a414d] transition-transform duration-500 group-hover:scale-[1.02]">
                  <img
                    src={image.src}
                    alt={image.alt ?? t("gallery.imageAltFallback")}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="pointer-events-none absolute inset-x-4 bottom-4 text-left opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="text-sm leading-tight font-medium text-white">
                      {image.alt ?? t("gallery.viewImage")}
                    </p>
                  </div>
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
                aria-label={t("gallery.modal.previous")}
                onClick={showPreviousImage}
                className="bg-background text-foreground hover:bg-muted absolute left-0 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full text-2xl leading-none transition-colors duration-300 max-xl:w-10 max-lg:h-10 xl:top-1/2 xl:left-20 2xl:left-90"
              >
                <ChevronLeft size={32} className="mr-1"></ChevronLeft>
              </button>
              <button
                type="button"
                aria-label={t("gallery.modal.next")}
                onClick={showNextImage}
                className="bg-background text-foreground hover:bg-muted absolute right-0 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full text-2xl leading-none transition-colors duration-300 max-xl:w-10 max-lg:h-10 xl:top-1/2 xl:right-20 2xl:right-90"
              >
                <ChevronRight size={32} className="ml-1"></ChevronRight>
              </button>
              {/* <button
                type="button"
                aria-label="Close image"
                onClick={closeModal}
                className="absolute top-20 right-90 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#435561] text-[#ffffff] transition-colors duration-200 hover:bg-[#51656c] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#ffffff]/60"
              >
                <X size={28}></X>
              </button> */}
            </div>
            <div
              className={`relative top-8.5 w-full max-w-5xl overflow-hidden rounded-3xl transition-all duration-300 ${
                isModalVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
              }`}
            >
              <div className="relative w-full overflow-hidden rounded-2xl">
                <img src={activeImage.src} className="w-full object-cover" />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
