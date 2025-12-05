import { useState } from "react";
import { ContactForm } from "../../components/ui/contact-form";

export default function Support() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <section className="container mx-auto space-y-7.5 px-5 py-32 pt-64 max-lg:flex max-lg:flex-col max-lg:items-center max-md:py-16 max-md:pt-36">
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
              <div className="space-y-2.5">
                <p className="text-foreground/50 font-semibold uppercase md:text-lg">
                  PROTOTYPE LABORATORY
                </p>
                <p className="max-w-[233px] text-pretty md:text-lg">
                  Nádrainá 75/2 907 01 Myjava Slovakia
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
  );
}
