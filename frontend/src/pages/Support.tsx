import { useEffect, useState } from "react";
import { ContactForm } from "../../components/ui/contact-form";

const backgroundImages = [
  "/hero-bg-1.png",
  "/hero-bg-2.png",
  "/hero-bg-3.png",
  "/hero-bg-4.png",
];

export default function Support() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col gap-16">
      <section className="relative h-screen min-h-[380px] overflow-hidden">
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

        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 max-md:bottom-6">
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
        </div>
      </section>

      <section className="container mx-auto space-y-7.5 px-5 pb-24 max-lg:flex max-lg:flex-col max-lg:items-center max-md:pb-16">
        <div className="flex flex-col justify-between gap-10 lg:flex-row">
          <div className="space-y-7.5">
            <div className="space-y-7.5">
              <div>
                <span className="border-border/35 rounded-full border bg-white/5 p-3 px-4 font-semibold uppercase backdrop-blur-lg">
                  Be safe with us
                </span>
              </div>
              <div className="flex items-center gap-5">
                <div className="border/35 flex h-15 w-15 items-center justify-center rounded-2xl border bg-white/5">
                  <img src="/mail.svg" alt="" />
                </div>
                <p className="text-lg font-semibold">office@ai-def.com</p>
              </div>
              <div className="flex items-center gap-5">
                <div className="border/35 flex h-15 w-15 items-center justify-center rounded-2xl border bg-white/5">
                  <img src="/mobile-phone.svg" alt="" />
                </div>
                <p className="text-lg font-semibold">+421 907 949 592</p>
              </div>
            </div>
            <div className="space-y-5">
              <p className="text-lg font-semibold uppercase">Adresses:</p>
              <div className="space-y-5">
                <div className="space-y-2.5">
                  <p className="text-foreground/50 font-semibold uppercase md:text-lg">
                    MANAGEMENT AND ADMINISTRATION
                  </p>
                  <p className="max-w-[233px] text-pretty md:text-lg">
                    Vedecky park - Ilkovicova 8 841 02 Bratislava Slovakia
                  </p>
                </div>
                <div className="space-y-2.5">
                  <p className="text-foreground/50 font-semibold uppercase md:text-lg">
                    HEADQUARTERS & DEVELOPMENT CENTRE
                  </p>
                  <p className="max-w-[233px] text-pretty md:text-lg">
                    Staniná 267/21 906 13 Brezová pod Bradlom Slovakia
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-start justify-end">
            <div className="w-full max-w-4xl rounded-3xl border border-neutral-200 bg-white p-8 shadow-[0_15px_30px_rgba(0,0,0,0.12)] max-md:p-5 dark:border-neutral-700 dark:bg-neutral-900">
              <ContactForm showDetails={false} onSubmit={handleSubmit} />
              {submitted && (
                <p className="mt-4 text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                  Thanks! We&apos;ll respond within one business day.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
