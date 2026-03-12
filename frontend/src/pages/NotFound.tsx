import { ArrowRight, BookOpenText, Home, type LucideIcon } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { buildLocalizedPath, resolveLanguage } from "../i18n";

type ActionCardProps = {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  to: string;
};

function ActionCard({ icon: Icon, title, subtitle, to }: ActionCardProps) {
  return (
    <Link
      to={to}
      className="group border-border/20 relative flex items-center gap-4 rounded-[28px] border bg-white/6 px-5 py-5 text-left shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_24px_60px_rgba(0,0,0,0.28)]"
    >
      <span className="bg-foreground/10 text-foreground flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_8px_18px_rgba(0,0,0,0.16)]">
        <Icon className="h-5 w-5" strokeWidth={2.1} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="text-foreground text-lg font-semibold tracking-[-0.02em]">
          {title}
        </div>
        <div className="text-foreground/65 mt-1 text-sm leading-6">
          {subtitle}
        </div>
      </div>

      <span className="bg-background/70 text-foreground/60 group-hover:bg-foreground/10 group-hover:text-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition duration-300 group-hover:translate-x-1">
        <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2.3} />
      </span>
    </Link>
  );
}

export default function NotFound() {
  const { t } = useTranslation();
  const { lng } = useParams();
  const activeLanguage = resolveLanguage(lng);
  const actionCards = [
    {
      icon: Home,
      title: t("notFound.cards.home.title"),
      subtitle: t("notFound.cards.home.subtitle"),
      to: buildLocalizedPath(activeLanguage, "/"),
    },
    {
      icon: BookOpenText,
      title: t("notFound.cards.blog.title"),
      subtitle: t("notFound.cards.blog.subtitle"),
      to: buildLocalizedPath(activeLanguage, "/blog"),
    },
  ];

  return (
    <div className="bg-background text-foreground min-h-[calc(100vh-11rem)] py-16 pt-32">
      <section className="container flex min-h-[calc(100vh-13rem)] items-center">
        <div className="border-border/20 relative w-full overflow-hidden rounded-[40px] border bg-linear-to-b from-white/8 via-white/6 to-white/3 px-5 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.24)] md:px-10 md:py-12 lg:px-16 lg:py-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),rgba(255,255,255,0.07)_44%,rgba(255,255,255,0.02)_100%)]"
          />
          <div
            aria-hidden="true"
            className="bg-foreground/12 pointer-events-none absolute top-10 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full blur-3xl"
          />
          <div
            aria-hidden="true"
            className="bg-secondary/40 pointer-events-none absolute right-14 bottom-10 h-36 w-36 rounded-full blur-3xl"
          />
          <div
            aria-hidden="true"
            className="bg-muted/45 pointer-events-none absolute bottom-16 left-10 h-40 w-40 rounded-full blur-3xl"
          />

          <div className="relative mx-auto flex max-w-[880px] flex-col items-center text-center">
            <p className="text-foreground/60 text-sm font-medium tracking-[0.01em] md:text-base">
              {t("notFound.eyebrow")}
            </p>
            <h1 className="text-foreground mt-4 max-w-[11ch] text-[clamp(2.8rem,6vw,5.6rem)] leading-[0.94] font-semibold tracking-[-0.065em]">
              {t("notFound.title")}
            </h1>
            <p className="text-foreground/70 mt-5 max-w-2xl text-base leading-8 md:text-lg">
              {t("notFound.description")}
            </p>

            <div className="mt-2 grid w-full max-w-[760px] gap-4 md:grid-cols-2">
              {actionCards.map((card) => (
                <ActionCard
                  key={card.title}
                  icon={card.icon}
                  title={card.title}
                  subtitle={card.subtitle}
                  to={card.to}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
