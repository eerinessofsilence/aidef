import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  ArrowUpRight,
  BatteryCharging,
  Camera,
  Cpu,
  Gauge,
  Layers,
  Radio,
  Shield,
  Sparkles,
} from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface ProductImage {
  id: number;
  url: string | null;
  alt: string | null;
  order: number;
}

interface FuelOption {
  id: number;
  name: string;
  extra_price: number | null;
  capacity: string | null;
  notes: string;
}

interface MagazineOption {
  id: number;
  name: string;
  capacity: number | null;
  caliber: string | null;
  extra_price: number | null;
  notes: string;
}

interface Accessory {
  id: number;
  name: string;
  sku: string | null;
  price: number | null;
  quantity: number;
  extra_price: number | null;
}

type SpecPrimitive = string | number | null;
type SpecPayload =
  | Record<string, SpecPrimitive>
  | Array<Record<string, SpecPrimitive> | string | number | null>;

interface ProductDetailPayload {
  id: number;
  name: string;
  slug: string;
  price: number;
  discount?: number | null;
  price_after_discount?: number | null;
  product_type?: string;
  available: boolean;
  category?: Category | null;
  description: string;
  sku?: string | null;
  specs?: SpecPayload | null;
  created_at: string;
  updated_at: string;
  images: ProductImage[];
  fuel_options: FuelOption[];
  magazine_options: MagazineOption[];
  accessories: Accessory[];
}

