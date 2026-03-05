import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  ChevronDown,
  Clock3,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { ScrollReveal } from "../../components/ui/scroll-reveal";
import { cn } from "../../lib/utils";
import { buildLocalizedPath, resolveLanguage } from "../i18n";

type HeroSlide = {
  id: number;
  category: string;
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  readMinutes: number;
  image: string;
};

type BlogArticle = {
  id: number;
  slug?: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  readMinutes: number;
  image: string;
  popularity: number;
};

type SortKey = "newest" | "popular" | "quick";
const ALL_CATEGORY_VALUE = "__all__";

type BlogPostListApiItem = {
  id?: number;
  slug?: string;
  category?: string | null;
  category_slug?: string | null;
  title?: string;
  hero_image?: string | null;
  subtitle?: string;
  author?: string;
  author_role?: string;
  published_at?: string | null;
  read_minutes?: number;
  read_time?: string;
};

type BlogFallbackCopy = {
  untitledPost: string;
  defaultCategory: string;
  noSummary: string;
  defaultAuthor: string;
};

const API_BASE = (() => {
  const raw =
    import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "";
  const trimmed = raw.replace(/\/+$/, "");
  if (!trimmed) return "/api";
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
})();

const BLOG_FALLBACK_IMAGES = [
  "/hero-bg-1.jpg",
  "/hero-bg-2.jpg",
  "/hero-bg-3.jpg",
  "/hero-bg-4.jpg",
  "/hero-bg-5.jpg",
  "/technology-bg-1.jpg",
  "/technology-bg-2.png",
  "/technology-bg-3.jpg",
  "/technology-bg-4.png",
  "/support-1.png",
  "/support-2.png",
  "/support-3.png",
  "/solutions-page-1.png",
  "/solutions-page-2.png",
];

function hashString(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function pickFallbackBlogImage(seed: string) {
  return BLOG_FALLBACK_IMAGES[hashString(seed) % BLOG_FALLBACK_IMAGES.length];
}

function getSafePublishedDate(value: string | null | undefined) {
  if (typeof value !== "string" || !value.trim()) return "2026-01-01";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "2026-01-01";
  return value;
}

function parseReadMinutes(
  readMinutes: number | undefined,
  readTime: string | undefined,
) {
  if (typeof readMinutes === "number" && Number.isFinite(readMinutes)) {
    return Math.max(1, Math.round(readMinutes));
  }

  if (typeof readTime === "string") {
    const match = readTime.match(/\d+/);
    if (match) {
      return Math.max(1, Number.parseInt(match[0], 10));
    }
  }

  return 3;
}

function toPopularitySeed(seed: string) {
  return 60 + (hashString(seed) % 40);
}

function slugifyText(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "post"
  );
}

function getBlogArticleSlug(article: BlogArticle) {
  if (typeof article.slug === "string" && article.slug.trim()) {
    return article.slug.trim();
  }
  return slugifyText(article.title);
}

function mapApiPostToBlogArticle(
  item: BlogPostListApiItem,
  fallbackCopy: BlogFallbackCopy,
): BlogArticle | null {
  if (typeof item.id !== "number" || !Number.isFinite(item.id)) return null;

  const slug =
    typeof item.slug === "string" && item.slug.trim()
      ? item.slug.trim()
      : `post-${item.id}`;
  const title =
    typeof item.title === "string" && item.title.trim()
      ? item.title.trim()
      : fallbackCopy.untitledPost;
  const category =
    typeof item.category === "string" && item.category.trim()
      ? item.category.trim()
      : fallbackCopy.defaultCategory;
  const excerpt =
    typeof item.subtitle === "string" && item.subtitle.trim()
      ? item.subtitle.trim()
      : fallbackCopy.noSummary;
  const author =
    typeof item.author === "string" && item.author.trim()
      ? item.author.trim()
      : fallbackCopy.defaultAuthor;
  const publishedAt = getSafePublishedDate(item.published_at);
  const readMinutes = parseReadMinutes(item.read_minutes, item.read_time);
  const image =
    typeof item.hero_image === "string" && item.hero_image.trim()
      ? item.hero_image.trim()
      : pickFallbackBlogImage(`${slug}:${title}`);

  return {
    id: item.id,
    slug,
    category,
    title,
    excerpt,
    author,
    publishedAt,
    readMinutes,
    image,
    popularity: toPopularitySeed(`${slug}:${category}:${title}`),
  };
}

