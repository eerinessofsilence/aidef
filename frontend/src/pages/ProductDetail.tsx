import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import type { LucideIcon } from "lucide-react";
import {
  BatteryCharging,
  Camera,
  Gauge,
  Layers,
  Radio,
  Shield,
  Wind,
} from "lucide-react";
import { Carousel, Card } from "../../components/ui/apple-cards-carousel";
import { ScrollReveal } from "../../components/ui/scroll-reveal";
import { dispatchOpenContactModal } from "../../lib/contact-modal";

interface Product {
  id: number;
  slug: string;
  name: string;
  description?: string;
  category: string | null;
  price: number;
  discount?: number | null;
  price_after_discount?: number | null;
  available: boolean;
  is_featured?: boolean;
}

const statHighlights = [
  {
    label: "Max Flight Time",
    value: "45 min",
    detail: "Dual hot-swappable packs",
  },
  {
    label: "Transmission",
    value: "20 km",
    detail: "Tri-band, anti-jam uplink",
  },
  {
    label: "Wind Resistance",
    value: "43 km/h",
    detail: "6-axis active stabilization",
  },
  {
    label: "Payload Flex",
    value: "2.3 kg",
    detail: "Adaptive gimbal rail",
  },
];

const techFocus: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
  tags: string[];
}> = [
  {
    title: "HorizonLock Imaging",
    description:
      "8K dual-native ISO capture with cinematic roll compensation keeps every frame level, even in 30° gusts.",
    icon: Camera,
    tags: ["Night HDR", "10-bit LOG"],
  },
  {
    title: "SkyShield Link",
    description:
      "Encrypted multi-node transmission with spectrum agility mirrors DJI's flagship rock-solid downlink reliability.",
    icon: Radio,
    tags: ["AES-256", "Mesh-ready"],
  },
  {
    title: "OmniSense Matrix",
    description:
      "Neural obstacle mapping + terrain following for confident low-altitude runs through complex industrial sites.",
    icon: Layers,
    tags: ["360° lidar", "Subject track"],
  },
];

