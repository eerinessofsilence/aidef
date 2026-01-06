import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";
import { useTranslation } from "react-i18next";

const STORAGE_KEY = "aidef-cookie-consent";

export function CookieConsent() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const storedChoice = localStorage.getItem(STORAGE_KEY);
      if (!storedChoice) {
        setIsOpen(true);
      }
    } catch (error) {
      setIsOpen(true);
    }
  }, []);

  const handleChoice = (value: "accepted" | "declined") => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (error) {
      // Ignore storage errors; modal will still close.
    }
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-300 flex items-center justify-center px-4 py-10">
      <button
        type="button"
        aria-label={t("cookieConsent.aria.dismiss")}
        onClick={() => handleChoice("declined")}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("cookieConsent.aria.dialogLabel")}
        className="relative z-10 w-full max-w-xl rounded-[28px] border border-white/15 bg-linear-to-b from-white/12 via-white/8 to-white/5 p-6 text-white shadow-2xl"
      >
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white shadow-inner shadow-black/40">
            <Cookie className="h-6 w-6" />
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">
                {t("cookieConsent.title")}
              </h2>
              <p className="text-sm leading-relaxed text-white/80">
                {t("cookieConsent.description")}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleChoice("accepted")}
                className="group relative inline-flex h-11 items-center justify-center rounded-xl bg-white px-6 text-sm font-semibold text-black transition-all duration-200 ease-out hover:shadow-[inset_0_4px_16px_rgba(255,255,255,0.35),inset_0_-8px_24px_rgba(0,0,0,0.35)] focus-visible:ring-2 focus-visible:ring-[#0A84FF] focus-visible:ring-offset-2 focus-visible:ring-offset-black/60 focus-visible:outline-none active:scale-[0.96]"
              >
                {t("cookieConsent.actions.accept")}
              </button>
              <button
                type="button"
                onClick={() => handleChoice("declined")}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-white/25 bg-white/5 px-5 text-sm font-semibold text-white transition-all duration-200 hover:border-white/40 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black/60 focus-visible:outline-none active:scale-[0.97]"
              >
                {t("cookieConsent.actions.decline")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
