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
  description?: string; // <- чтобы не ругался на отсутствие
  category: string | null; // slug, а не объект
  price: number;
  discount?: number | null;
  price_after_discount?: number | null;
  available: boolean;
  is_featured?: boolean;
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

  const heroProduct = useMemo(
    () => items.find((p) => (p as any).is_featured) ?? items[0],
    [items],
  );

  const formatPrice = (value?: number | null) => {
    if (value === undefined || value === null) {
      return "—";
    }
    return currencyFormatter.format(value);
  };

  const gridItems: GridItem[] = useMemo(() => {
    if (status === "loading" && items.length === 0) {
      return Array.from(
        { length: 3 },
        (_, index): GridItem => ({
          id: -(index + 1),
          slug: "",
          name: "Loading system",
          description: "",
          category: null,
          price: 0,
          discount: null,
          price_after_discount: null,
          available: false,
          placeholder: true,
        }),
      );
    }
    return items;
  }, [items, status]);

  return (
    <div className="container mx-auto min-h-screen space-y-16 pt-48 pb-24 max-[1281px]:px-5">
      <section className="relative overflow-hidden rounded-4xl border border-white/10 bg-linear-to-br from-white/10 via-white/5 to-transparent p-10 text-white shadow-[0_40px_120px_rgba(0,0,0,0.35)]">
        <div className="absolute top-0 -right-24 h-72 w-72 rounded-full bg-[#6ad1ff]/30 blur-3xl" />
        <div className="absolute -bottom-16 -left-10 h-56 w-72 rounded-full bg-[#7b5bff]/30 blur-3xl" />
        <div className="relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm tracking-wide text-white/50 uppercase">
              Characteristics
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
              About product
            </h1>
            <p className="mt-4 max-w-2xl text-base text-white/70">
              {heroProduct?.description ?? "Aerial Platform"}
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
            <div>
              <Link
                to="#"
                className="group relative mt-12 inline-flex h-14 w-48 items-center justify-center overflow-hidden rounded-2xl bg-white text-lg font-bold text-black uppercase transition-all duration-300 ease-out will-change-transform hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.35),inset_0_-6px_20px_rgba(0,0,0,0.45)] focus-visible:ring-2 focus-visible:ring-[#0A84FF] focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.93] active:shadow-[inset_0_1px_6px_rgba(255,255,255,0.5),inset_0_-8px_22px_rgba(0,0,0,0.65)]"
              >
                Contact Us
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 rounded-4xl bg-linear-to-br from-white/30 via-white/5 to-transparent blur-3xl" />
            <div className="relative flex h-full flex-col justify-between rounded-4xl border border-white/15 bg-black/40 p-8 backdrop-blur-2xl">
              <div>
                <p className="text-sm tracking-wide text-white/50 uppercase">
                  {heroProduct?.category ?? "Aerial System"}
                </p>
                <h2 className="mt-2 text-4xl font-semibold">
                  {heroProduct?.name ?? "Aerial Platform"}
                </h2>
                <p className="mt-4 text-white/70">
                  Hybrid carbon fuselage, omnidirectional sensors, and a payload
                  rail ready for mapping or cinematic capture.
                </p>
              </div>
              <div className="mt-10 grid grid-cols-2 gap-4 text-white/80">
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
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
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
        </header>
        <div className="grid gap-6 md:grid-cols-3">
          {techFocus.map((feature) => (
            <article
              key={feature.title}
              className="bg-secondary/30 text-foreground rounded-3xl border border-white/10 p-6 shadow-inner shadow-black/30"
            >
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
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-foreground/50 text-sm tracking-wider uppercase">
              Product Lineup
            </p>
            <h2 className="text-3xl font-semibold">
              Choose the system that fits your mission.
            </h2>
          </div>
          <p className="text-foreground/15 text-sm">
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
          {gridItems.map((product) => {
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

            if (product.slug === heroProduct.slug) {
              return null;
            } else {
              return (
                <Link
                  key={product.id}
                  to={`/products/${product.slug}`}
                  className="group flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-white/30 hover:bg-white/10"
                >
                  <div>
                    <p className="text-foreground/50 text-sm tracking-wide uppercase">
                      {product.category ?? "Aerial System"}
                    </p>
                    <h3 className="text-foreground mt-2 text-2xl font-semibold">
                      {product.name}
                    </h3>
                    <p className="text-foreground/70 mt-3 text-sm">
                      {product.description?.slice(0, 100) + "…"}
                    </p>
                  </div>
                  <div>
                    <div className="text-foreground mt-4 flex items-end gap-3">
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
                    <div className="text-foreground/70 mt-6 flex items-center justify-between text-xs tracking-wide uppercase">
                      <span>View specs</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                  </div>
                </Link>
              );
            }
          })}
        </div>

        {status === "ready" && items.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Inventory is syncing. Check back shortly for live products.
          </p>
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