type Status = "idle" | "loading" | "ready" | "error";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const galleryFallback = [
  {
    id: -1,
    url: "/placeholder.svg",
    alt: "Placeholder aerial frame",
    order: 0,
  },
];

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetailPayload | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!id) {
      setErrorMessage("Missing product identifier.");
      setStatus("error");
      return;
    }

    const controller = new AbortController();
    setStatus("loading");
    axios
      .get<ProductDetailPayload>(
        `${import.meta.env.VITE_API_URL}/items/${id}/`,
        {
          signal: controller.signal,
        },
      )
      .then((res) => {
        setProduct(res.data);
        setStatus("ready");
        setErrorMessage(null);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          return;
        }
        console.error("Unable to load product", err);
        setErrorMessage("We couldn’t load this platform right now.");
        setStatus("error");
      });

    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product?.id]);

  const galleryImages = useMemo(() => {
    if (product?.images?.length) {
      return product.images.filter((image) => Boolean(image.url));
    }
    return galleryFallback;
  }, [product]);

  const specEntries = useMemo(() => {
    if (!product?.specs) {
      return [];
    }

    if (Array.isArray(product.specs)) {
      return product.specs
        .map((entry, index) => {
          if (entry && typeof entry === "object" && !Array.isArray(entry)) {
            const parsed = entry as {
              label?: string;
              value?: SpecPrimitive;
            };
            const label =
              typeof parsed.label === "string"
                ? parsed.label
                : `Detail ${index + 1}`;
            const value =
              parsed.value !== undefined && parsed.value !== null
                ? String(parsed.value)
                : "—";
            return { label, value };
          }
          if (typeof entry === "string" || typeof entry === "number") {
            return { label: `Detail ${index + 1}`, value: String(entry) };
          }
          return null;
        })
        .filter(Boolean) as Array<{ label: string; value: string }>;
    }

    return Object.entries(product.specs).map(([label, value]) => ({
      label: label.replace(/_/g, " "),
      value: value !== null && value !== undefined ? String(value) : "—",
    }));
  }, [product]);

  const capabilityDeck = useMemo(() => {
    const categoryLabel = product?.category?.name ?? "Aerial System";
    return [
      {
        icon: Gauge,
        title: "Flight Envelope",
        copy:
          product?.product_type === "drone"
            ? "Sport+ tuned sticks with DJI-style horizon lock."
            : "Precision-stabilized platform with predictable control curves.",
        meta: categoryLabel,
      },
      {
        icon: Radio,
        title: "Link Intelligence",
        copy: "Tri-band encrypted uplink mirrors the Mavic’s rock-solid transmission feel.",
        meta: "SkyShield Link",
      },
      {
        icon: Layers,
        title: "OmniSense Mapping",
        copy: "Neural obstacle prediction + terrain tracing for aggressive low-altitude passes.",
        meta: "360° coverage",
      },
      {
        icon: Sparkles,
        title: "AI Mission Stack",
        copy: "Autonomous behaviors, waypoint macros, and on-edge vision cues for rapid deployments.",
        meta: "Live tuning",
      },
    ];
  }, [product]);

  const createdDate = product
    ? new Date(product.created_at).toLocaleDateString()
    : null;
  const updatedDate = product
    ? new Date(product.updated_at).toLocaleDateString()
    : null;

  const primaryImage =
    galleryImages[currentImageIndex] ?? galleryImages[0] ?? null;

  const formatPrice = (value?: number | null) => {
    if (value === null || value === undefined) {
      return null;
    }
    return currencyFormatter.format(value);
  };

  const isLoading = status === "loading" && !product;
  const showErrorBanner = status === "error" && !product && errorMessage;

  return (
    <main className="bg-background text-foreground">
      <div className="mx-auto max-w-6xl space-y-12 px-6 py-14 lg:px-10">
        {showErrorBanner ? (
          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-sm text-red-100">
            {errorMessage}
          </div>
        ) : null}

        {isLoading ? (
          <div className="bg-secondary/20 animate-pulse rounded-4xl border border-white/5 p-12 text-sm text-white/70">
            Syncing mission data...
          </div>
        ) : null}

        {product ? (
          <>
            <section className="relative overflow-hidden rounded-4xl border border-white/10 bg-linear-to-br from-white/15 via-white/5 to-transparent p-10 shadow-[0_30px_120px_rgba(0,0,0,0.35)]">
              <div className="absolute top-0 -right-16 h-64 w-64 rounded-full bg-[#6ad1ff]/20 blur-3xl" />
              <div className="absolute -bottom-16 -left-12 h-72 w-72 rounded-full bg-[#7b5bff]/20 blur-3xl" />
              <div className="relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
                <div>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 text-xs tracking-wide text-white/70 uppercase"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Catalog
                  </Link>
                  <p className="mt-6 text-xs tracking-wide text-white/60 uppercase">
                    {product.category?.name ?? "Aerial System"}
                  </p>
                  <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
                    {product.name}
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm text-white/80">
                    {product.description ||
                      "Precision-built platform with DJI-grade ergonomics, adaptive payload rails, and cinematic stabilization ready for autonomous missions."}
                  </p>
                  <div className="mt-10 flex flex-wrap items-center gap-6">
                    <div>
                      <p className="text-xs tracking-wide text-white/60 uppercase">
                        Mission-ready from
                      </p>
                      <div className="mt-2 flex items-end gap-3">
                        <span className="text-4xl font-semibold">
                          {formatPrice(
                            product.price_after_discount ?? product.price,
                          )}
                        </span>
                        {product.discount ? (
                          <span className="text-base text-white/60 line-through">
                            {formatPrice(product.price)}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs tracking-wide text-white uppercase">
                      {product.available ? "Available" : "Waitlist"}
                    </div>
                  </div>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <button className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold tracking-wide text-white uppercase transition hover:border-white/40 hover:bg-white/20">
                      Configure mission
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2 text-sm tracking-wide text-white/80 uppercase hover:border-white/30">
                      Download spec sheet
                    </button>
                  </div>
                </div>
                <div className="rounded-[28px] border border-white/10 bg-black/30 p-8 backdrop-blur-2xl">
                  <dl className="grid gap-6 text-sm text-white/80">
                    <MetaRow label="SKU" value={product.sku ?? "N/A"} />
                    <MetaRow
                      label="Type"
                      value={product.product_type ?? "Platform"}
                    />
                    <MetaRow
                      label="Category"
                      value={product.category?.name ?? "Unassigned"}
                    />
                    <MetaRow label="Last Update" value={updatedDate ?? "—"} />
                    <MetaRow label="Introduced" value={createdDate ?? "—"} />
                    <MetaRow
                      label="Availability"
                      value={product.available ? "Ready to deploy" : "In queue"}
                    />
                  </dl>
                </div>
              </div>
            </section>

            <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="bg-secondary/20 space-y-5 rounded-4xl border border-white/10 p-6">
                <div className="rounded-3xl border border-white/10 bg-black/40 p-4">
                  {primaryImage?.url ? (
                    <img
                      src={primaryImage.url}
                      alt={primaryImage.alt ?? product.name}
                      className="h-[420px] w-full rounded-[20px] object-cover"
                    />
                  ) : (
                    <div className="bg-secondary/40 flex h-[420px] items-center justify-center rounded-[20px] text-sm text-white/70">
                      Visual coming soon.
                    </div>
                  )}
                </div>
                {galleryImages.length > 1 ? (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {galleryImages.map((image, index) => (
                      <button
                        key={image.id}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-20 w-28 shrink-0 overflow-hidden rounded-2xl border ${
                          index === currentImageIndex
                            ? "border-white/60"
                            : "border-white/10"
                        }`}
                      >
                        {image.url ? (
                          <img
                            src={image.url}
                            alt={image.alt ?? `Gallery ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="bg-secondary/40 h-full w-full" />
                        )}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="rounded-4xl border border-white/10 bg-white/5 p-6">
                <p className="tracking-ultra-wide text-xs text-white/60 uppercase">
                  Capability Highlights
                </p>
                <div className="mt-6 space-y-6">
                  {capabilityDeck.map((feature) => (
                    <article
                      key={feature.title}
                      className="rounded-3xl border border-white/10 bg-black/40 p-5"
                    >
                      <feature.icon className="h-6 w-6 text-white/80" />
                      <p className="mt-4 text-sm tracking-wide text-white/50 uppercase">
                        {feature.meta}
                      </p>
                      <h3 className="text-2xl font-semibold">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-sm text-white/70">
                        {feature.copy}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {specEntries.length ? (
              <section className="bg-secondary/30 space-y-6 rounded-4xl border border-white/10 p-8">
                <header>
                  <p className="tracking-ultra-wide text-xs text-white/60 uppercase">
                    Specifications
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold">
                    Mission-tuned spec sheet
                  </h2>
                  <p className="mt-1 text-sm text-white/70">
                    Data surfaced from the AI-DEF inventory to mirror the Mavic
                    experience—clean, glanceable, and field ready.
                  </p>
                </header>
                <dl className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {specEntries.map((spec) => (
                    <div
                      key={`${spec.label}-${spec.value}`}
                      className="rounded-2xl border border-white/10 bg-black/30 p-5"
                    >
                      <dt className="text-xs tracking-wide text-white/60 uppercase">
                        {spec.label}
                      </dt>
                      <dd className="mt-2 text-xl font-semibold text-white">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}

            <section className="grid gap-8 md:grid-cols-2">
              <DetailCard
                icon={Camera}
                title="Payload Ecosystem"
                copy="Modular rail mounts echo DJI’s Flex-port, so you can snap on cinema glass, LiDAR pods, or thermal stacks mid-mission."
              />
              <DetailCard
                icon={BatteryCharging}
                title="Power Stack"
                copy="Smart packs with hot-swap support keep sorties flowing without rebooting avionics."
              />
              <DetailCard
                icon={Shield}
                title="Failsafe Layer"
                copy="Triple GNSS fusion combines inertial estimates for confident RTH even through interference."
              />
              <DetailCard
                icon={Cpu}
                title="AI Compute"
                copy="Edge modules crunch detections onboard, syncing insights to command once the link clears."
              />
            </section>

            {product.fuel_options.length > 0 ? (
              <OptionSection
                title="Power Modules"
                intro="Choose battery or fuel options tuned for your sortie profile."
                options={product.fuel_options.map((option) => ({
                  id: option.id,
                  title: option.name,
                  meta: option.capacity ?? undefined,
                  description: option.notes,
                  price: option.extra_price,
                }))}
              />
            ) : null}

            {product.magazine_options.length > 0 ? (
              <OptionSection
                title="Magazine Kits"
                intro="Swap-ready magazines keep specialty payloads topped up."
                options={product.magazine_options.map((option) => ({
                  id: option.id,
                  title: option.name,
                  meta: option.caliber
                    ? `${option.caliber} • ${option.capacity ?? "—"} rounds`
                    : option.capacity
                      ? `${option.capacity} capacity`
                      : undefined,
                  description: option.notes,
                  price: option.extra_price,
                }))}
              />
            ) : null}

            {product.accessories.length > 0 ? (
              <OptionSection
                title="Accessory Stack"
                intro="Complete the loadout with companion controllers, mounts, and ground gear."
                options={product.accessories.map((accessory) => ({
                  id: accessory.id,
                  title: accessory.name,
                  meta: accessory.sku ?? undefined,
                  description: `Qty ${accessory.quantity}${
                    accessory.extra_price
                      ? ` • +${formatPrice(accessory.extra_price)}`
                      : ""
                  }`,
                  price: accessory.price,
                }))}
              />
            ) : null}
          </>
        ) : null}
      </div>
    </main>
  );
}

interface MetaRowProps {
  label: string;
  value: string | null;
}

function MetaRow({ label, value }: MetaRowProps) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-3 last:border-none last:pb-0">
      <span className="text-white/50">{label}</span>
      <span className="font-semibold text-white">{value ?? "—"}</span>
    </div>
  );
}

interface DetailCardProps {
  icon: LucideIcon;
  title: string;
  copy: string;
}

function DetailCard({ icon: Icon, title, copy }: DetailCardProps) {
  return (
    <article className="rounded-[28px] border border-white/10 bg-white/5 p-6">
      <Icon className="h-6 w-6 text-white/80" />
      <h3 className="mt-4 text-2xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-white/70">{copy}</p>
    </article>
  );
}

interface OptionSectionProps {
  title: string;
  intro: string;
  options: Array<{
    id: number;
    title: string;
    meta?: string;
    description?: string;
    price?: number | null;
  }>;
}

function OptionSection({ title, intro, options }: OptionSectionProps) {
  const formatPrice = (value?: number | null) => {
    if (value === undefined || value === null) {
      return null;
    }
    return currencyFormatter.format(value);
  };

  return (
    <section className="bg-secondary/20 space-y-6 rounded-4xl border border-white/10 p-8">
      <header>
        <p className="tracking-ultra-wide text-xs text-white/60 uppercase">
          {title}
        </p>
        <p className="mt-1 text-sm text-white/70">{intro}</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {options.map((option) => (
          <article
            key={option.id}
            className="rounded-3xl border border-white/10 bg-black/40 p-5"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs tracking-wide text-white/60 uppercase">
                  {option.meta ?? title}
                </p>
                <h3 className="text-xl font-semibold">{option.title}</h3>
              </div>
              {formatPrice(option.price) ? (
                <span className="text-sm font-semibold text-white/80">
                  {formatPrice(option.price)}
                </span>
              ) : null}
            </div>
            {option.description ? (
              <p className="mt-3 text-sm text-white/70">{option.description}</p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
