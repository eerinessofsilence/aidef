import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "react-router-dom";
import { Carousel, Card } from "../../components/ui/apple-cards-carousel";
import { ScrollReveal } from "../../components/ui/scroll-reveal";
import { dispatchOpenContactModal } from "../../lib/contact-modal";

interface Product {
  id: number;
  slug: string;
  name: string;
  description?: string;
  category: string | null;
  available: boolean;
  is_featured?: boolean;
}

interface ProductImage {
  id: number;
  url: string | null;
  alt?: string | null;
  order?: number | null;
}

interface ProductFeature {
  id: number;
  name: string;
  value: string;
  description: string;
  order?: number | null;
}

interface ProductSubFeature {
  id: number;
  name: string;
  description: string;
  order?: number | null;
}

interface ProductTechnology {
  id: number;
  name: string;
  description: string;
  tags: Array<string>;
  order?: number | null;
}

interface ProductFeatureBlock {
  id: number;
  name: string;
  title: string;
  description: string;
  background_image: string | null;
  with_logo: boolean;
  order?: number | null;
}

interface ProductInfoBlock {
  id: number;
  title_1: string;
  description_1: Array<string>;
  image_1: string;
  title_2: string;
  description_2: Array<string>;
  image_2: string;
  order?: number | null;
}

interface ProductCTABlock {
  id: number;
  name: string;
  title: string;
  background_image: string;
  has_button: boolean;
  order?: number | null;
}

interface ProductDetail extends Product {
  specs?: string | null;
  created_at?: string;
  updated_at?: string;
  images?: ProductImage[];
  features?: ProductFeature[];
  sub_features?: ProductSubFeature[];
  technologies?: ProductTechnology[];
  feature_blocks?: ProductFeatureBlock[];
  info_blocks?: ProductInfoBlock[];
  cta_blocks?: ProductCTABlock[];
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [items, setItems] = useState<Product[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [productDetail, setProductDetail] = useState<ProductDetail | null>(
    null,
  );
  const [detailStatus, setDetailStatus] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");
  const [detailError, setDetailError] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
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

  useEffect(() => {
    if (!slug) {
      return;
    }

    const controller = new AbortController();
    setDetailStatus("loading");
    setDetailError(null);
    setProductDetail(null);

    axios
      .get<ProductDetail>(`${import.meta.env.VITE_API_URL}/items/${slug}/`, {
        signal: controller.signal,
      })
      .then((res) => {
        setProductDetail(res.data);
        setDetailStatus("ready");
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          return;
        }
        console.error("Unable to load product detail", err);
        setDetailError("Couldn't load product data.");
        setDetailStatus("error");
      });

    return () => controller.abort();
  }, [slug]);

  const heroProduct = useMemo(
    () => productDetail ?? items.find((p) => p.is_featured) ?? items[0] ?? null,
    [productDetail, items],
  );

  const productImages = useMemo(() => {
    const images = productDetail?.images ?? [];
    return [...images]
      .filter((img): img is ProductImage & { url: string } => Boolean(img.url))
      .sort(
        (a, b) =>
          (a.order ?? Number.MAX_SAFE_INTEGER) -
          (b.order ?? Number.MAX_SAFE_INTEGER),
      );
  }, [productDetail]);

  const productFeatures = useMemo(() => {
    const features = productDetail?.features ?? [];
    return [...features].sort(
      (a, b) =>
        (a.order ?? Number.MAX_SAFE_INTEGER) -
          (b.order ?? Number.MAX_SAFE_INTEGER) || a.id - b.id,
    );
  }, [productDetail]);

  const productSubFeatures = useMemo(() => {
    const sub_features = productDetail?.sub_features ?? [];
    return [...sub_features].sort(
      (a, b) =>
        (a.order ?? Number.MAX_SAFE_INTEGER) -
          (b.order ?? Number.MAX_SAFE_INTEGER) || a.id - b.id,
    );
  }, [productDetail]);

  const productTechnologies = useMemo(() => {
    const technologies = productDetail?.technologies ?? [];
    return [...technologies].sort(
      (a, b) =>
        (a.order ?? Number.MAX_SAFE_INTEGER) -
          (b.order ?? Number.MAX_SAFE_INTEGER) || a.id - b.id,
    );
  }, [productDetail]);

