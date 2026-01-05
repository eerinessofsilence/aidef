"use client";

import { useTranslation } from "react-i18next";
import { ScrollReveal } from "./ui/scroll-reveal";
import { dispatchOpenContactModal } from "../lib/contact-modal";

export default function SystemIntegrationSection() {
  const openContactModal = () => dispatchOpenContactModal();
  const { t } = useTranslation();

  return (
    <section className="container mx-auto flex flex-col items-center justify-center space-y-25 px-5 py-25 max-lg:space-y-15 max-lg:py-12.5">
      <ScrollReveal
        className="flex flex-col items-center gap-y-8 max-md:gap-y-4"
        amount={0.35}
        from="down"
        duration={0.5}
        distance={0}
      >
        <div className="space-y-4">
          <h1 className="text-center text-5xl font-bold max-lg:text-4xl">
            {t("main.customerBenefits.title")}
          </h1>
          <p className="text-center text-lg max-md:text-base max-md:text-balance">
            {t("main.customerBenefits.description")}
          </p>
        </div>
        <div>
          <a
            onClick={openContactModal}
            className="group relative inline-flex h-14 w-48 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-white text-lg font-bold text-black uppercase transition-all duration-300 ease-out will-change-transform hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.35),inset_0_-6px_20px_rgba(0,0,0,0.45)] active:scale-[0.93] active:shadow-[inset_0_1px_6px_rgba(255,255,255,0.5),inset_0_-8px_22px_rgba(0,0,0,0.65)] max-md:h-12 max-md:w-42 max-md:text-base"
          >
            {t("main.customerBenefits.cta")}
          </a>
        </div>
      </ScrollReveal>
    </section>
  );
}