export default function Products() {
  const [items, setItems] = useState<Product[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const openContactModal = () => dispatchOpenContactModal();

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    axios
      .get<Product[]>(`${import.meta.env.VITE_API_URL}/items/`, {
        signal: controller.signal,
      })
      .then((res) => {
        setItems(res.data);
        setStatus("ready");
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          return;
        }
        console.error("Unable to load products", err);
        setErrorMessage("We couldn’t sync the fleet catalog. Try again soon.");
        setStatus("error");
      });

    return () => controller.abort();
  }, []);

  const heroProduct = useMemo(
    () => items.find((p) => p.is_featured) ?? items[0],
    [items],
  );

  return (
    <div className="container mx-auto min-h-screen px-6 pt-28 pb-14 max-[1281px]:px-5 max-md:pt-14 max-md:pb-7">
      <section className="relative my-16 overflow-hidden rounded-3xl border border-white/10 bg-linear-to-b from-white/10 via-white/5 to-transparent p-10 text-white shadow-[0_20px_120px_rgba(0,0,0,0.35)] max-[1281px]:p-5">
        <div className="absolute top-0 -right-24 h-72 w-72 rounded-full bg-[#6ad1ff]/30 blur-3xl" />
        <div className="absolute -bottom-16 -left-10 h-56 w-72 rounded-full bg-[#7b5bff]/30 blur-3xl" />
        <div className="relative grid gap-12 max-lg:gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <ScrollReveal amount={0.35} className="h-full">
            <p className="text-sm tracking-wide text-white/50 uppercase">
              Characteristics
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight max-sm:text-3xl md:text-5xl">
              About product
            </h1>
            <p className="mt-4 max-w-2xl text-base text-white/70 max-sm:text-sm">
              {heroProduct?.description ?? "Aerial Platform"}
            </p>
            <div className="mt-10 grid gap-6 max-md:gap-3 sm:grid-cols-2">
              {statHighlights.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm max-sm:p-4"
                >
                  <p className="text-sm tracking-wide text-white/60 uppercase">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold max-sm:text-2xl">
                    {stat.value}
                  </p>
                  <p className="text-sm text-white/70">{stat.detail}</p>
                </div>
              ))}
            </div>
            <div className="max-lg:hidden">
              <button
                type="button"
                onClick={openContactModal}
                className="group relative mt-12 inline-flex h-14 w-48 items-center justify-center overflow-hidden rounded-2xl bg-white text-lg font-bold text-black uppercase transition-all duration-300 ease-out will-change-transform hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.35),inset_0_-6px_20px_rgba(0,0,0,0.45)] focus-visible:ring-2 focus-visible:ring-[#0A84FF] focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.93] active:shadow-[inset_0_1px_6px_rgba(255,255,255,0.5),inset_0_-8px_22px_rgba(0,0,0,0.65)]"
              >
                Contact Us
              </button>
            </div>
          </ScrollReveal>
          <ScrollReveal amount={0.35} delay={0.08} className="relative">
            <div className="absolute inset-0 rounded-4xl bg-linear-to-br from-white/30 via-white/5 to-transparent blur-3xl" />
            <div className="relative flex h-full flex-col justify-between rounded-4xl border border-white/15 bg-black/40 p-8 backdrop-blur-2xl max-sm:p-4">
              <div>
                <p className="text-sm tracking-wide text-white/50 uppercase">
                  {heroProduct?.category ?? "Aerial System"}
                </p>
                <h2 className="mt-2 text-4xl font-semibold max-sm:text-3xl">
                  {heroProduct?.name ?? "Aerial Platform"}
                </h2>
                <p className="mt-4 text-white/70 max-sm:text-sm">
                  Hybrid carbon fuselage, omnidirectional sensors, and a payload
                  rail ready for mapping or cinematic capture.
                </p>
              </div>
              <div className="mt-10 grid grid-cols-2 gap-6 text-white/70 max-md:mt-5 max-md:grid-cols-1 max-md:gap-3">
                <FeatureBadge
                  icon={BatteryCharging}
                  title="Smart batteries"
                  copy="Active balancing + thermal shielding"
                />
                <FeatureBadge
                  icon={Wind}
                  title="Wind-sliced frame"
                  copy="Tapered arm geometry for stable orbits"
                />
                <FeatureBadge
                  icon={Gauge}
                  title="Sport flight"
                  copy="Boost to 94 km/h with horizon lock"
                />
                <FeatureBadge
                  icon={Shield}
                  title="Fail-safe return"
                  copy="Triple GNSS with predictive reroute"
                />
                <FeatureBadge
                  icon={BatteryCharging}
                  title="Smart batteries"
                  copy="Active balancing + thermal shielding"
                />
                <FeatureBadge
                  icon={Wind}
                  title="Wind-sliced frame"
                  copy="Tapered arm geometry for stable orbits"
                />
                <FeatureBadge
                  icon={Gauge}
                  title="Sport flight"
                  copy="Boost to 94 km/h with horizon lock"
                />
                <FeatureBadge
                  icon={Shield}
                  title="Fail-safe return"
                  copy="Triple GNSS with predictive reroute"
                />
              </div>
            </div>
          </ScrollReveal>
          <div className="flex md:justify-center lg:hidden">
            <button
              type="button"
              onClick={openContactModal}
              className="group relative inline-flex h-16 w-64 items-center justify-center overflow-hidden rounded-2xl bg-white text-lg font-bold text-black uppercase transition-all duration-300 ease-out will-change-transform hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.35),inset_0_-6px_20px_rgba(0,0,0,0.45)] focus-visible:ring-2 focus-visible:ring-[#0A84FF] focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.93] active:shadow-[inset_0_1px_6px_rgba(255,255,255,0.5),inset_0_-8px_22px_rgba(0,0,0,0.65)] max-md:h-12 max-md:w-full"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-8 py-16 max-sm:py-12">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <ScrollReveal amount={0.25}>
            <div>
              <p className="text-foreground/50 text-sm tracking-wider uppercase">
                Technology Focus
              </p>
              <h2 className="text-3xl font-semibold">
                DJI-level polish, tuned for rugged autonomy.
              </h2>
              <p className="text-foreground/70 mt-2 max-w-2xl text-sm">
                These capability stacks mirror the Mavic series feel: responsive
                sticks, cinematic brakes, and intuitive fail-safes.
              </p>
            </div>
          </ScrollReveal>
        </header>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {techFocus.map((feature, index) => (
            <ScrollReveal key={feature.title} amount={0.2} delay={0.06 * index}>
              <article className="bg-secondary/30 text-foreground rounded-3xl border border-white/10 p-5 shadow-inner shadow-black/30">
                <feature.icon className="h-8 w-8 text-white/80" />
                <h3 className="mt-6 text-2xl font-semibold">{feature.title}</h3>
                <p className="text-foreground/70 mt-3 text-sm">
                  {feature.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {feature.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs tracking-wide text-white/50 uppercase shadow-sm shadow-black/15 backdrop-blur-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>
      <section className="relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] flex aspect-1440/960 w-screen items-end bg-[url(/pdetail-bg-img-1.png)] bg-cover bg-center max-lg:aspect-auto max-lg:min-h-[360px] max-md:min-h-[300px]">
        <div className="container mx-auto px-6 pb-12.5 max-[1281px]:px-5 max-sm:px-4 lg:pb-25">
          <ScrollReveal
            amount={0.25}
            className="space-y-5 max-md:space-y-4 max-md:text-center"
          >
            <div>
              <span className="border-border/10 rounded-[30px] border bg-white/20 px-4 py-2 uppercase backdrop-blur-xs">
                Charasteristics
              </span>
            </div>
            <h1 className="text-5xl font-bold max-lg:text-4xl max-sm:text-3xl">
              Jet-Powered Speed
            </h1>
            <p className="text-foreground/70 text-lg max-sm:text-base">
              The jet propulsion engine provides high speed and agility,
              enabling the AX2ng KRAKATIT to effectively respond to dynamic
              combat situations and reach its targets rapidly.
            </p>
          </ScrollReveal>
        </div>
      </section>
      <section className="py-16 max-sm:py-12">
        <div className="flex w-full items-start justify-end max-lg:justify-start">
          <ScrollReveal
            amount={0.25}
            className="space-y-5 text-right max-lg:text-left max-md:space-y-4"
          >
            <div className="flex justify-end max-lg:justify-start">
              <p className="text-sm tracking-wider uppercase">
                Characteristics
              </p>
            </div>

            <h1 className="text-5xl leading-tight font-bold max-lg:text-4xl max-sm:text-3xl">
              Multipurpose Assault
            </h1>

            <p className="text-foreground/70 text-lg leading-relaxed max-sm:text-base">
              The AX2ng KRAKATIT is capable of attack high-value ground targets
              as well as aerial targets, including UAVs flying up to 300 km/h
              and helicopters. This makes the AX2ng KRAKATIT a versatile
              military platform.
            </p>
          </ScrollReveal>
        </div>
      </section>
      <section className="relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] flex w-screen items-end bg-white">
        <div className="container m-auto grid grid-cols-1 gap-12 px-6 py-12 max-[1281px]:px-5 max-sm:px-4 max-sm:py-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <ScrollReveal
              amount={0.25}
              className="flex flex-col items-start justify-center gap-4 text-left lg:max-w-[480px]"
            >
              <h1 className="text-[28px] font-bold text-black max-sm:text-2xl">
                Supportive firing capability to
              </h1>
              <ul className="mt-7.5 space-y-7.5 text-[#314D77]/65">
                <li className="flex max-w-[420px] items-center gap-3">
                  <span className="mt-1 inline-flex h-4 w-4 items-center justify-center">
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#314D77]/30 bg-[#314D77]/10">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#314D77]" />
                    </span>
                  </span>

                  <span>
                    Land force fire units (mechanized, motorized, infantry,
                    artillery barrel, artillery mortar …)
                  </span>
                </li>
                <li className="flex max-w-[420px] gap-3">
                  <span className="mt-1 inline-flex h-4 w-4 items-center justify-center">
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#314D77]/30 bg-[#314D77]/10">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#314D77]" />
                    </span>
                  </span>

                  <span>Special force units.</span>
                </li>
              </ul>
            </ScrollReveal>
            <ScrollReveal
              amount={0.25}
              delay={0.08}
              className="w-full max-w-150 max-lg:max-w-100 lg:w-auto"
            >
              <img
                src="/drone-product-detail-1.png"
                alt=""
                className="w-full object-contain"
              />
            </ScrollReveal>
          </div>
          <div className="flex flex-col-reverse gap-8 lg:flex-row lg:items-center lg:justify-between">
            <ScrollReveal
              amount={0.25}
              delay={0.06}
              className="w-full max-w-175 max-lg:max-w-125 lg:w-auto"
            >
              <img
                src="/drone-product-detail-2.png"
                alt=""
                className="w-full object-contain"
              />
            </ScrollReveal>
            <ScrollReveal
              amount={0.25}
              delay={0.12}
              className="flex flex-col justify-center gap-4 text-left"
            >
              <h1 className="max-w-111 text-[28px] font-bold text-balance text-black max-sm:text-2xl">
                Wherever and whenever the operational use of the main weapons is
                tactically impossible, inappropriate or disadvantageous:
              </h1>
              <ul className="mt-2 space-y-7.5 text-[#314D77]/65">
                <li className="flex max-w-[420px] items-center gap-3">
                  <span className="mt-1 inline-flex h-4 w-4 items-center justify-center">
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#314D77]/30 bg-[#314D77]/10">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#314D77]" />
                    </span>
                  </span>

                  <span>Long time preparation of firing position.</span>
                </li>
                <li className="flex max-w-[420px] gap-3">
                  <span className="mt-1 inline-flex h-4 w-4 items-center justify-center">
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#314D77]/30 bg-[#314D77]/10">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#314D77]" />
                    </span>
                  </span>
                  <span>Firing preparation time</span>
                </li>
                <li className="flex max-w-[420px] gap-3">
                  <span className="mt-1 inline-flex h-4 w-4 items-center justify-center">
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#314D77]/30 bg-[#314D77]/10">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#314D77]" />
                    </span>
                  </span>
                  <span>Unmasking effects</span>
                </li>
              </ul>
            </ScrollReveal>
          </div>
        </div>
      </section>
      <section className="relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] flex aspect-1440/960 w-screen items-end bg-[url(/pdetail-bg-img-2.png)] bg-cover bg-center max-lg:aspect-auto max-lg:min-h-[360px] max-md:min-h-[300px]">
        <div className="container mx-auto px-6 pb-12.5 max-[1281px]:px-5 max-sm:px-4 lg:pb-25">
          <ScrollReveal
            amount={0.25}
            className="space-y-5 max-md:space-y-4 max-md:text-center"
          >
            <div>
              <span className="border-border/10 rounded-[30px] border bg-white/20 px-4 py-2 uppercase backdrop-blur-xs">
                Booster
              </span>
            </div>
            <h1 className="text-5xl font-bold max-lg:text-4xl max-sm:text-3xl">
              AX2NG KRAKATIT
            </h1>
          </ScrollReveal>
          <div className="flex max-md:justify-center">
            <ScrollReveal amount={0.2} delay={0.1}>
              <button
                type="button"
                onClick={openContactModal}
                className="group relative mt-12 inline-flex h-14 w-48 items-center justify-center overflow-hidden rounded-2xl bg-white text-lg font-bold text-black uppercase transition-all duration-300 ease-out will-change-transform hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.35),inset_0_-6px_20px_rgba(0,0,0,0.45)] focus-visible:ring-2 focus-visible:ring-[#0A84FF] focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.93] active:shadow-[inset_0_1px_6px_rgba(255,255,255,0.5),inset_0_-8px_22px_rgba(0,0,0,0.65)] max-md:h-12 max-md:w-36 max-md:text-base"
              >
                Contact Us
              </button>
            </ScrollReveal>
          </div>
        </div>
      </section>
      <section className="relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] flex aspect-1440/960 w-screen items-end bg-[url(/pdetail-bg-img-3.png)] bg-cover bg-center max-lg:aspect-auto max-lg:min-h-[360px] max-md:min-h-[300px]">
        <div className="container mx-auto px-6 pb-12.5 max-[1281px]:px-5 max-sm:px-4 lg:pb-25">
          <ScrollReveal
            amount={0.25}
            className="space-y-5 max-md:space-y-4 max-md:text-center"
          >
            <div>
              <span className="border-border/10 rounded-[30px] border bg-white/20 px-4 py-2 uppercase backdrop-blur-xs">
                Swarm system
              </span>
            </div>
            <h1 className="text-5xl font-bold max-lg:text-4xl max-sm:text-3xl">
              AX2NG KRAKATIT
            </h1>
          </ScrollReveal>
          <ScrollReveal
            amount={0.2}
            delay={0.1}
            className="flex max-md:justify-center"
          >
            <button
              type="button"
              onClick={openContactModal}
              className="group relative mt-12 inline-flex h-14 w-48 items-center justify-center overflow-hidden rounded-2xl bg-white text-lg font-bold text-black uppercase transition-all duration-300 ease-out will-change-transform hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.35),inset_0_-6px_20px_rgba(0,0,0,0.45)] focus-visible:ring-2 focus-visible:ring-[#0A84FF] focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.93] active:shadow-[inset_0_1px_6px_rgba(255,255,255,0.5),inset_0_-8px_22px_rgba(0,0,0,0.65)] max-md:h-12 max-md:w-36 max-md:text-base"
            >
              Contact Us
            </button>
          </ScrollReveal>
        </div>
      </section>
      <section className="my-16 space-y-6 rounded-4xl border border-white/10 bg-white/5 px-4 py-10 max-sm:py-8 md:px-8">
        <ScrollReveal delay={0.12} amount={0.3}>
          <Carousel
            carouselTitle="Other Products"
            items={DRONE_CAROUSEL_DATA.map((card, index) => (
              <Card
                key={card.title}
                card={{
                  ...card,
                  video: `/drone-carousel-video-${index + 1}.MP4`,
                }}
                index={index}
              />
            ))}
          />
        </ScrollReveal>
        {status === "error" ? (
          <div className="rounded-3xl border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-200">
            {errorMessage ?? "Catalog data load have failed."}
          </div>
        ) : null}
      </section>
    </div>
  );
}

interface FeatureBadgeProps {
  icon: LucideIcon;
  title: string;
  copy: string;
}

function FeatureBadge({ icon: Icon, title, copy }: FeatureBadgeProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white">
      <Icon className="h-5 w-5 text-white/80" />
      <p className="mt-3 text-sm font-semibold">{title}</p>
      <p className="text-xs text-white/70">{copy}</p>
    </div>
  );
}

const DRONE_CAROUSEL_DATA = [
  {
    category: "Drone",
    title: "AX2NG KRAKATIT",
    description: "Jet engine KAMIKAZE drone with AI",
    bg: "/drone-carousel-bg-1.png",
  },
  {
    category: "Drone",
    title: "AV2 VTOL",
    description: "Vertical take-of and landing aircraft",
    bg: "/drone-carousel-bg-2.png",
  },
  {
    category: "Copter",
    title: "AXQ",
    description: "Lightweight 10-inch multicopter",
    bg: "/drone-carousel-bg-3.png",
  },

  {
    category: "UGV",
    title: "UGV 150-DU",
    description: "Unmanned ground platform",
    bg: "/drone-carousel-bg-4.png",
  },
  {
    category: "GCS",
    title: "Ground Control Station",
    description: " Unihed control for all platforms",
    bg: "/drone-carousel-bg-5.png",
  },
];