  const productFeatureBlocks = useMemo(() => {
    const blocks = productDetail?.feature_blocks ?? [];
    return [...blocks].sort(
      (a, b) =>
        (a.order ?? Number.MAX_SAFE_INTEGER) -
          (b.order ?? Number.MAX_SAFE_INTEGER) || a.id - b.id,
    );
  }, [productDetail]);

  const productInfoBlocks = useMemo(() => {
    const blocks = productDetail?.info_blocks ?? [];
    return [...blocks].sort(
      (a, b) =>
        (a.order ?? Number.MAX_SAFE_INTEGER) -
          (b.order ?? Number.MAX_SAFE_INTEGER) || a.id - b.id,
    );
  }, [productDetail]);

  const productCTABlocks = useMemo(() => {
    const blocks = productDetail?.cta_blocks ?? [];
    return [...blocks].sort(
      (a, b) =>
        (a.order ?? Number.MAX_SAFE_INTEGER) -
          (b.order ?? Number.MAX_SAFE_INTEGER) || a.id - b.id,
    );
  }, [productDetail]);

  useEffect(() => {
    setActiveSlide(0);
  }, [productImages.length, productDetail?.slug]);

  const handlePrevSlide = () => {
    if (productImages.length < 2) return;
    setActiveSlide(
      (prev) => (prev - 1 + productImages.length) % productImages.length,
    );
  };

  const handleNextSlide = () => {
    if (productImages.length < 2) return;
    setActiveSlide((prev) => (prev + 1) % productImages.length);
  };

