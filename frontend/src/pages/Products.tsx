import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  BatteryCharging,
  Camera,
  Gauge,
  Layers,
  Radio,
  Shield,
  Wind,
} from "lucide-react";

interface Product {
  id: number;
  slug: string;
  name: string;
  price: number;
  discount?: number | null;
  price_after_discount?: number | null;
  category?: {
    id: number;
    name: string;
    slug: string;
  } | null;
  product_type?: string;
}

type GridItem = Product & { placeholder?: boolean };

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

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

const experienceTracks = [
  {
    title: "Field Deployment Kit",
    description:
      "Mission tablet, smart batteries, ruggedized cases, and live telemetry routing so crews can spin up in under 15 minutes.",
    meta: "Deploy < 15 min",
  },
  {
    title: "Cinematic Suite",
    description:
      "Color-managed pipelines, ND stack, creative LUTs, and gyro data exports for buttery DJI-grade aerial footage.",
    meta: "Broadcast ready",
  },
];

const taglinePalette = [
  "Reconnaissance-grade optics",
  "Cinematic dynamic range",
  "Modular payload ecosystem",
  "Ultralight, wind-stable frame",
];

export default function Products() {
  const [items, setItems] = useState<Product[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const heroProduct = items[0];
  const supportingProducts = items.slice(0, 3);

  const formatPrice = (value?: number | null) => {
    if (value === undefined || value === null) {
      return "—";
    }
    return currencyFormatter.format(value);
  };

  const gridItems: GridItem[] = useMemo(() => {
    if (status === "loading" && items.length === 0) {
      return Array.from({ length: 3 }, (_, index) => ({
        id: -(index + 1),
        slug: "",
        name: "Loading system",
        price: 0,
        placeholder: true,
      }));
    }
    return items;
  }, [items, status]);

  return (
    <main className="bg-background text-foreground">
      <div className="mx-auto min-h-screen max-w-6xl space-y-16 px-6 py-16 lg:px-10">
        <section className="relative overflow-hidden rounded-4xl border border-white/10 bg-linear-to-br from-white/10 via-white/5 to-transparent p-10 text-white shadow-[0_40px_120px_rgba(0,0,0,0.35)]">
          <div className="absolute top-0 -right-24 h-72 w-72 rounded-full bg-[#6ad1ff]/30 blur-3xl" />
          <div className="absolute -bottom-16 -left-10 h-56 w-72 rounded-full bg-[#7b5bff]/30 blur-3xl" />
          <div className="relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-xs tracking-wide text-white/60 uppercase">
                Aerial Systems Collection
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
                Edge-class drones inspired by the DJI Mavic flagship feel.
              </h1>
              <p className="mt-4 max-w-2xl text-base text-white/80">
                Agile, long-range, and cinematic. Dial in the payload, swap to
                stealth or broadcast lenses, and trust the same level of polish
                you expect from DJI’s Mavic line—tailored for AI-driven flight.
              </p>
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                {statHighlights.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm"
                  >
                    <p className="text-sm tracking-wide text-white/60 uppercase">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
                    <p className="text-sm text-white/70">{stat.detail}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 rounded-4xl bg-linear-to-br from-white/30 via-white/5 to-transparent blur-3xl" />
              <div className="relative rounded-4xl border border-white/15 bg-black/40 p-8 backdrop-blur-2xl">
                <p className="text-xs tracking-wide text-white/50 uppercase">
                  Flagship Platform
                </p>
                <h2 className="mt-4 text-3xl font-semibold">
                  {heroProduct?.name ?? "Aerial Platform"}
                </h2>
                <p className="mt-2 text-sm text-white/70">
                  Hybrid carbon fuselage, omnidirectional sensors, and a payload
                  rail ready for mapping or cinematic capture.
                </p>
                <div className="mt-8 flex items-end gap-3">
                  <span className="text-4xl font-semibold">
                    {formatPrice(
                      heroProduct?.price_after_discount ?? heroProduct?.price,
                    )}
                  </span>
                  {heroProduct?.discount ? (
                    <span className="text-base text-white/50 line-through">
                      {formatPrice(heroProduct.price)}
                    </span>
                  ) : null}
                </div>
                {heroProduct ? (
                  <Link
                    to={`/products/${heroProduct.category?.slug}`}
                    className="mt-8 inline-flex items-center gap-2 text-sm font-medium tracking-wide text-white uppercase"
                  >
                    Explore flagship
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <p className="mt-8 text-sm text-white/70">
                    Syncing live inventory...
                  </p>
                )}
                {supportingProducts.length > 0 ? (
                  <div className="mt-8 flex flex-wrap gap-3">
                    {supportingProducts.map((product) => (
                      <span
                        key={product.id}
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs tracking-wide text-white/70 uppercase"
                      >
                        {product.name}
                      </span>
                    ))}
                  </div>
                ) : null}
                <div className="mt-10 grid gap-4 text-white/80 sm:grid-cols-2">
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
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="tracking-ultra-wide text-muted-foreground text-xs uppercase">
                Technology Focus
              </p>
              <h2 className="text-3xl font-semibold">
                DJI-level polish, tuned for rugged autonomy.
              </h2>
              <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
                These capability stacks mirror the Mavic series feel: responsive
                sticks, cinematic brakes, and intuitive fail-safes.
              </p>
            </div>
          </header>
          <div className="grid gap-6 md:grid-cols-3">
            {techFocus.map((feature) => (
              <article
                key={feature.title}
                className="bg-secondary/30 text-foreground rounded-3xl border border-white/10 p-6 shadow-inner shadow-black/20"
              >
                <feature.icon className="h-8 w-8 text-white/80" />
                <h3 className="mt-6 text-2xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground mt-3 text-sm">
                  {feature.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {feature.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs tracking-wide text-white/70 uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="tracking-ultra-wide text-muted-foreground text-xs uppercase">
                Product Lineup
              </p>
              <h2 className="text-3xl font-semibold">
                Choose the system that fits your mission.
              </h2>
            </div>
            <p className="text-muted-foreground text-sm">
              Real-time inventory synced from{" "}
              <span className="font-semibold">AI-DEF</span> command.
            </p>
          </header>

          {status === "error" ? (
            <div className="rounded-3xl border border-red-500/50 bg-red-500/10 p-6 text-sm text-red-200">
              {errorMessage}
            </div>
          ) : null}

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {gridItems.map((product, index) => {
              const tagline = taglinePalette[index % taglinePalette.length];
              const isPlaceholder = Boolean(product.placeholder);

              if (isPlaceholder) {
                return (
                  <div
                    key={product.id}
                    className="bg-secondary/20 animate-pulse rounded-3xl border border-white/5 p-6"
                  >
                    <div className="h-4 w-24 rounded-full bg-white/10" />
                    <div className="mt-4 h-7 w-40 rounded-full bg-white/10" />
                    <div className="mt-6 h-16 rounded-2xl bg-white/5" />
                    <div className="mt-6 h-5 w-32 rounded-full bg-white/10" />
                  </div>
                );
              }

              return (
                <Link
                  key={product.id}
                  to={`/products/${product.slug}`}
                  className="group flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-white/30 hover:bg-white/10"
                >
                  <div>
                    <p className="text-muted-foreground text-xs tracking-wide uppercase">
                      {product.category?.name ?? "Aerial System"}
                    </p>
                    <h3 className="text-foreground mt-3 text-2xl font-semibold">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground mt-3 text-sm">
                      {tagline}
                    </p>
                  </div>
                  <div>
                    <div className="text-foreground mt-8 flex items-end gap-3">
                      <span className="text-3xl font-semibold">
                        {formatPrice(
                          product.price_after_discount ?? product.price,
                        )}
                      </span>
                      {product.discount ? (
                        <span className="text-muted-foreground text-sm line-through">
                          {formatPrice(product.price)}
                        </span>
                      ) : null}
                    </div>
                    <div className="text-muted-foreground mt-6 flex items-center justify-between text-xs tracking-wide uppercase">
                      <span>View specs</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {status === "ready" && items.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Inventory is syncing. Check back shortly for live products.
            </p>
          ) : null}
        </section>

        <section className="from-secondary/60 via-secondary/30 to-secondary/10 space-y-8 rounded-4xl border border-white/10 bg-linear-to-r p-8">
          <header>
            <p className="tracking-ultra-wide text-xs text-white/60 uppercase">
              Mission Programs
            </p>
            <h2 className="mt-3 text-3xl font-semibold">
              Build your own DJI-style ecosystem.
            </h2>
            <p className="mt-2 text-sm text-white/80">
              Pair drones, controllers, viewers, and cloud services just like
              Mavic pilots do—only now with open AI behaviors and modular rails.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            {experienceTracks.map((track) => (
              <article
                key={track.title}
                className="rounded-3xl border border-white/10 bg-black/30 p-6 text-white"
              >
                <div className="text-xs tracking-wide text-white/50 uppercase">
                  {track.meta}
                </div>
                <h3 className="mt-4 text-2xl font-semibold">{track.title}</h3>
                <p className="mt-2 text-sm text-white/80">
                  {track.description}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium tracking-wide text-white/80 uppercase">
                  Talk to mission design
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
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