function formatDate(dateString: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

function ArticleMeta({
  author,
  publishedAt,
  readMinutes,
  light = false,
}: {
  author: string;
  publishedAt: string;
  readMinutes?: number;
  light?: boolean;
}) {
  const { t, i18n } = useTranslation();
  const tone = light ? "text-white/80" : "text-[#6B7280]";
  const iconTone = light ? "text-white/70" : "text-[#9CA3AF]";

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium",
        tone,
      )}
    >
      <span>{author}</span>
      <span className="hidden h-1 w-1 rounded-full bg-current/60 sm:block" />
      <span className="inline-flex items-center gap-1.5">
        <Calendar className={cn("h-3.5 w-3.5", iconTone)} />
        {formatDate(
          publishedAt,
          i18n.resolvedLanguage || i18n.language || "en",
        )}
      </span>
      {typeof readMinutes === "number" ? (
        <>
          <span className="hidden h-1 w-1 rounded-full bg-current/60 sm:block" />
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className={cn("h-3.5 w-3.5", iconTone)} />
            {t("blog.common.minRead", { count: readMinutes })}
          </span>
        </>
      ) : null}
    </div>
  );
}

function NewsChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-all",
        active
          ? "border-white/50 bg-black/75 text-white shadow-[0_10px_18px_-14px_rgba(17,24,39,0.6)]"
          : "border-[#D1D5DB] bg-white text-[#374151] hover:border-[#9CA3AF] hover:bg-[#F9FAFB]",
      )}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

