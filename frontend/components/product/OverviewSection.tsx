import * as LucideIcons from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { ScrollReveal } from "../ui/scroll-reveal";

type ProductOverviewIcon =
  | {
      type: "lucide";
      name?: string | null;
    }
  | {
      type: "upload";
      url?: string | null;
    }
  | null;

type ProductOverviewFeature = {
  id: number;
  name: string;
  value: string;
  description?: string;
  icon?: ProductOverviewIcon;
};

type ProductOverviewSubFeature = {
  id: number;
  name: string;
  description?: string;
  icon?: ProductOverviewIcon;
};

type ProductOverviewSectionProps = {
  title: string;
  description?: string;
  features: ProductOverviewFeature[];
  subFeatures: ProductOverviewSubFeature[];
  contactLabel: string;
  onContactClick: () => void;
};

const isLucideComponent = (value: unknown): value is LucideIcon =>
  typeof value === "object" &&
  value !== null &&
  "$$typeof" in (value as Record<string, unknown>);

const LUCIDE_ICON_MAP: Record<string, LucideIcon> = Object.keys(
  LucideIcons,
).reduce(
  (acc, key) => {
    if (key === "icons" || key === "createLucideIcon") {
      return acc;
    }

    const candidate = (LucideIcons as Record<string, unknown>)[key];
    if (isLucideComponent(candidate)) {
      acc[key] = candidate;
    }
    return acc;
  },
  {} as Record<string, LucideIcon>,
);

const normalizeLucideName = (raw: string) => {
  const cleaned = raw.trim().replace(/^lucide[:\s_-]+/i, "");
  if (!cleaned) return "";

  const spaced = cleaned
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[^a-zA-Z0-9]+/g, " ");

  return spaced
    .split(" ")
    .filter(Boolean)
    .map((chunk) => chunk[0].toUpperCase() + chunk.slice(1))
    .join("");
};

const resolveLucideIcon = (raw?: string | null) => {
  if (!raw) return null;

  const trimmed = raw.trim();
  if (!trimmed) return null;

  const normalized = normalizeLucideName(trimmed);
  const candidates = new Set<string>();
  candidates.add(trimmed);
  if (normalized) {
    candidates.add(normalized);
  }
  if (!trimmed.endsWith("Icon")) {
    candidates.add(`${trimmed}Icon`);
  }
  if (normalized && !normalized.endsWith("Icon")) {
    candidates.add(`${normalized}Icon`);
  }

  for (const candidate of candidates) {
    const icon = LUCIDE_ICON_MAP[candidate];
    if (icon) {
      return icon;
    }
  }

  return null;
};

function OverviewIcon({
  icon,
  containerClassName,
  imageClassName,
  lucideClassName,
  strokeWidth,
}: {
  icon?: ProductOverviewIcon;
  containerClassName: string;
  imageClassName: string;
  lucideClassName: string;
  strokeWidth: number;
}) {
  if (!icon) {
    return null;
  }

  if (icon.type === "upload" && typeof icon.url === "string" && icon.url) {
    return (
      <div className={containerClassName}>
        <img
          src={icon.url}
          alt=""
          className={imageClassName}
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  if (icon.type === "lucide") {
    const IconComponent = resolveLucideIcon(icon.name);
    if (!IconComponent) {
      return null;
    }

    return (
      <div className={containerClassName}>
        <IconComponent className={lucideClassName} strokeWidth={strokeWidth} />
      </div>
    );
  }

  return null;
}

export default function ProductOverviewSection({
  title,
  description,
  features,
  subFeatures,
  contactLabel,
  onContactClick,
}: ProductOverviewSectionProps) {
  return (
    <section className="text-text relative my-16 overflow-hidden rounded-4xl border border-white/10 bg-[linear-gradient(180deg,#1c2c46_0%,#14233a_100%)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[40px_40px] opacity-30" />

      <div className="relative space-y-5 lg:space-y-6">
        <ScrollReveal>
          <article className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,#151f31_0%,#111a2a_100%)] px-5 py-7.5 shadow-[0_24px_56px_rgba(0,0,0,0.2)]">
            <div
              className={
                features.length > 0
                  ? "relative grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:gap-8 xl:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.82fr)]"
                  : "relative"
              }
            >
              <div className="order-2 space-y-5 lg:order-1 lg:max-w-3xl">
                <h2 className="text-4xl leading-tight font-semibold tracking-tight text-white max-sm:text-3xl md:text-5xl">
                  {title}
                </h2>
                {description ? (
                  <p className="max-w-lg leading-8 text-pretty text-white/75 md:text-lg">
                    {description}
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={onContactClick}
                  className="group relative inline-flex h-14 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-white px-8 text-lg font-bold text-black uppercase transition-all duration-300 ease-out will-change-transform hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.35),inset_0_-6px_20px_rgba(0,0,0,0.45)] active:scale-[0.93] active:shadow-[inset_0_1px_6px_rgba(255,255,255,0.5),inset_0_-8px_22px_rgba(0,0,0,0.65)] max-md:h-12 max-md:text-base"
                >
                  {contactLabel}
                </button>
              </div>

              {features.length > 0 ? (
                <div className="order-1 grid gap-3 sm:grid-cols-2 lg:order-2 lg:self-start">
                  {features.map((feature) => (
                    <article
                      key={feature.id}
                      className="h-full overflow-hidden rounded-[20px] border border-white/10 bg-[linear-gradient(180deg,#18263d_0%,#152136_100%)] p-3.5 shadow-[0_12px_24px_rgba(0,0,0,0.12)]"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <OverviewIcon
                            icon={feature.icon}
                            containerClassName="border-background/50 bg-secondary/50 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-[#c3c3c3]"
                            imageClassName="h-4 w-4 object-contain"
                            lucideClassName="h-4 w-4"
                            strokeWidth={2.25}
                          />
                          <p className="text-xs font-medium tracking-wider text-white/75">
                            {feature.name}
                          </p>
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-2xl leading-tight font-semibold text-white">
                            {feature.value}
                          </p>
                          {feature.description ? (
                            <p className="text-[13px] leading-5.5 text-white/60">
                              {feature.description}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : null}
            </div>
          </article>
        </ScrollReveal>

        {subFeatures.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {subFeatures.map((subFeature, index) => {
              return (
                <ScrollReveal key={subFeature.id} delay={0.05 * index}>
                  <article className="group h-full overflow-hidden rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,#1b2a44_0%,#18253d_100%)] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.16)] transition-transform duration-300 hover:-translate-y-0.5">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <OverviewIcon
                          icon={subFeature.icon}
                          containerClassName="border-background/75 bg-secondary/50 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 text-[#c3c3c3] md:h-14 md:w-14"
                          imageClassName="h-5 w-5 object-contain md:h-7 md:w-7"
                          lucideClassName="h-5 w-5 md:h-7 md:w-7"
                          strokeWidth={2.4}
                        />
                        <h3 className="flex-1 text-[24px] leading-tight font-medium text-white max-md:text-[22px]">
                          {subFeature.name}
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {subFeature.description ? (
                          <p className="text-base leading-7 text-white/65">
                            {subFeature.description}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
