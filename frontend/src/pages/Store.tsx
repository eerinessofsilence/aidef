import { lazy, Suspense, useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowDown, Check, ChevronDown, ChevronLeft, ChevronRight, Maximize2, Plus, ShoppingCart, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import GlideSelect from "../../components/store/GlideSelect";
import SpotlightCard from "../../components/store/SpotlightCard";
import StoreFooter from "../../components/store/StoreFooter";
import StoreHeader from "../../components/store/StoreHeader";
import TechText from "../../components/store/TechText";
import galleryMetadata from "../../public/store/research/galleries.json";
import { buildLocalizedPath, resolveLanguage } from "../i18n";
import {
  storeAccessoryCategories,
  storeCategories,
  storeContactProducts,
  storeProducts,
  type StoreAccessoryCategory,
  type StoreCategory,
  type StoreProduct,
} from "./store-products";
import "./Store.css";

const ContactForm = lazy(() =>
  import("../../components/ui/contact-form").then((module) => ({
    default: module.ContactForm,
  })),
);

type StoreDialog = {
  type: "contact" | "cart" | "accessory";
  products?: StoreProduct[];
  productSelections?: { value: string; label: string }[];
  accessory?: StoreProduct;
} | null;

const gameAccessoryGroups = [
  {
    id: "sight",
    titleKey: "store.details.gameConfig.sight",
    options: [
      { value: "arc-reflex", labelKey: "store.accessoryNames.arcReflex" },
      { value: "orbit-holo", labelKey: "store.accessoryNames.orbitHolo" },
    ],
  },
  {
    id: "muzzle",
    titleKey: "store.details.gameConfig.muzzle",
    options: [
      { value: "veil-suppressor", labelKey: "store.accessoryNames.veilSuppressor" },
    ],
  },
  {
    id: "utility",
    titleKey: "store.details.gameConfig.utility",
    options: [
      { value: "luma-light", labelKey: "store.accessoryNames.lumaLight" },
    ],
  },
] as const;

const storeHeroStories: { category: StoreCategory; productId?: string; image?: string }[] = [
  { category: "automatic", productId: "g36" },
  { category: "pistols", productId: "usp" },
  { category: "accessories", image: "/store/accessories/accessories-category.png" },
];
const emptyAccessoryIds: string[] = [];
const HERO_STORY_DURATION = 5000;

function ProductImage({ product, hero = false, className = "" }: {
  product: StoreProduct;
  hero?: boolean;
  className?: string;
}) {
  return (
    <img
      src={product.image}
      alt={`${product.brand} ${product.name}`}
      width={product.width}
      height={product.height}
      loading={hero ? "eager" : "lazy"}
      fetchPriority={hero ? "high" : "auto"}
      decoding="async"
      sizes={hero ? "(min-width: 1024px) 55vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
      className={`store-product-image ${className}`}
    />
  );
}

function StoreProductPage({
  product,
  relatedProducts,
  onSelectProduct,
  onAddToCart,
  onAddSetupToCart,
  isProductInCart,
  currentConfiguration,
}: {
  product: StoreProduct;
  relatedProducts: StoreProduct[];
  onSelectProduct: (product: StoreProduct) => void;
  onAddToCart: (product: StoreProduct) => void;
  onAddSetupToCart: (product: StoreProduct, accessoryIds: string[]) => void;
  isProductInCart: (product: StoreProduct) => boolean;
  currentConfiguration: string[];
}) {
  const { t } = useTranslation();
  const { lng } = useParams();
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [selectedAccessories, setSelectedAccessories] = useState<Record<string, string>>(() =>
    Object.fromEntries(gameAccessoryGroups.map((group) => [
      group.id,
      currentConfiguration.find((id) => group.options.some((option) => option.value === id)) ?? "",
    ])),
  );
  const gallery = galleryMetadata.find((entry) => entry.id === product.id)?.images ?? [];
  const activeImage = gallery[activeIndex] ?? gallery[0];
  const imageSrc = activeImage?.local_path.replace(/^frontend\/public/, "") ?? product.image;
  const storePath = buildLocalizedPath(resolveLanguage(lng), "/store");
  const changeSlide = (direction: -1 | 1) => {
    setActiveIndex((index) => (index + direction + gallery.length) % gallery.length);
  };
  const selectedAccessoryIds = Object.values(selectedAccessories).filter(Boolean);

  useEffect(() => setActiveIndex(0), [product.id]);
  useEffect(() => {
    setSelectedAccessories(Object.fromEntries(gameAccessoryGroups.map((group) => [
      group.id,
      currentConfiguration.find((id) => group.options.some((option) => option.value === id)) ?? "",
    ])));
  }, [currentConfiguration, product.id]);

  return (
    <main id="store-top" className="container scroll-mt-28 pt-36 pb-36 md:pt-44 md:pb-28">
      <Link to={`${storePath}#catalog`} className="mb-8 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white">
        <ChevronLeft aria-hidden="true" className="h-4 w-4" />{t("store.details.backToCatalog")}
      </Link>
      <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-14">
        <section aria-label={t("store.details.galleryLabel")}>
          <div className="store-detail-gallery relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[28px] border border-white/10 bg-[#10213a] p-5 md:aspect-[16/10] md:p-10">
            <button type="button" onClick={() => setFullscreenOpen(true)} aria-label={t("store.details.openFullscreen")} className="absolute inset-0 grid cursor-zoom-in place-items-center p-5 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/70 md:p-10">
              <img src={imageSrc} alt={`${product.brand} ${product.name}`} className="h-full w-full object-contain" />
            </button>
            {gallery.length > 1 ? (
              <>
                <button type="button" onClick={() => changeSlide(-1)} aria-label={t("store.details.previousPhoto")} className="store-round-button absolute top-1/2 left-4 -translate-y-1/2 bg-[#10213a]/80 backdrop-blur"><ChevronLeft aria-hidden="true" className="h-5 w-5" /></button>
                <button type="button" onClick={() => changeSlide(1)} aria-label={t("store.details.nextPhoto")} className="store-round-button absolute top-1/2 right-4 -translate-y-1/2 bg-[#10213a]/80 backdrop-blur"><ChevronRight aria-hidden="true" className="h-5 w-5" /></button>
                <span className="absolute right-4 bottom-4 rounded-full bg-[#10213a]/85 px-3 py-1.5 text-xs text-white/75">{activeIndex + 1} / {gallery.length}</span>
              </>
            ) : null}
            <button type="button" onClick={() => setFullscreenOpen(true)} aria-label={t("store.details.openFullscreen")} className="store-round-button absolute top-4 right-4 bg-[#10213a]/80 backdrop-blur"><Maximize2 aria-hidden="true" className="h-4 w-4" /></button>
          </div>
          {gallery.length > 1 ? (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {gallery.map((image, index) => (
                <button key={image.local_path} type="button" onClick={() => setActiveIndex(index)} aria-label={t("store.details.selectPhoto", { current: index + 1 })} aria-pressed={activeIndex === index} className={`overflow-hidden rounded-xl border bg-[#10213a] p-2 transition-colors ${activeIndex === index ? "border-white/60" : "border-white/10 hover:border-white/30"}`}>
                  <img src={image.local_path.replace(/^frontend\/public/, "")} alt="" className="aspect-[4/3] w-full object-contain" />
                </button>
              ))}
            </div>
          ) : null}
          {activeImage ? <p className="mt-3 text-xs text-white/45">{t("store.details.photoCredit", { artist: activeImage.artist, license: activeImage.license })} · <a href={activeImage.source_url} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-white/75">{t("store.photo")}</a></p> : null}
        </section>

        <section className="self-center">
          <p className="store-kicker">{t("store.hero.kicker")} · {product.brand} / {t(`store.categories.${product.category}`)}</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight md:text-6xl">{product.name}</h1>
          <p className="mt-6 text-base leading-8 text-white/65">
            {t(product.category === "accessories" ? `store.accessoryDescriptions.${product.id}` : `store.descriptions.${product.id}`)}
          </p>
          <div className="mt-9">
            <h2 className="text-lg font-semibold">{t("store.details.characteristics")}</h2>
            <dl className="mt-4 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.025] px-5">
              {[
                [t("store.details.model"), product.name],
                [t("store.details.manufacturer"), product.brand],
                [t("store.details.category"), t(`store.categories.${product.category}`)],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-5 py-4 text-sm">
                  <dt className="text-white/50">{label}</dt><dd className="text-right font-medium text-white/85">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          {product.category === "accessories" ? (
            <div className="mt-9 hidden md:block">
              <button
                type="button"
                onClick={() => onAddToCart(product)}
                disabled={isProductInCart(product)}
                className="store-button disabled:cursor-default disabled:opacity-65"
              >
                <ShoppingCart aria-hidden="true" className="mr-2 inline h-4 w-4" />
                {t(isProductInCart(product) ? "store.accessories.alreadyInCart" : "store.accessories.addToCart")}
              </button>
            </div>
          ) : null}
        </section>
      </div>
      {product.category !== "accessories" ? (
        <section className="mt-12 rounded-[28px] border border-white/10 bg-white/[0.025] p-5 md:mt-16 md:p-8">
          <div className="mb-8">
            <div>
              <p className="store-kicker">{t("store.details.gameConfig.title")}</p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">{t("store.details.gameConfig.description")}</p>
            </div>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {gameAccessoryGroups.map((group) => (
              <div key={group.id}>
                <h3 className="mb-4 text-xs font-semibold tracking-wide text-white/60 uppercase">{t(group.titleKey)}</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {group.options.map((option) => {
                    const accessory = storeProducts.find((item) => item.id === option.value);
                    if (!accessory) return null;
                    const isSelected = selectedAccessories[group.id] === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => {
                          setSelectedAccessories((selected) => ({
                            ...selected,
                            [group.id]: selected[group.id] === option.value ? "" : option.value,
                          }));
                        }}
                        className={`group relative overflow-hidden rounded-2xl border p-3 text-left transition-colors focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none ${isSelected ? "border-white/50 bg-white/10" : "border-white/10 bg-white/[0.025] hover:border-white/25 hover:bg-white/[0.06]"}`}
                      >
                        <span className="mb-3 grid h-32 place-items-center rounded-xl bg-[#10213a] p-4">
                          <img src={accessory.image} alt="" className="max-h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" />
                        </span>
                        <span className="flex items-center justify-between gap-3">
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold">{t(option.labelKey)}</span>
                            <span className="mt-1 block line-clamp-2 text-xs leading-5 text-white/50">{t(`store.accessoryDescriptions.${accessory.id}`)}</span>
                          </span>
                          {isSelected ? <Check aria-hidden="true" className="h-4 w-4 shrink-0" /> : <Plus aria-hidden="true" className="h-4 w-4 shrink-0 text-white/55" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-end border-t border-white/10 pt-6">
            <button type="button" onClick={() => onAddSetupToCart(product, selectedAccessoryIds)} className="store-button hidden w-full md:inline-flex md:w-auto">
              <ShoppingCart aria-hidden="true" className="mr-2 inline h-4 w-4" />
              {t(isProductInCart(product) ? "store.accessories.updateSetupInCart" : "store.accessories.addSetupToCart")}
            </button>
          </div>
        </section>
      ) : null}
      {product.category === "accessories" ? <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/15 bg-[#14243d]/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-12px_36px_rgba(0,0,0,0.25)] backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-lg gap-2">
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            disabled={isProductInCart(product)}
            className="store-button min-w-0 flex-1 px-3 text-xs disabled:cursor-default disabled:opacity-65"
          >
            <ShoppingCart aria-hidden="true" className="h-4 w-4 shrink-0" />
            <span className="truncate">{t(isProductInCart(product) ? "store.accessories.alreadyInCart" : "store.accessories.addToCart")}</span>
          </button>
        </div>
      </div> : <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/15 bg-[#14243d]/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-12px_36px_rgba(0,0,0,0.25)] backdrop-blur-xl md:hidden">
        <button type="button" onClick={() => onAddSetupToCart(product, selectedAccessoryIds)} className="store-button mx-auto w-full max-w-lg">
          <ShoppingCart aria-hidden="true" className="h-4 w-4 shrink-0" />
          <span className="truncate">{t(isProductInCart(product) ? "store.accessories.updateSetupInCart" : "store.accessories.addSetupToCart")}</span>
        </button>
      </div>}
      <section className="mt-20 border-t border-white/10 pt-12 md:mt-28 md:pt-16">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="store-kicker">{t("store.details.relatedKicker")}</p>
            <h2 className="store-section-title mt-3">{t("store.details.relatedTitle")}</h2>
          </div>
          <Link to={`${storePath}#catalog`} className="store-button store-button-small">
            {t("store.details.viewAll")}<ChevronRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {relatedProducts.map((relatedProduct) => (
            <button key={relatedProduct.id} type="button" onClick={() => onSelectProduct(relatedProduct)} className="store-card rounded-3xl border border-white/10 bg-white/[0.025] p-5 text-left transition-colors hover:border-white/30 hover:bg-white/[0.05]">
              <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-[#10213a] p-5"><ProductImage product={relatedProduct} className="max-h-44 w-full" /></div>
              <p className="mt-5 text-[10px] tracking-widest text-white/45 uppercase">{relatedProduct.brand}</p>
              <span className="mt-1 flex items-center justify-between gap-4 text-xl font-semibold">{relatedProduct.name}<ChevronRight aria-hidden="true" className="h-5 w-5 text-white/45" /></span>
            </button>
          ))}
        </div>
      </section>
      <Dialog.Root open={fullscreenOpen} onOpenChange={setFullscreenOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-sm" />
          <Dialog.Content className="fixed inset-0 z-[160] flex items-center justify-center p-4 outline-none md:p-8">
            <Dialog.Title className="sr-only">{`${product.brand} ${product.name} ${t("store.details.galleryLabel")}`}</Dialog.Title>
            <Dialog.Close aria-label={t("store.details.closeFullscreen")} className="store-round-button absolute top-4 right-4 z-10 bg-white/10 text-white hover:bg-white/20"><X aria-hidden="true" className="h-5 w-5" /></Dialog.Close>
            <img src={imageSrc} alt={`${product.brand} ${product.name}`} className="max-h-[90dvh] max-w-[92vw] object-contain" />
            {gallery.length > 1 ? (
              <>
                <button type="button" onClick={() => changeSlide(-1)} aria-label={t("store.details.previousPhoto")} className="store-round-button absolute top-1/2 left-4 z-10 -translate-y-1/2 bg-white/10 text-white hover:bg-white/20 md:left-8"><ChevronLeft aria-hidden="true" className="h-6 w-6" /></button>
                <button type="button" onClick={() => changeSlide(1)} aria-label={t("store.details.nextPhoto")} className="store-round-button absolute top-1/2 right-4 z-10 -translate-y-1/2 bg-white/10 text-white hover:bg-white/20 md:right-8"><ChevronRight aria-hidden="true" className="h-6 w-6" /></button>
                <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white/85">{activeIndex + 1} / {gallery.length}</span>
              </>
            ) : null}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </main>
  );
}

function StoreCategoryPage({
  category,
  products,
  onSelectProduct,
  onAddToCart,
  isProductInCart,
}: {
  category: StoreCategory;
  products: StoreProduct[];
  onSelectProduct: (product: StoreProduct) => void;
  onAddToCart: (product: StoreProduct) => void;
  isProductInCart: (product: StoreProduct) => boolean;
}) {
  const { t } = useTranslation();
  const { lng } = useParams();
  const [searchParams] = useSearchParams();
  const reduceMotion = useReducedMotion();
  const accessoryFilterParam = searchParams.get("type");
  const requestedAccessoryCategory = storeAccessoryCategories.find((value) => value === accessoryFilterParam) ?? "all";
  const [accessoryCategory, setAccessoryCategory] = useState<StoreAccessoryCategory>(requestedAccessoryCategory);
  const [sortOrder, setSortOrder] = useState<"relevance" | "name">("relevance");
  useEffect(() => setAccessoryCategory(requestedAccessoryCategory), [requestedAccessoryCategory]);
  const accessoryOptions = storeAccessoryCategories.map((value) => ({
    value,
    label: t(`store.accessories.${value}`),
    tag: String(
      value === "all"
        ? products.length
        : products.filter((product) => product.accessoryCategory === value).length,
    ),
  }));
  const visibleProducts =
    category === "accessories" && accessoryCategory !== "all"
      ? products.filter((product) => product.accessoryCategory === accessoryCategory)
      : products;
  const sortedProducts = sortOrder === "name"
    ? [...visibleProducts].sort((first, second) => first.name.localeCompare(second.name))
    : visibleProducts;
  const storePath = buildLocalizedPath(resolveLanguage(lng), "/store");

  return (
    <main id="store-top" className="container pt-36 pb-24 md:pt-44">
      <Link
        to={`${storePath}#catalog`}
        className="mb-8 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
      >
        <ChevronLeft aria-hidden="true" className="h-4 w-4" />
        {t("store.details.backToCatalog")}
      </Link>
      <div className="mb-10 flex items-end justify-between gap-6 max-md:flex-col max-md:items-start">
        <div>
          <p className="store-kicker">{t("store.catalog.kicker")}</p>
          <h1 className="store-section-title mt-3">
            {t(`store.categories.${category}`)}
          </h1>
          <p className="mt-3 text-sm text-white/55">
            {t("store.catalog.modelCount", { count: visibleProducts.length })}
          </p>
        </div>
        <div className="flex w-full flex-wrap items-center gap-3 md:w-auto">
          {category === "accessories" ? (
            <GlideSelect
              options={accessoryOptions}
              value={accessoryCategory}
              onChange={setAccessoryCategory}
              ariaLabel={t("store.catalog.accessoryFilters")}
            />
          ) : null}
          <label className="flex min-w-0 flex-1 items-center gap-3 md:flex-none">
            <span className="shrink-0 text-xs text-white/55">{t("store.catalog.sortBy")}</span>
            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value as "relevance" | "name")}
              className="min-h-11 min-w-0 flex-1 rounded-xl border border-white/15 bg-[#172b4a] px-3 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-white/60 md:flex-none"
            >
              <option value="relevance">{t("store.catalog.sortRelevance")}</option>
              <option value="name">{t("store.catalog.sortName")}</option>
            </select>
          </label>
        </div>
      </div>

      {visibleProducts.length ? (
        <motion.div
          initial={{ opacity: reduceMotion ? 1 : 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {sortedProducts.map((product, index) => (
            <SpotlightCard
              key={product.id}
              className="store-card overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] tracking-widest text-white/40 uppercase">
                  {t(`store.categories.${product.category}`)}
                </span>
                <span className="text-xs text-white/50">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <button type="button" onClick={() => onSelectProduct(product)} aria-label={`${t("store.actions.details")}: ${product.name}`} className="block w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70">
                <div className="relative flex aspect-[4/3] items-center justify-center py-7">
                  <ProductImage product={product} className="max-h-44 w-full" />
                </div>
              </button>
              <div className="border-t border-white/10 pt-5">
                <p className="text-[10px] tracking-widest text-white/40 uppercase">{product.brand}</p>
                <div className="mt-1 flex items-center justify-between gap-3">
                  <button type="button" onClick={() => onSelectProduct(product)} className="truncate text-left text-2xl font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-white/70">
                    {product.name}
                  </button>
                  <button
                    type="button"
                    onClick={() => onAddToCart(product)}
                    disabled={isProductInCart(product)}
                    aria-label={t(isProductInCart(product) ? "store.accessories.alreadyInCart" : product.category === "accessories" ? "store.accessories.addToCart" : "store.accessories.addModelToCart")}
                    title={t(isProductInCart(product) ? "store.accessories.alreadyInCart" : product.category === "accessories" ? "store.accessories.addToCart" : "store.accessories.addModelToCart")}
                    className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full bg-white text-[#14243d] shadow-lg transition hover:scale-105 hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white disabled:cursor-default disabled:bg-white/20 disabled:text-white/65 disabled:shadow-none"
                  >
                    {isProductInCart(product) ? <Check aria-hidden="true" className="h-5 w-5" /> : <Plus aria-hidden="true" className="h-5 w-5" />}
                  </button>
                </div>
                <button type="button" onClick={() => onSelectProduct(product)} className="mt-4 text-xs text-white/45 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-white/70">
                  {t("store.actions.details")}
                </button>
              </div>
            </SpotlightCard>
          ))}
        </motion.div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-8 text-sm leading-7 text-white/60">
          {t("store.catalog.accessoriesComingSoon")}
        </div>
      )}
    </main>
  );
}

export default function Store() {
  const { t } = useTranslation();
  const { lng, productId, categoryId } = useParams();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [dialog, setDialog] = useState<StoreDialog>(null);
  const [cartIds, setCartIds] = useState<string[]>([]);
  const [cartConfigurations, setCartConfigurations] = useState<Record<string, string[]>>({});
  const [expandedCartProductId, setExpandedCartProductId] = useState<string | null>(null);
  const [activeHeroStoryIndex, setActiveHeroStoryIndex] = useState(0);
  const [heroStoryPaused, setHeroStoryPaused] = useState(false);
  const dialogOpener = useRef<HTMLElement | null>(null);
  const dialogClose = useRef<HTMLButtonElement | null>(null);
  const activeHeroStory = storeHeroStories[activeHeroStoryIndex];
  const heroProduct = activeHeroStory.productId
    ? storeProducts.find((product) => product.id === activeHeroStory.productId)
    : undefined;
  const detailProduct = storeProducts.find((product) => product.id === productId);
  const activeCategory = storeCategories.find((category) => category === categoryId);
  const relatedProducts = detailProduct
    ? storeProducts.filter((product) => product.id !== detailProduct.id && product.category === detailProduct.category).slice(0, 3)
    : [];
  const visibleRelatedProducts = relatedProducts.length
    ? relatedProducts
    : detailProduct ? storeProducts.filter((product) => product.id !== detailProduct.id).slice(0, 3) : [];
  const heroTitle = t("store.hero.title");
  const featuredProducts = storeProducts.slice(0, 3);
  const categoryProducts = activeCategory
    ? storeProducts.filter((product) => product.category === activeCategory)
    : [];
  const cartProducts = cartIds.flatMap((id) => {
    const product = storeProducts.find((item) => item.id === id);
    return product ? [product] : [];
  });
  const configuredAccessoryIds = new Set(Object.values(cartConfigurations).flat());
  const cartDisplayProducts = cartProducts.filter((product) =>
    product.category !== "accessories" || !configuredAccessoryIds.has(product.id),
  );
  const dialogProductSelections = dialog?.productSelections ?? dialog?.products?.map((product) => ({
    value: product.id,
    label: `${product.brand} ${product.name}`,
  }));
  const openDialog = (nextDialog: NonNullable<StoreDialog>) => {
    if (dialog === null && document.activeElement instanceof HTMLElement) {
      dialogOpener.current = document.activeElement;
    }
    setDialog(nextDialog);
  };
  const openAccessory = (accessory: StoreProduct) =>
    openDialog({ type: "accessory", accessory });
  const addAccessoryToCart = (accessory: StoreProduct) => {
    setCartIds((ids) => ids.includes(accessory.id) ? ids : [...ids, accessory.id]);
    setDialog(null);
  };
  const addSetupToCart = (product: StoreProduct, accessoryIds: string[]) => {
    const previousAccessoryIds = cartConfigurations[product.id] ?? [];
    const accessoryIdsOnOtherModels = new Set(
      Object.entries(cartConfigurations)
        .filter(([modelId]) => modelId !== product.id)
        .flatMap(([, ids]) => ids),
    );
    const retainedAccessoryIds = new Set([...accessoryIds, ...accessoryIdsOnOtherModels]);
    setCartIds((ids) => [
      ...new Set([
        ...ids.filter((id) => !previousAccessoryIds.includes(id) || retainedAccessoryIds.has(id)),
        product.id,
        ...accessoryIds,
      ]),
    ]);
    setCartConfigurations((current) => {
      const next = { ...current };
      if (accessoryIds.length) next[product.id] = accessoryIds;
      else delete next[product.id];
      return next;
    });
  };
  const toggleCartConfiguration = (weaponId: string, accessoryId: string) => {
    const selected = cartConfigurations[weaponId] ?? [];
    const removing = selected.includes(accessoryId);
    const nextSelected = removing
      ? selected.filter((id) => id !== accessoryId)
      : [...selected, accessoryId];
    const nextConfigurations = { ...cartConfigurations };
    if (nextSelected.length) nextConfigurations[weaponId] = nextSelected;
    else delete nextConfigurations[weaponId];
    setCartConfigurations(nextConfigurations);
    if (!removing) {
      setCartIds((ids) => ids.includes(accessoryId) ? ids : [...ids, accessoryId]);
    } else if (!Object.values(nextConfigurations).some((ids) => ids.includes(accessoryId))) {
      setCartIds((ids) => ids.filter((id) => id !== accessoryId));
    }
  };
  const removeCartProduct = (productId: string) => {
    setCartIds((ids) => ids.filter((id) => id !== productId));
    setCartConfigurations((current) => {
      const next = { ...current };
      delete next[productId];
      for (const weaponId of Object.keys(next)) {
        const accessories = next[weaponId].filter((id) => id !== productId);
        if (accessories.length) next[weaponId] = accessories;
        else delete next[weaponId];
      }
      return next;
    });
  };
  const openProduct = (product: StoreProduct) => {
    navigate(buildLocalizedPath(resolveLanguage(lng), `/store/${product.id}`));
  };

  useEffect(() => {
    const previousTitle = document.title;
    document.title = detailProduct
      ? `${detailProduct.name} | ${detailProduct.brand}`
      : activeCategory
        ? `${t(`store.categories.${activeCategory}`)} | ${t("store.brand")}`
        : `${t("store.brand")} | ${t("store.catalog.kicker")}`;
    return () => { document.title = previousTitle; };
  }, [activeCategory, detailProduct, t]);
  useEffect(() => {
    if (reduceMotion || heroStoryPaused || productId || categoryId) return;
    const timeout = window.setTimeout(() => {
      setActiveHeroStoryIndex((index) => (index + 1) % storeHeroStories.length);
    }, HERO_STORY_DURATION);
    return () => window.clearTimeout(timeout);
  }, [activeHeroStoryIndex, categoryId, heroStoryPaused, productId, reduceMotion]);
  const reveal = {
    initial: reduceMotion ? false as const : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.12 },
    transition: { duration: reduceMotion ? 0 : 0.55 },
  };

  return (
    <div className="store-page text-white">
      <StoreHeader
        cartCount={cartIds.length}
        onCartClick={() => openDialog({ type: "cart" })}
        onContactClick={() => openDialog({ type: "contact" })}
        detailPage={Boolean(productId || categoryId)}
        hideCart
      />
      <button
        type="button"
        onClick={() => openDialog({ type: "cart" })}
        aria-label={t("store.cart.open", { count: cartIds.length })}
        title={t("store.cart.open", { count: cartIds.length })}
        className="fixed right-3 top-1/2 z-[60] inline-flex min-h-12 -translate-y-1/2 cursor-pointer items-center gap-3 rounded-2xl border border-white/30 bg-linear-to-br from-white/20 via-white/10 to-white/5 px-4 py-3 text-white shadow-[0_12px_36px_rgba(0,0,0,0.3),0_0_24px_rgba(255,255,255,0.12),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl transition hover:scale-[1.03] hover:from-white/25 hover:via-white/15 hover:to-white/10 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white md:right-5"
      >
        <ShoppingCart aria-hidden="true" className="h-5 w-5 shrink-0" />
        <span className="text-sm font-semibold">{t("store.cart.title")}</span>
        {cartIds.length > 0 ? <span className="absolute -top-2 -right-2 grid h-6 min-w-6 place-items-center rounded-full border-2 border-[#172b4a] bg-red-500 px-1 text-[11px] font-bold leading-none text-white shadow-[0_0_12px_rgba(239,68,68,0.45)]">{cartIds.length}</span> : null}
      </button>

      {detailProduct ? <StoreProductPage
        key={detailProduct.id}
        product={detailProduct}
        relatedProducts={visibleRelatedProducts}
        onSelectProduct={openProduct}
        onAddToCart={(product) => setCartIds((ids) => ids.includes(product.id) ? ids : [...ids, product.id])}
        onAddSetupToCart={addSetupToCart}
        isProductInCart={(product) => cartIds.includes(product.id)}
        currentConfiguration={cartConfigurations[detailProduct.id] ?? emptyAccessoryIds}
      /> : productId ? (
        <main id="store-top" className="container pt-36 pb-24 text-white md:pt-44">
          <p className="text-white/65">{t("store.details.unavailable")}</p>
          <Link to={buildLocalizedPath(resolveLanguage(lng), "/store#catalog")} className="store-button mt-6">{t("store.details.backToCatalog")}</Link>
        </main>
      ) : categoryId && activeCategory ? (
        <StoreCategoryPage
          category={activeCategory}
          products={categoryProducts}
          onSelectProduct={(product) => product.category === "accessories" ? openAccessory(product) : openProduct(product)}
          onAddToCart={(product) => setCartIds((ids) => ids.includes(product.id) ? ids : [...ids, product.id])}
          isProductInCart={(product) => cartIds.includes(product.id)}
        />
      ) : categoryId ? (
        <main id="store-top" className="container pt-36 pb-24 text-white md:pt-44">
          <p className="text-white/65">{t("store.catalog.categoryNotFound")}</p>
          <Link to={buildLocalizedPath(resolveLanguage(lng), "/store#catalog")} className="store-button mt-6">{t("store.details.backToCatalog")}</Link>
        </main>
      ) : <main id="store-top" className="scroll-mt-24">
        <section className="store-hero relative isolate overflow-hidden">
          <div className="container grid min-h-[680px] items-center gap-10 py-20 lg:grid-cols-[0.9fr_1.1fr] max-md:py-12">
            <motion.div {...reveal} className="relative z-10">
              <p className="store-kicker">{t("store.hero.kicker")}</p>
              <h1 className="mt-7 max-w-xl text-5xl leading-[1.08] font-semibold tracking-[-0.045em] text-balance md:text-6xl xl:text-7xl">
                {reduceMotion ? heroTitle : (
                  <>
                    <span className="sr-only">{heroTitle}</span>
                    <TechText
                      key={heroTitle}
                      text={heroTitle}
                      fontSize={72}
                      letterSpacing={-0.045}
                      accentColor="#a9cfff"
                      strokeWidth={1}
                      dashLength={3}
                      dashGap={2}
                      specks={8}
                      labels={false}
                      draggable={false}
                      speed={0.57}
                    />
                  </>
                )}
              </h1>
              <p className="mt-6 max-w-md text-base leading-7 text-white/60 md:text-lg md:leading-8">{t("store.hero.description")}</p>
              <div className="mt-9 flex flex-wrap items-center gap-6">
                <a href="#catalog" className="store-button">{t("store.hero.cta")}<ArrowDown aria-hidden="true" className="h-4 w-4" /></a>
                <a href="#featured" className="store-text-link">{t("store.actions.exploreFeatured")}</a>
              </div>
            </motion.div>
            <motion.div {...reveal} onMouseEnter={() => setHeroStoryPaused(true)} onMouseLeave={() => setHeroStoryPaused(false)} className="relative flex min-h-80 flex-col justify-center lg:min-h-[440px]">
              <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-3 text-center text-[clamp(5rem,13vw,13rem)] leading-none font-bold tracking-[-0.08em] text-white/[0.035]">{heroProduct?.name ?? t(`store.categories.${activeHeroStory.category}`)}</span>
              <div aria-hidden="true" className="store-image-halo absolute inset-6" />
              <div role="tablist" aria-label={t("store.hero.kicker")} className="relative mb-3 flex gap-1.5 px-1">
                {storeHeroStories.map((story, index) => (
                  <button
                    key={story.category}
                    type="button"
                    role="tab"
                    aria-selected={activeHeroStoryIndex === index}
                    aria-label={t(`store.categories.${story.category}`)}
                    onClick={() => setActiveHeroStoryIndex(index)}
                    className="h-3 flex-1 cursor-pointer py-1"
                  >
                    <span className="block h-1 overflow-hidden rounded-full bg-white/20">
                      {activeHeroStoryIndex === index ? (
                        <span
                          key={activeHeroStoryIndex}
                          data-paused={heroStoryPaused}
                          className={reduceMotion ? "block h-full w-full rounded-full bg-white" : "store-story-progress block h-full rounded-full bg-white"}
                          style={reduceMotion ? undefined : { animationDuration: `${HERO_STORY_DURATION}ms` }}
                        />
                      ) : index < activeHeroStoryIndex ? <span className="block h-full w-full rounded-full bg-white/70" /> : null}
                    </span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => heroProduct
                  ? openProduct(heroProduct)
                  : navigate(buildLocalizedPath(resolveLanguage(lng), "/store/category/accessories"))}
                aria-label={heroProduct ? t("store.actions.viewNamed", { name: heroProduct.name }) : t("store.catalog.openCategory")}
                className="store-hero-product relative flex h-64 cursor-pointer items-center justify-center rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-white/60 lg:h-80"
              >
                <motion.div key={activeHeroStoryIndex} initial={reduceMotion ? false : { opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: reduceMotion ? 0 : 0.35 }} className="flex h-full w-full items-center justify-center">
                  {heroProduct ? <ProductImage product={heroProduct} hero className="max-h-64 w-full" /> : <img src={activeHeroStory.image} alt={t(`store.categories.${activeHeroStory.category}`)} className="max-h-64 w-full object-contain drop-shadow-[0_20px_16px_rgba(0,0,0,0.25)]" />}
                </motion.div>
              </button>
              <div className="relative mt-6 flex items-center justify-between gap-4 border-t border-white/15 pt-5">
                <div><p className="text-xs tracking-widest text-white/45 uppercase">{t(`store.categories.${activeHeroStory.category}`)}</p><p className="mt-1 text-xl font-semibold">{heroProduct?.name ?? t(`store.categories.${activeHeroStory.category}`)}</p></div>
                <span className="text-xs font-medium tracking-widest text-white/45">{String(activeHeroStoryIndex + 1).padStart(2, "0")} / {String(storeHeroStories.length).padStart(2, "0")}</span>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="featured" className="container scroll-mt-28 py-20 md:py-28">
          <motion.div {...reveal} className="mb-10 flex items-end justify-between gap-6 max-md:flex-col max-md:items-start">
            <div><p className="store-kicker">{t("store.featured.kicker")}</p><h2 className="store-section-title mt-3">{t("store.featured.title")}</h2></div>
          </motion.div>
          <div className="grid gap-5 md:grid-cols-2">
            {featuredProducts.map((product, index) => (
              <SpotlightCard {...reveal} key={product.id} role="button" tabIndex={0} onClick={() => openProduct(product)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openProduct(product); } }} className={`store-feature relative isolate cursor-pointer overflow-hidden rounded-[28px] border border-white/10 p-7 outline-none focus-visible:ring-2 focus-visible:ring-white/60 md:p-10 ${index === 0 ? "md:col-span-2 md:grid md:grid-cols-[0.8fr_1.2fr] md:items-center" : "flex flex-col"}`}>
                <div className={`relative z-10 ${index === 0 ? "max-w-sm" : "flex items-start justify-between gap-5"}`}>
                  <div>
                    <p className="store-kicker text-white/40">0{index + 1} / {t(`store.categories.${product.category}`)}</p>
                    <h3 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">{product.name}</h3>
                    <p className="mt-2 text-xs tracking-widest text-white/40 uppercase">{product.brand}</p>
                    {index === 0 ? <p className="mt-5 text-sm leading-7 text-white/60">{t(`store.descriptions.${product.id}`)}</p> : null}
                  </div>
                </div>
                <div className={`relative flex items-center justify-center rounded-2xl ${index === 0 ? "h-60 max-md:mt-8 md:h-80" : "mt-6 h-60"}`}>
                  <span aria-hidden="true" className="pointer-events-none absolute text-[clamp(5rem,10vw,10rem)] font-semibold tracking-tighter text-white/[0.035]">{product.name}</span>
                  <ProductImage product={product} className="relative max-h-56 w-full max-w-xl" />
                </div>
                {index > 0 ? <p className="mt-5 border-t border-white/10 pt-5 text-sm leading-6 text-white/55">{t(`store.descriptions.${product.id}`)}</p> : null}
              </SpotlightCard>
            ))}
          </div>
        </section>

        <section id="catalog" className="scroll-mt-24 border-y border-white/10 bg-[#10213a]/65 py-20 md:py-24">
          <div className="container">
            <motion.div {...reveal} className="mb-10">
              <p className="store-kicker">{t("store.catalog.kicker")}</p>
              <h2 className="store-section-title mt-3">{t("store.catalog.title")}</h2>
            </motion.div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {storeCategories.map((category, index) => {
                const categoryProducts = storeProducts.filter((product) => product.category === category);
                const previewProduct = categoryProducts[0];
                return previewProduct ? (
                  <SpotlightCard
                    {...reveal}
                    key={category}
                    transition={{ duration: reduceMotion ? 0 : 0.4, delay: reduceMotion ? 0 : index * 0.06 }}
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(buildLocalizedPath(resolveLanguage(lng), `/store/category/${category}`))}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        navigate(buildLocalizedPath(resolveLanguage(lng), `/store/category/${category}`));
                      }
                    }}
                    className="store-card cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-6 outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] tracking-widest text-white/40 uppercase">0{index + 1}</span>
                      <span className="text-xs text-white/50">{t("store.catalog.modelCount", { count: categoryProducts.length })}</span>
                    </div>
                    <div className="relative flex aspect-[4/3] items-center justify-center py-7">
                      <ProductImage product={previewProduct} className="max-h-44 w-full" />
                    </div>
                    <div className="border-t border-white/10 pt-5">
                      <h3 className="text-2xl font-semibold tracking-tight">{t(`store.categories.${category}`)}</h3>
                      <p className="mt-3 min-h-12 text-sm leading-6 text-white/55">{t(`store.categoryDescriptions.${category}`)}</p>
                    </div>
                    <p className="mt-4 text-xs text-white/45">{t("store.catalog.openCategory")}</p>
                  </SpotlightCard>
                ) : null;
              })}
            </div>
          </div>
        </section>

        <section id="contact" className="container scroll-mt-28 py-20 md:py-28">
          <motion.div {...reveal} className="store-feature relative overflow-hidden rounded-[32px] border border-white/15 p-8 md:flex md:items-center md:justify-between md:gap-10 md:p-14">
            <div className="max-w-xl"><p className="store-kicker">{t("store.contact.kicker")}</p><h2 className="store-section-title mt-4">{t("store.contact.ctaTitle")}</h2><p className="mt-5 max-w-lg text-sm leading-7 text-white/60">{t("store.contact.description")}</p></div>
            <button onClick={() => openDialog({ type: "contact" })} className="store-button relative mt-8 shrink-0 md:mt-0">{t("store.actions.enquire")}</button>
          </motion.div>
        </section>
      </main>}

      <StoreFooter />

      <Dialog.Root open={dialog !== null} onOpenChange={(open) => { if (!open) setDialog(null); }}>
        <Dialog.Portal>
          <Dialog.Overlay className="store-dialog-overlay fixed inset-0 z-100 bg-black/75 backdrop-blur-sm" />
          <Dialog.Content
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              dialogOpener.current?.focus();
            }}
            className={dialog?.type === "cart"
              ? "store-dialog fixed inset-y-0 right-0 left-auto z-110 h-[100dvh] max-h-none w-[min(30rem,100vw)] max-w-none translate-x-0 translate-y-0 overflow-y-auto rounded-l-[28px] border-y-0 border-r-0 border-l border-white/15 bg-[#172b4a] p-6 text-white shadow-2xl outline-none md:p-10"
              : `store-dialog fixed top-1/2 left-1/2 z-110 max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[28px] border p-6 shadow-2xl outline-none md:p-10 ${dialog?.type === "contact" ? "border-neutral-200 bg-white text-neutral-900" : "border-white/15 bg-[#172b4a] text-white"}`}
          >
            <Dialog.Close ref={dialogClose} aria-label={t("store.actions.close")} className={`absolute top-4 right-4 z-10 grid h-9 w-9 cursor-pointer place-items-center rounded-full transition focus-visible:ring-2 focus-visible:ring-blue-400 ${dialog?.type === "contact" ? "bg-neutral-100 text-neutral-900 hover:bg-neutral-200" : "bg-white/10 text-white hover:bg-white/20"}`}><X aria-hidden="true" className="h-4 w-4" /></Dialog.Close>
            {dialog?.type === "cart" ? (
              <>
                <p className="store-kicker pr-10">{t("store.cart.kicker")}</p>
                <Dialog.Title className="mt-4 text-3xl font-semibold tracking-tight">{t("store.cart.title")}</Dialog.Title>
                {cartProducts.length ? (
                  <div className="mt-6 space-y-3">
                    {cartDisplayProducts.map((product) => {
                      const isWeapon = product.category !== "accessories";
                      const isExpanded = expandedCartProductId === product.id;
                      const selectedAccessories = cartConfigurations[product.id] ?? [];
                      return (
                        <div key={product.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                          <div className="flex items-center justify-between gap-4">
                            {isWeapon ? (
                              <button type="button" onClick={() => setExpandedCartProductId(isExpanded ? null : product.id)} aria-expanded={isExpanded} className="flex min-w-0 flex-1 cursor-pointer items-center gap-4 text-left focus-visible:outline-2 focus-visible:outline-white/70">
                                <div className="grid h-16 w-20 shrink-0 place-items-center rounded-xl bg-white/[0.04] p-2"><ProductImage product={product} className="max-h-full w-full" /></div>
                                <span className="min-w-0 flex-1">
                                  <span className="flex items-center gap-2 font-semibold">
                                    <span className="truncate">{product.name}</span>
                                    <ChevronDown aria-hidden="true" className={`h-4 w-4 shrink-0 text-white/55 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                                  </span>
                                  <span className="mt-1 block text-xs text-white/50">{product.brand}</span>
                                </span>
                              </button>
                            ) : (
                              <div className="flex min-w-0 flex-1 items-center gap-4">
                                <div className="grid h-16 w-20 shrink-0 place-items-center rounded-xl bg-white/[0.04] p-2"><ProductImage product={product} className="max-h-full w-full" /></div>
                                <div className="min-w-0"><p className="truncate font-semibold">{product.name}</p><p className="mt-1 text-xs text-white/50">{product.brand}</p></div>
                              </div>
                            )}
                            <button type="button" onClick={() => removeCartProduct(product.id)} className="shrink-0 cursor-pointer rounded-lg px-3 py-2 text-xs text-white/55 underline underline-offset-4 hover:text-white">{t("store.cart.remove")}</button>
                          </div>
                          {isWeapon && isExpanded ? (
                            <div className="mt-4 rounded-xl border border-white/10 bg-black/10 p-3">
                              <p className="text-xs font-medium text-white/70">{t("store.cart.baseModel")}: {product.name}</p>
                              <div className="mt-4 space-y-4">
                                {gameAccessoryGroups.map((group) => (
                                  <div key={group.id}>
                                    <p className="mb-2 text-[10px] font-semibold tracking-wide text-white/45 uppercase">{t(group.titleKey)}</p>
                                    <div className="space-y-2">
                                      {group.options.map((option) => {
                                        const accessory = storeProducts.find((item) => item.id === option.value);
                                        if (!accessory) return null;
                                        const selected = selectedAccessories.includes(accessory.id);
                                        return (
                                          <div key={accessory.id} className={`flex items-center gap-3 rounded-lg border p-2 transition-colors ${selected ? "border-white/25 bg-white/[0.07]" : "border-white/10 bg-white/[0.025]"}`}>
                                            <div className="grid h-10 w-12 shrink-0 place-items-center rounded-md bg-[#10213a] p-1"><ProductImage product={accessory} className="max-h-full w-full" /></div>
                                            <div className="min-w-0 flex-1">
                                              <p className="truncate text-xs font-medium">{t(option.labelKey)}</p>
                                              <p className="mt-0.5 truncate text-[10px] text-white/40">{accessory.brand}</p>
                                            </div>
                                            <button type="button" onClick={() => toggleCartConfiguration(product.id, accessory.id)} aria-label={t(selected ? "store.cart.remove" : "store.accessories.addToCart")} aria-pressed={selected} className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full border border-white/25 text-white transition hover:bg-white hover:text-[#14243d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                                              {selected ? <Check aria-hidden="true" className="h-4 w-4" /> : <Plus aria-hidden="true" className="h-4 w-4" />}
                                            </button>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => setDialog({
                        type: "contact",
                        productSelections: cartDisplayProducts.map((product) => {
                          const configured = cartConfigurations[product.id] ?? [];
                          const addOnNames = configured.flatMap((id) => {
                            const accessory = storeProducts.find((item) => item.id === id);
                            return accessory ? [accessory.name] : [];
                          });
                          const baseLabel = `${product.brand} ${product.name}`;
                          return { value: product.id, label: addOnNames.length ? `${baseLabel} — ${addOnNames.join(", ")}` : baseLabel };
                        }),
                      })}
                      className="store-button mt-4"
                    >
                      {t("store.cart.submit")}
                    </button>
                  </div>
                ) : (
                  <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                    <p className="text-sm leading-6 text-white/65">{t("store.cart.empty")}</p>
                    <button type="button" onClick={() => { setDialog(null); document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" }); }} className="store-button mt-5">{t("store.cart.browse")}</button>
                  </div>
                )}
              </>
            ) : dialog?.type === "accessory" && dialog.accessory ? (
              <>
                <p className="store-kicker pr-10">{t(`store.accessories.${dialog.accessory.accessoryCategory ?? "other"}`)}</p>
                <Dialog.Title className="mt-3 text-3xl font-semibold tracking-tight">{dialog.accessory.name}</Dialog.Title>
                <Dialog.Description className="mt-4 text-sm leading-7 text-white/65">{t(`store.accessoryDescriptions.${dialog.accessory.id}`)}</Dialog.Description>
                <div className="my-7 grid h-52 place-items-center rounded-2xl border border-white/10 bg-white/[0.035] p-6">
                  <img src={dialog.accessory.image} alt="" className="h-full max-w-full object-contain" />
                </div>
                <p className="text-xs leading-6 text-white/45">{t("store.accessories.compatibilityNote")}</p>
                <button
                  type="button"
                  onClick={() => addAccessoryToCart(dialog.accessory!)}
                  disabled={cartIds.includes(dialog.accessory.id)}
                  className="store-button mt-6 w-full disabled:cursor-default disabled:opacity-65"
                >
                  <ShoppingCart aria-hidden="true" className="mr-2 inline h-4 w-4" />
                  {t(cartIds.includes(dialog.accessory.id) ? "store.accessories.alreadyInCart" : "store.accessories.addToCart")}
                </button>
              </>
            ) : (
              <>
                <Dialog.Title className="sr-only">{t("store.contact.title")}</Dialog.Title>
                <Dialog.Description className="sr-only">{t("store.contact.description")}</Dialog.Description>
                <Suspense fallback={<div aria-label={t("store.contact.loading")} className="min-h-96 animate-pulse rounded-2xl bg-neutral-100" />}>
                  <ContactForm key={dialogProductSelections?.map((product) => product.value).join(",") || "store-contact"} showDetails={false} catalogProducts={storeContactProducts} productSelections={dialogProductSelections} />
                </Suspense>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