  return (
    <div className="relative min-h-screen max-lg:pt-28 max-md:pb-7">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 lg:hidden">
        <img src="/site-bg-top.png" className="w-full select-none" alt="" />
      </div>
      <ScrollReveal amount={0.35} className="w-full">
        <div>
          <div className="relative aspect-video w-full overflow-hidden bg-linear-to-br from-white/10 via-white/5 to-transparent">
            {detailStatus === "loading" ? (
              <div className="absolute inset-0 animate-pulse bg-white/10" />
            ) : productImages.length > 0 ? (
              <>
                {productImages.map((image, index) => (
                  <div
                    key={image.id}
                    className={`pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-600 ${
                      activeSlide === index ? "z-10 opacity-100" : "opacity-0"
                    }`}
                  >
                    <img
                      src={image.url ?? ""}
                      alt={image.alt ?? heroProduct?.name ?? "Product image"}
                      className={`h-full w-full object-cover ${
                        activeSlide === index ? "animate-kenburns-slow" : ""
                      }`}
                    />
                    <div
                      className={`pointer-events-none absolute inset-0 bg-linear-to-b from-black/30 via-black/5 to-black/50 ${
                        activeSlide === index ? "animate-slide-glow" : ""
                      }`}
                    />
                    <div
                      className={`pointer-events-none absolute inset-10 ${
                        activeSlide === index ? "animate-slide-glow" : ""
                      }`}
                    />
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                      <div
                        className={`absolute top-0 -left-1/3 h-full w-1/3 skew-x-12 bg-linear-to-r from-white/0 via-white/30 to-white/0 ${
                          activeSlide === index
                            ? "animate-sweep-shimmer opacity-70"
                            : "opacity-0"
                        }`}
                      />
                    </div>
                  </div>
                ))}
                <div className="absolute bottom-8 left-8 z-20 max-w-[70%] text-white drop-shadow-[0_6px_18px_rgba(0,0,0,0.6)] max-md:bottom-4 max-md:left-4 max-md:max-w-[90%]">
                  <p className="text-foreground/50 tracking-wider uppercase">
                    {productDetail?.category}
                  </p>
                  <h1 className="text-5xl font-bold max-lg:text-4xl max-md:text-3xl">
                    {productDetail?.name}
                  </h1>
                </div>
                {productImages.length > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevSlide}
                      className="absolute top-1/2 left-4 z-20 inline-flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-black/60 text-white shadow-lg transition hover:border-white/50 hover:bg-black/80"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextSlide}
                      className="absolute top-1/2 right-4 z-20 inline-flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-black/60 text-white shadow-lg transition hover:border-white/50 hover:bg-black/80"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                ) : null}
              </>
            ) : (
              <img
                src="/hero-bg-1.png"
                className="absolute inset-0 h-full w-full object-cover"
                alt={heroProduct?.name ?? "Product hero"}
              />
            )}
          </div>
          {productImages.length > 1 ? (
            <div className="mt-5 flex items-center justify-center gap-2">
              {productImages.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Перейти к изображению ${index + 1}`}
                  className={`h-2.5 w-2.5 rounded-full border border-white/35 transition ${
                    activeSlide === index
                      ? "bg-white"
                      : "bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          ) : null}
          {detailStatus === "error" && detailError ? (
            <p className="mt-3 px-5 text-lg font-medium text-red-300">
              {detailError}
            </p>
          ) : null}
        </div>
      </ScrollReveal>
      <div className="px-5">
        {productDetail ? (
          <section className="relative container mx-auto my-16 overflow-hidden rounded-3xl border border-white/10 bg-linear-to-b from-white/10 via-white/5 to-transparent p-10 text-white shadow-[0_20px_120px_rgba(0,0,0,0.35)] max-xl:p-5">
            <div className="absolute top-0 -right-24 h-72 w-72 rounded-full bg-[#6ad1ff]/30 blur-3xl" />
            <div className="absolute -bottom-16 -left-10 h-56 w-72 rounded-full bg-[#7b5bff]/30 blur-3xl" />
            <div className="relative grid grid-cols-1 gap-12 max-lg:gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <ScrollReveal amount={0.35} className="h-full max-lg:col-span-2">
                <p className="text-sm tracking-wide text-white/50 uppercase">
                  Characteristics
                </p>
                <h1 className="mt-2 text-4xl font-semibold tracking-tight max-sm:text-3xl md:text-5xl">
                  About product
                </h1>
                <p className="mt-4 max-w-2xl text-base text-white/70 max-sm:text-sm">
                  {heroProduct?.description ?? "Aerial Platform"}
                </p>
                <div className="mt-5 grid grid-cols-2 gap-4 max-md:grid-cols-1 max-md:gap-2">
                  {productFeatures.map((feature) => (
                    <div
                      key={feature.id}
                      className="border-border/25 bg-foreground/5 space-y-2 rounded-2xl border p-5 backdrop-blur-md max-md:p-2.5"
                    >
                      <p className="text-foreground/50 text-sm tracking-wider uppercase">
                        {feature.name}
                      </p>
                      <p className="text-3xl font-semibold max-md:text-2xl">
                        {feature.value}
                      </p>
                      <p className="text-foreground/70">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="max-lg:hidden">
                  <a
                    onClick={openContactModal}
                    className="group relative mt-12 inline-flex h-14 w-48 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-white text-lg font-bold text-black uppercase transition-all duration-300 ease-out will-change-transform hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.35),inset_0_-6px_20px_rgba(0,0,0,0.45)] active:scale-[0.93] active:shadow-[inset_0_1px_6px_rgba(255,255,255,0.5),inset_0_-8px_22px_rgba(0,0,0,0.65)]"
                  >
                    Contact Us
                  </a>
                </div>
              </ScrollReveal>
              <ScrollReveal
                amount={0.35}
                className="relative max-lg:col-span-2"
              >
                <div className="absolute inset-0 top-5 rounded-4xl bg-linear-to-br from-white/15 via-white/10 blur-3xl" />
                <div className="relative flex flex-col justify-between rounded-4xl border border-white/15 bg-black/40 p-5 backdrop-blur-2xl">
                  <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1 max-md:gap-2">
                    {productSubFeatures.map((sub_feature) => (
                      <div
                        key={sub_feature.id}
                        className="bg-foreground/5 border-border/25 rounded-xl border p-5 max-md:p-2.5"
                      >
                        <h3 className="text-lg font-semibold">
                          {sub_feature.name}
                        </h3>
                        <p className="text-foreground/70">
                          {sub_feature.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
              <div className="flex max-lg:col-span-2 md:justify-center lg:hidden">
                <a
                  onClick={openContactModal}
                  className="group relative inline-flex h-16 w-64 items-center justify-center overflow-hidden rounded-2xl bg-white text-lg font-bold text-black uppercase transition-all duration-300 ease-out will-change-transform hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.35),inset_0_-6px_20px_rgba(0,0,0,0.45)] focus-visible:ring-2 focus-visible:ring-[#0A84FF] focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.93] active:shadow-[inset_0_1px_6px_rgba(255,255,255,0.5),inset_0_-8px_22px_rgba(0,0,0,0.65)] max-md:h-12 max-md:w-full max-md:text-base"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </section>
        ) : null}

        {productTechnologies.length > 0 ? (
          <section className="space-y-8 px-10 py-16 max-xl:px-5 max-sm:py-12">
            <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <ScrollReveal amount={0.25}>
                <div>
                  <p className="text-foreground/50 text-sm tracking-wider uppercase">
                    Technology Focus
                  </p>
                  <h2 className="text-3xl font-semibold">
                    Production-grade polish, tuned for rugged autonomy.
                  </h2>
                  <p className="text-foreground/70 mt-2 max-w-2xl">
                    Across UAVs, UGVs, and GCS, the control stack delivers
                    precise inputs, smooth dynamics, and intuitive safety layers
                    that feel instantly familiar to operators.
                  </p>
                </div>
              </ScrollReveal>
            </header>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {productTechnologies.map((technology) => (
                <ScrollReveal
                  key={technology.id}
                  amount={0.2}
                  delay={0.06 * technology.id}
                >
                  <article className="bg-secondary/30 text-foreground h-full rounded-3xl border border-white/10 p-5 shadow-inner shadow-black/30">
                    <h3 className="text-2xl font-semibold">
                      {technology.name}
                    </h3>
                    <p className="text-foreground/70 mt-3 text-sm">
                      {technology.description}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {technology.tags.map((tag) => (
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
        ) : null}
        {productFeatureBlocks.length > 0
          ? productFeatureBlocks.map((block) =>
              !block.with_logo ? (
                <section
                  key={block.id}
                  className={`relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] flex w-screen items-end px-5 ${
                    block.background_image
                      ? "aspect-1440/960 h-[70vh] bg-cover bg-center max-lg:aspect-auto max-lg:min-h-[360px] max-md:min-h-[300px]"
                      : ""
                  }`}
                  style={
                    block.background_image
                      ? { backgroundImage: `url(${block.background_image})` }
                      : undefined
                  }
                >
                  <ScrollReveal
                    amount={0.35}
                    className="container mx-auto space-y-5 px-10 pb-12.5 max-xl:px-5 max-md:space-y-4 max-md:text-center lg:pb-25"
                  >
                    <div>
                      <span className="border-border/10 rounded-[30px] border bg-white/20 px-4 py-2 uppercase backdrop-blur-xs">
                        {block.name}
                      </span>
                    </div>
                    <h1 className="text-5xl font-bold max-lg:text-4xl max-md:text-3xl">
                      {block.title}
                    </h1>
                    <p className="text-foreground/70 text-lg max-md:text-base">
                      {block.description}
                    </p>
                  </ScrollReveal>
                </section>
              ) : (
                <section className="container mx-auto py-16 max-sm:py-12">
                  <ScrollReveal
                    amount={0.25}
                    className="flex items-center justify-between px-10 max-xl:px-5 max-md:flex-col max-md:space-y-10"
                  >
                    <div className="max-md:text-center">
                      <p className="tracking-wider uppercase">{block.name}</p>
                      <h1 className="text-5xl leading-tight font-bold max-lg:text-4xl max-md:text-3xl">
                        {block.title}
                      </h1>
                      <p className="text-foreground/70 mt-2 max-w-lg text-lg leading-relaxed max-md:text-base">
                        {block.description}
                      </p>
                    </div>
                    <div>
                      <img
                        src="/focus-areas-core.svg"
                        className="mx-10 w-60 max-md:w-50 max-sm:w-40"
                        alt=""
                      />
                    </div>
                  </ScrollReveal>
                </section>
              ),
            )
          : null}
        {productInfoBlocks.length > 0
          ? productInfoBlocks.map((block) => (
              <section className="relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] flex w-screen items-end bg-white">
                <div className="container m-auto grid grid-cols-1 gap-12 px-15 py-12 max-xl:px-10 max-sm:py-10">
                  <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                    <ScrollReveal
                      amount={0.25}
                      className="flex flex-col items-start justify-center gap-4 text-left lg:max-w-[480px]"
                    >
                      <h1 className="text-5xl font-bold text-black max-lg:text-4xl max-md:text-3xl">
                        {block.title_1}
                      </h1>
                      <ul className="space-y-3 text-black">
                        {block.description_1.map((tag) => (
                          <li className="flex max-w-[420px] items-center gap-3">
                            <span className="text-lg max-md:text-base">
                              {tag}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </ScrollReveal>
                    <ScrollReveal
                      amount={0.25}
                      className="w-full max-w-150 max-lg:max-w-100 lg:w-auto"
                    >
                      <img
                        src={block.image_1}
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
                        src={block.image_2}
                        alt=""
                        className="w-full object-contain"
                      />
                    </ScrollReveal>
                    <ScrollReveal
                      amount={0.25}
                      delay={0.12}
                      className="flex flex-col justify-center gap-4 text-left"
                    >
                      <h1 className="max-w-lg text-5xl font-bold text-balance text-black max-lg:text-4xl max-md:text-3xl">
                        {block.title_2}
                      </h1>
                      <ul className="space-y-3 text-black">
                        {block.description_2.map((tag) => (
                          <li className="flex max-w-[420px] items-center gap-3">
                            <span className="text-lg max-md:text-base">
                              {tag}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </ScrollReveal>
                  </div>
                </div>
              </section>
            ))
          : null}
        {productCTABlocks.length > 0
          ? productCTABlocks.map((block) => (
              <section className="relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] flex aspect-1440/960 w-screen items-end bg-[url(/pdetail-bg-img-2.png)] bg-cover bg-center max-lg:aspect-auto max-lg:min-h-[360px] max-md:min-h-[300px]">
                <div className="container mx-auto px-6 pb-12.5 max-xl:px-5 max-sm:px-4 lg:pb-25">
                  <ScrollReveal
                    amount={0.25}
                    className="space-y-5 max-md:space-y-4 max-md:text-center"
                  >
                    <div>
                      <span className="border-border/10 rounded-[30px] border bg-white/20 px-4 py-2 uppercase backdrop-blur-xs">
                        {block.name}
                      </span>
                    </div>
                    <h1 className="text-5xl font-bold max-lg:text-4xl max-sm:text-2xl">
                      {block.title}
                    </h1>
                    {block.has_button ? (
                      <ScrollReveal
                        amount={0.2}
                        delay={0.1}
                        className="flex max-md:justify-center"
                      >
                        <a
                          onClick={openContactModal}
                          className="group :ring-[#0A84FF] relative mt-12 inline-flex h-14 w-48 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-white text-lg font-bold text-black uppercase transition-all duration-300 ease-out will-change-transform hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.35),inset_0_-6px_20px_rgba(0,0,0,0.45)] active:scale-[0.93] active:shadow-[inset_0_1px_6px_rgba(255,255,255,0.5),inset_0_-8px_22px_rgba(0,0,0,0.65)] max-md:text-base"
                        >
                          Contact Us
                        </a>
                      </ScrollReveal>
                    ) : null}
                  </ScrollReveal>
                </div>
              </section>
            ))
          : null}
        <section className="my-16 space-y-6 py-10 max-sm:py-8">
          <ScrollReveal delay={0.12} amount={0.3}>
            <Carousel
              carouselTitle="All Products"
              items={data.map((card, index) => (
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
    </div>
  );
}

const data = [
  {
    category: "Drone",
    title: "AX2NG KRAKATIT",
    href: "/products/ax2ng-krakatit",
    description: "Jet engine KAMIKAZE drone with AI",
    bg: "/drone-carousel-bg-1.png",
  },
  {
    category: "Drone",
    title: "AV2 VTOL",
    href: "/products/av2-vtol",
    description: "Vertical take-of and landing aircraft",
    bg: "/drone-carousel-bg-2.png",
  },
  {
    category: "Quadrocopter",
    title: "AXQ",
    href: "/products/axq-quadrocopter",
    description: "Lightweight 10-inch multicopter",
    bg: "/drone-carousel-bg-3.png",
  },

  {
    category: "UGV",
    title: "UGV 150-DUP",
    href: "/products/ugv-150-dup",
    description: "Unmanned ground platform",
    bg: "/drone-carousel-bg-4.png",
  },
  {
    category: "Drone controls",
    title: "Ground Control Station",
    href: "/products/ground-control-station",
    description: " Unihed control for all platforms",
    bg: "/drone-carousel-bg-5.png",
  },
];