function FeaturedMiniCard({
  article,
  href,
}: {
  article: BlogArticle;
  href: string;
}) {
  return (
    <Link
      to={href}
      className="group block min-w-[260px] rounded-2xl border border-black/5 bg-white p-3 shadow-[0_14px_24px_-20px_rgba(0,0,0,0.22)] transition-shadow hover:shadow-[0_18px_30px_-18px_rgba(0,0,0,0.28)]"
    >
      <div className="grid grid-cols-[92px_1fr] gap-3">
        <img
          src={article.image}
          alt={article.title}
          className="h-22 w-full rounded-xl object-cover"
          loading="lazy"
        />
        <div className="min-w-0">
          <p className="text-[10px] font-semibold tracking-[0.14em] text-[#6B7280] uppercase">
            {article.category}
          </p>
          <h4 className="mt-1 line-clamp-2 text-sm leading-5 font-semibold text-[#111827]">
            {article.title}
          </h4>
          <div className="mt-2">
            <ArticleMeta
              author={article.author}
              publishedAt={article.publishedAt}
              readMinutes={article.readMinutes}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

function BlogGridCard({
  article,
  href,
}: {
  article: BlogArticle;
  href: string;
}) {
  return (
    <Link
      to={href}
      className="group block overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_20px_40px_-28px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-1 hover:shadow-[0_24px_44px_-24px_rgba(0,0,0,0.35)]"
    >
      <div className="relative aspect-16/10 overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-x-0 top-0 h-20 bg-linear-to-b from-black/35 to-transparent" />
        <span className="absolute top-3 left-3 rounded-full border border-white/25 bg-black/35 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
          {article.category}
        </span>
      </div>
      <div className="space-y-3 p-5">
        <h3 className="text-lg leading-6 font-semibold text-[#111827]">
          {article.title}
        </h3>
        <p className="line-clamp-3 text-sm leading-6 text-[#6B7280]">
          {article.excerpt}
        </p>
        <ArticleMeta
          author={article.author}
          publishedAt={article.publishedAt}
          readMinutes={article.readMinutes}
        />
      </div>
    </Link>
  );
}

export default function Blog() {
  const { t } = useTranslation();
  const { lng } = useParams();
  const currentLanguage = resolveLanguage(lng);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY_VALUE);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [apiArticles, setApiArticles] = useState<BlogArticle[] | null>(null);
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const fallbackCopy = useMemo<BlogFallbackCopy>(
    () => ({
      untitledPost: t("blog.common.untitledPost"),
      defaultCategory: t("blog.common.defaultCategory"),
      noSummary: t("blog.common.noSummary"),
      defaultAuthor: t("blog.common.defaultAuthor"),
    }),
    [t, currentLanguage],
  );
  const staticData = useMemo<{
    heroSlides: HeroSlide[];
    latestNewsCards: BlogArticle[];
    articleGrid: BlogArticle[];
  }>(
    () => ({
      heroSlides: [
        {
          id: 1,
          category: t("blog.static.heroSlides.slide1.category"),
          title: t("blog.static.heroSlides.slide1.title"),
          description: t("blog.static.heroSlides.slide1.description"),
          author: t("blog.static.heroSlides.slide1.author"),
          publishedAt: "2026-01-24",
          readMinutes: 10,
          image: "/support-1.png",
        },
        {
          id: 2,
          category: t("blog.static.heroSlides.slide2.category"),
          title: t("blog.static.heroSlides.slide2.title"),
          description: t("blog.static.heroSlides.slide2.description"),
          author: t("blog.static.heroSlides.slide2.author"),
          publishedAt: "2026-01-16",
          readMinutes: 8,
          image: "/support-2.png",
        },
        {
          id: 3,
          category: t("blog.static.heroSlides.slide3.category"),
          title: t("blog.static.heroSlides.slide3.title"),
          description: t("blog.static.heroSlides.slide3.description"),
          author: t("blog.static.heroSlides.slide3.author"),
          publishedAt: "2026-01-09",
          readMinutes: 7,
          image: "/support-3.png",
        },
      ],
      latestNewsCards: [
        {
          id: 101,
          category: t("blog.static.latestNews.card1.category"),
          title: t("blog.static.latestNews.card1.title"),
          excerpt: t("blog.static.latestNews.card1.excerpt"),
          author: t("blog.static.latestNews.card1.author"),
          publishedAt: "2026-01-25",
          readMinutes: 6,
          image: "/hero-bg-1.jpg",
          popularity: 92,
        },
        {
          id: 102,
          category: t("blog.static.latestNews.card2.category"),
          title: t("blog.static.latestNews.card2.title"),
          excerpt: t("blog.static.latestNews.card2.excerpt"),
          author: t("blog.static.latestNews.card2.author"),
          publishedAt: "2026-01-23",
          readMinutes: 4,
          image: "/technology-bg-2.png",
          popularity: 87,
        },
        {
          id: 103,
          category: t("blog.static.latestNews.card3.category"),
          title: t("blog.static.latestNews.card3.title"),
          excerpt: t("blog.static.latestNews.card3.excerpt"),
          author: t("blog.static.latestNews.card3.author"),
          publishedAt: "2026-01-21",
          readMinutes: 5,
          image: "/technology-bg-4.png",
          popularity: 85,
        },
        {
          id: 104,
          category: t("blog.static.latestNews.card4.category"),
          title: t("blog.static.latestNews.card4.title"),
          excerpt: t("blog.static.latestNews.card4.excerpt"),
          author: t("blog.static.latestNews.card4.author"),
          publishedAt: "2026-01-19",
          readMinutes: 5,
          image: "/hero-bg-2.jpg",
          popularity: 80,
        },
        {
          id: 105,
          category: t("blog.static.latestNews.card5.category"),
          title: t("blog.static.latestNews.card5.title"),
          excerpt: t("blog.static.latestNews.card5.excerpt"),
          author: t("blog.static.latestNews.card5.author"),
          publishedAt: "2026-01-18",
          readMinutes: 7,
          image: "/hero-bg-3.jpg",
          popularity: 76,
        },
      ],
      articleGrid: [
        {
          id: 201,
          category: t("blog.static.articleGrid.card1.category"),
          title: t("blog.static.articleGrid.card1.title"),
          excerpt: t("blog.static.articleGrid.card1.excerpt"),
          author: t("blog.static.articleGrid.card1.author"),
          publishedAt: "2026-01-22",
          readMinutes: 9,
          image: "/support-1.png",
          popularity: 95,
        },
        {
          id: 202,
          category: t("blog.static.articleGrid.card2.category"),
          title: t("blog.static.articleGrid.card2.title"),
          excerpt: t("blog.static.articleGrid.card2.excerpt"),
          author: t("blog.static.articleGrid.card2.author"),
          publishedAt: "2026-01-18",
          readMinutes: 6,
          image: "/hero-bg-4.jpg",
          popularity: 86,
        },
        {
          id: 203,
          category: t("blog.static.articleGrid.card3.category"),
          title: t("blog.static.articleGrid.card3.title"),
          excerpt: t("blog.static.articleGrid.card3.excerpt"),
          author: t("blog.static.articleGrid.card3.author"),
          publishedAt: "2026-01-14",
          readMinutes: 4,
          image: "/hero-bg-5.jpg",
          popularity: 78,
        },
        {
          id: 204,
          category: t("blog.static.articleGrid.card4.category"),
          title: t("blog.static.articleGrid.card4.title"),
          excerpt: t("blog.static.articleGrid.card4.excerpt"),
          author: t("blog.static.articleGrid.card4.author"),
          publishedAt: "2026-01-26",
          readMinutes: 8,
          image: "/technology-bg-1.jpg",
          popularity: 90,
        },
        {
          id: 205,
          category: t("blog.static.articleGrid.card5.category"),
          title: t("blog.static.articleGrid.card5.title"),
          excerpt: t("blog.static.articleGrid.card5.excerpt"),
          author: t("blog.static.articleGrid.card5.author"),
          publishedAt: "2026-01-20",
          readMinutes: 7,
          image: "/technology-bg-3.jpg",
          popularity: 88,
        },
        {
          id: 206,
          category: t("blog.static.articleGrid.card6.category"),
          title: t("blog.static.articleGrid.card6.title"),
          excerpt: t("blog.static.articleGrid.card6.excerpt"),
          author: t("blog.static.articleGrid.card6.author"),
          publishedAt: "2026-01-11",
          readMinutes: 5,
          image: "/support-2.png",
          popularity: 77,
        },
        {
          id: 207,
          category: t("blog.static.articleGrid.card7.category"),
          title: t("blog.static.articleGrid.card7.title"),
          excerpt: t("blog.static.articleGrid.card7.excerpt"),
          author: t("blog.static.articleGrid.card7.author"),
          publishedAt: "2026-01-07",
          readMinutes: 5,
          image: "/support-3.png",
          popularity: 70,
        },
        {
          id: 208,
          category: t("blog.static.articleGrid.card8.category"),
          title: t("blog.static.articleGrid.card8.title"),
          excerpt: t("blog.static.articleGrid.card8.excerpt"),
          author: t("blog.static.articleGrid.card8.author"),
          publishedAt: "2026-01-17",
          readMinutes: 9,
          image: "/solutions-page-1.png",
          popularity: 82,
        },
        {
          id: 209,
          category: t("blog.static.articleGrid.card9.category"),
          title: t("blog.static.articleGrid.card9.title"),
          excerpt: t("blog.static.articleGrid.card9.excerpt"),
          author: t("blog.static.articleGrid.card9.author"),
          publishedAt: "2026-01-12",
          readMinutes: 3,
          image: "/solutions-page-2.png",
          popularity: 75,
        },
      ],
    }),
    [t, currentLanguage],
  );

  useEffect(() => {
    const controller = new AbortController();

    const loadBlogPosts = async () => {
      try {
        const response = await fetch(`${API_BASE}/blog/posts/`, {
          signal: controller.signal,
          headers: {
            "Accept-Language": currentLanguage,
          },
        });

        if (!response.ok) {
          throw new Error(`Blog posts request failed with ${response.status}`);
        }

        const payload = (await response.json()) as BlogPostListApiItem[];
        const mapped = Array.isArray(payload)
          ? payload
              .map((item) => mapApiPostToBlogArticle(item, fallbackCopy))
              .filter((item): item is BlogArticle => item !== null)
          : [];

        setApiArticles(mapped);
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          return;
        }
        console.error("Failed to load blog posts", error);
        setApiArticles(null);
      }
    };

    void loadBlogPosts();

    return () => controller.abort();
  }, [currentLanguage, fallbackCopy]);

  const sourceArticles =
    apiArticles && apiArticles.length > 0 ? apiArticles : staticData.articleGrid;
  const newestArticles = sourceArticles
    .slice()
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
  const latestNewsData =
    newestArticles.length > 0
      ? newestArticles.slice(0, 5)
      : staticData.latestNewsCards;
  const mappedHeroSlides: HeroSlide[] = newestArticles
    .slice(0, 3)
    .map((item) => ({
      id: item.id,
      category: item.category,
      title: item.title,
      description: item.excerpt,
      author: item.author,
      publishedAt: item.publishedAt,
      readMinutes: item.readMinutes,
      image: item.image,
    }));
  const displayHeroSlides =
    mappedHeroSlides.length > 0 ? mappedHeroSlides : staticData.heroSlides;

  useEffect(() => {
    if (displayHeroSlides.length <= 1) return;

    const intervalId = window.setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % displayHeroSlides.length);
    }, 6000);

    return () => window.clearInterval(intervalId);
  }, [displayHeroSlides.length]);

  useEffect(() => {
    setActiveHeroSlide((prev) => (prev >= displayHeroSlides.length ? 0 : prev));
  }, [displayHeroSlides.length]);

  const currentHero =
    displayHeroSlides[activeHeroSlide] ??
    displayHeroSlides[0] ??
    staticData.heroSlides[0];
  const categoryOptions = [
    ALL_CATEGORY_VALUE,
    ...Array.from(new Set(sourceArticles.map((article) => article.category))),
  ];
  const visibleCategoryOptions = categoryOptions.slice(0, 3);
  const hiddenCategoryOptions = categoryOptions.slice(3);
  const activeCategoryIsHidden = hiddenCategoryOptions.includes(activeCategory);
  const normalizedSearchQuery = deferredSearchQuery.trim().toLowerCase();

  const visibleArticles = sourceArticles
    .filter((article) => {
      if (!normalizedSearchQuery) return true;
      return [
        article.title,
        article.excerpt,
        article.category,
        article.author,
        article.slug ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearchQuery);
    })
    .filter((article) =>
      activeCategory === ALL_CATEGORY_VALUE
        ? true
        : article.category === activeCategory,
    )
    .slice()
    .sort((a, b) => {
      if (sortBy === "popular") return b.popularity - a.popularity;
      if (sortBy === "quick") return a.readMinutes - b.readMinutes;
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    });

  const featuredStory = latestNewsData[0] ?? staticData.latestNewsCards[0];
  const headlineStrip = latestNewsData.slice(1);
  const featuredStoryHref = buildLocalizedPath(
    currentLanguage,
    `/blog/${getBlogArticleSlug(featuredStory)}`,
  );

  return (
    <main className="relative overflow-hidden pt-34 pb-24 max-lg:pt-32 max-md:pb-16">
      <div className="container mx-auto">
        <div className="relative rounded-[28px] bg-white p-3 shadow-inner shadow-black/50 backdrop-blur-md max-lg:rounded-3xl">
          <div className="pointer-events-none absolute top-8 left-8 hidden h-12 w-12 rounded-sm border border-black/4 bg-black/2 md:block" />
          <div className="pointer-events-none absolute right-10 bottom-28 hidden h-10 w-10 rounded-sm border border-black/4 bg-black/2 xl:block" />

          <div className="overflow-hidden rounded-[22px] bg-white">
            <section className="relative min-h-[520px] overflow-hidden rounded-t-[22px] max-md:min-h-[460px]">
              {displayHeroSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={cn(
                    "absolute inset-0 transition-opacity duration-700",
                    index === activeHeroSlide ? "opacity-100" : "opacity-0",
                  )}
                  aria-hidden={index !== activeHeroSlide}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,7,18,0.42)_0%,rgba(3,7,18,0.18)_28%,rgba(3,7,18,0.22)_58%,rgba(3,7,18,0.68)_100%)]" />
                </div>
              ))}

              <div className="relative z-10 flex min-h-[520px] flex-col p-6 max-md:min-h-[460px] max-md:p-4">
                <div className="mt-auto grid items-end gap-8 pt-16 lg:grid-cols-[1.1fr_auto]">
                  <ScrollReveal
                    key={currentHero.id}
                    from="up"
                    duration={0.45}
                    distance={16}
                    className="max-w-2xl space-y-4"
                  >
                    <span className="inline-flex items-center rounded-full border border-white/20 bg-black/25 px-4 py-2 text-sm font-medium text-white backdrop-blur">
                      {currentHero.category}
                    </span>
                    <div className="space-y-3">
                      <h1 className="text-4xl leading-tight font-semibold text-white max-lg:text-3xl max-md:text-2xl">
                        {currentHero.title}
                      </h1>
                      <p className="max-w-xl text-base leading-7 text-white/85 max-md:text-sm max-md:leading-6">
                        {currentHero.description}
                      </p>
                    </div>
                  </ScrollReveal>

                  <div className="justify-self-end rounded-2xl border border-white/20 bg-black/25 p-4 text-white/90 shadow-[0_18px_44px_-30px_rgba(0,0,0,0.8)] backdrop-blur-md max-lg:justify-self-start">
                    <div className="flex items-center gap-3">
                      <img
                        src="/favicon/icon-64x.png"
                        alt=""
                        aria-hidden
                        className="h-11 w-11 rounded-full border border-white/20 bg-white/10 object-cover"
                      />
                      <div>
                        <p className="text-lg leading-none font-semibold">
                          {currentHero.author}
                        </p>
                        <p className="mt-1 text-xs text-white/70">
                          {formatDate(currentHero.publishedAt, currentLanguage)} •{" "}
                          {t("blog.common.minRead", {
                            count: currentHero.readMinutes,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2">
                  {displayHeroSlides.map((slide, index) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setActiveHeroSlide(index)}
                      className={cn(
                        "h-2.5 rounded-full transition-all",
                        index === activeHeroSlide
                          ? "w-8 bg-white"
                          : "w-2.5 bg-white/50 hover:bg-white/80",
                      )}
                      aria-label={t("blog.page.hero.showSlideAria", {
                        index: index + 1,
                      })}
                      aria-pressed={index === activeHeroSlide}
                    />
                  ))}
                </div>
              </div>
            </section>

            <section
              id="latest-news"
              className="relative rounded-b-[22px] bg-black/2 px-6 py-10 max-md:px-4"
            >
              <ScrollReveal
                className="flex flex-wrap items-end justify-between gap-4"
                from="up"
              >
                <div>
                  <p className="text-sm font-semibold tracking-[0.16em] text-[#6B7280] uppercase">
                    {t("blog.page.latestNews.kicker")}
                  </p>
                  <h2 className="mt-2 text-4xl leading-tight font-semibold text-[#111827] max-md:text-3xl">
                    {t("blog.page.latestNews.title")}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B7280]">
                    {t("blog.page.latestNews.description")}
                  </p>
                </div>
                <a
                  href="#articles"
                  className="inline-flex items-center gap-2 rounded-full border border-[#D1D5DB] bg-white px-4 py-2 text-sm font-medium text-[#111827] shadow-[0_10px_20px_-16px_rgba(0,0,0,0.35)] transition hover:border-[#9CA3AF]"
                >
                  {t("blog.page.latestNews.viewAll")}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </ScrollReveal>

              <div className="mt-8 space-y-4">
                <ScrollReveal
                  delay={0.08}
                  className="grid gap-0 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-[0_25px_50px_-38px_rgba(0,0,0,0.35)] lg:grid-cols-[1.05fr_1fr]"
                >
                  <Link
                    to={featuredStoryHref}
                    className="contents"
                    aria-label={t("blog.page.latestNews.openArticleAria", {
                      title: featuredStory.title,
                    })}
                  >
                    <div className="relative min-h-[280px]">
                      <img
                        src={featuredStory.image}
                        alt={featuredStory.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-tr from-sky-500/15 via-transparent to-transparent" />
                    </div>
                    <div className="flex flex-col justify-center p-6 lg:p-8">
                      <p className="text-xs font-semibold tracking-[0.16em] text-[#6B7280] uppercase">
                        {featuredStory.category}
                      </p>
                      <h3 className="mt-4 text-2xl leading-9 font-semibold text-[#111827] max-md:text-xl max-md:leading-8">
                        {featuredStory.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-[#6B7280]">
                        {featuredStory.excerpt}
                      </p>
                      <div className="mt-6">
                        <ArticleMeta
                          author={featuredStory.author}
                          publishedAt={featuredStory.publishedAt}
                          readMinutes={featuredStory.readMinutes}
                        />
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>

                <ScrollReveal
                  delay={0.14}
                  className="grid grid-cols-1 gap-3 overflow-x-auto pb-1 lg:grid-cols-2"
                  from="up"
                >
                  {headlineStrip.map((article) => (
                    <FeaturedMiniCard
                      key={article.id}
                      article={article}
                      href={buildLocalizedPath(
                        currentLanguage,
                        `/blog/${getBlogArticleSlug(article)}`,
                      )}
                    />
                  ))}
                </ScrollReveal>
              </div>
            </section>

            <section
              id="articles"
              className="relative bg-white px-6 py-12 max-md:px-4"
            >
              <ScrollReveal className="mx-auto max-w-4xl text-center" from="up">
                <p className="text-sm font-semibold tracking-[0.16em] text-[#6B7280] uppercase">
                  {t("blog.page.archive.kicker")}
                </p>
                <h2 className="mt-3 text-4xl leading-tight font-semibold text-[#111827] max-md:text-3xl">
                  {t("blog.page.archive.title")}
                </h2>
                <p className="mt-4 text-sm leading-7 text-[#6B7280]">
                  {t("blog.page.archive.description")}
                </p>
              </ScrollReveal>

              <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative flex flex-wrap items-center gap-2">
                  {visibleCategoryOptions.map((category) => (
                    <NewsChip
                      key={category}
                      label={
                        category === ALL_CATEGORY_VALUE
                          ? t("blog.page.categories.all")
                          : category
                      }
                      active={activeCategory === category}
                      onClick={() => {
                        setActiveCategory(category);
                        setIsCategoryMenuOpen(false);
                      }}
                    />
                  ))}

                  {hiddenCategoryOptions.length > 0 ? (
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsCategoryMenuOpen((prev) => !prev)}
                        className={cn(
                          "inline-flex h-[42px] w-[42px] items-center justify-center rounded-full border bg-white text-[#374151] transition-all",
                          isCategoryMenuOpen || activeCategoryIsHidden
                            ? "border-white/50 bg-black/75 text-white shadow-[0_10px_18px_-14px_rgba(17,24,39,0.6)]"
                            : "border-[#D1D5DB] hover:border-[#9CA3AF] hover:bg-[#F9FAFB]",
                        )}
                        aria-label={t("blog.page.categories.moreAria")}
                        aria-expanded={isCategoryMenuOpen}
                        aria-haspopup="menu"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>

                      {isCategoryMenuOpen ? (
                        <div
                          role="menu"
                          className="absolute top-full left-0 z-30 mt-2 min-w-[220px] rounded-2xl border border-[#E5E7EB] bg-white p-2 shadow-[0_22px_40px_-24px_rgba(0,0,0,0.28)]"
                        >
                          <div className="flex flex-col gap-1">
                            {hiddenCategoryOptions.map((category) => (
                              <button
                                key={category}
                                type="button"
                                role="menuitemradio"
                                aria-checked={activeCategory === category}
                                onClick={() => {
                                  setActiveCategory(category);
                                  setIsCategoryMenuOpen(false);
                                }}
                                className={cn(
                                  "rounded-xl px-3 py-2 text-left text-sm font-medium transition",
                                  activeCategory === category
                                    ? "bg-black/85 text-white"
                                    : "text-[#374151] hover:bg-[#F3F4F6]",
                                )}
                              >
                                {category}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <label className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-sm text-[#6B7280] max-md:flex-1">
                    <Search className="h-4 w-4 shrink-0" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder={t("blog.page.filters.searchPlaceholder")}
                      className="bg-transparent outline-none placeholder:text-[#9CA3AF]"
                    />
                  </label>

                  <div className="relative">
                    <label className="sr-only" htmlFor="blog-sort">
                      {t("blog.page.filters.sortLabel")}
                    </label>
                    <select
                      id="blog-sort"
                      value={sortBy}
                      onChange={(event) =>
                        setSortBy(event.target.value as SortKey)
                      }
                      className="appearance-none rounded-xl border border-[#E5E7EB] bg-white py-2 pr-10 pl-3 text-sm font-medium text-[#111827] transition outline-none focus:border-[#9CA3AF]"
                    >
                      <option value="newest">
                        {t("blog.page.filters.sort.newest")}
                      </option>
                      <option value="popular">
                        {t("blog.page.filters.sort.popular")}
                      </option>
                      <option value="quick">
                        {t("blog.page.filters.sort.quick")}
                      </option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
                  </div>
                </div>
              </div>

              <div
                id="featured-grid"
                className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3"
              >
                {visibleArticles.map((article, index) => (
                  <ScrollReveal
                    key={article.id}
                    delay={Math.min(index * 0.04, 0.18)}
                    from="up"
                    distance={14}
                  >
                    <BlogGridCard
                      article={article}
                      href={buildLocalizedPath(
                        currentLanguage,
                        `/blog/${getBlogArticleSlug(article)}`,
                      )}
                    />
                  </ScrollReveal>
                ))}
              </div>

              {visibleArticles.length === 0 ? (
                <div className="mt-8 rounded-2xl border border-dashed border-[#D1D5DB] bg-[#F9FAFB] p-8 text-center text-sm text-[#6B7280]">
                  {normalizedSearchQuery
                    ? t("blog.page.empty.search")
                    : t("blog.page.empty.category")}
                </div>
              ) : null}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
