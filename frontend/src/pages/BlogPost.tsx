import { useEffect, useMemo, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { useParams } from "react-router-dom";
import { Copy, Link as Link2, Quote } from "lucide-react";
import { useTranslation } from "react-i18next";
import { buildLocalizedPath, resolveLanguage } from "../i18n";
import { dispatchOpenContactModal } from "../../lib/contact-modal";
import { cn } from "../../lib/utils";

type ArticleSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

type ArticleBlockType = "text" | "bullets" | "quote" | "image" | "divider";

type ArticleBlock = {
  id: string;
  type: ArticleBlockType;
  title: string;
  html: string;
  paragraphs?: string[];
  items?: string[];
  image: string | null;
  imageAlt: string;
  order: number;
};

type TocEntry = {
  id: string;
  title: string;
};

type BlogPostArticle = {
  slug: string;
  category: string;
  title: string;
  heroImage: string | null;
  subtitle: string;
  author: string;
  authorRole: string;
  publishedAt: string | null;
  readTime: string | null;
  blocks: ArticleBlock[];
};

type BlogPostFallbackCopy = {
  untitledPost: string;
  defaultCategory: string;
  fallbackSubtitle: string;
};

type BlogPostApiSection = {
  id?: string;
  title?: string;
  paragraphs?: unknown;
  bullets?: unknown;
  order?: number;
};

type BlogPostApiBlock = {
  id?: string;
  type?: string;
  title?: string;
  html?: string;
  paragraphs?: unknown;
  items?: unknown;
  image?: string | null;
  image_url?: string | null;
  image_alt?: string;
  order?: number;
};

type BlogPostApiResponse = {
  slug?: string;
  category?: string | null;
  title?: string;
  image?: string | null;
  image_url?: string | null;
  cover_image?: string | null;
  hero_image?: string | null;
  thumbnail?: string | null;
  subtitle?: string;
  author?: string;
  author_role?: string;
  published_at?: string | null;
  read_minutes?: number;
  read_time?: string;
  blocks?: BlogPostApiBlock[];
  sections?: BlogPostApiSection[];
};

const API_BASE = (() => {
  const raw =
    import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "";
  const trimmed = raw.replace(/\/+$/, "");
  if (!trimmed) return "/api";
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
})();

const RICH_TEXT_QUOTE_ICON = renderToStaticMarkup(
  <Quote
    aria-hidden="true"
    style={{
      position: "absolute",
      top: "20px",
      left: "20px",
      width: "24px",
      height: "24px",
      color: "#666666",
    }}
    fill="#555555"
  />,
);

function formatDate(dateString: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
}

function humanizeSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function hashString(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function getSeededHeroGradient(seed: string) {
  const hash = hashString(seed);
  const hueA = hash % 360;
  const hueB = (hueA + 32 + ((hash >>> 8) % 88)) % 360;
  const hueC = (hueA + 150 + ((hash >>> 16) % 70)) % 360;

  const satA = 44 + ((hash >>> 3) % 16);
  const satB = 38 + ((hash >>> 10) % 14);
  const satC = 40 + ((hash >>> 18) % 14);

  const lightA = 84 - ((hash >>> 5) % 6);
  const lightB = 73 - ((hash >>> 13) % 7);
  const lightC = 83 - ((hash >>> 21) % 6);

  return `linear-gradient(135deg, hsl(${hueA} ${satA}% ${lightA}%) 0%, hsl(${hueB} ${satB}% ${lightB}%) 48%, hsl(${hueC} ${satC}% ${lightC}%) 100%)`;
}

function toStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
  return items.length > 0 ? items : undefined;
}

function toSectionId(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}

function normalizeAnchorId(value: string) {
  const trimmed = value.trim();
  return /^[a-z0-9-]+$/.test(trimmed) ? trimmed : toSectionId(trimmed);
}

function normalizeBlockType(
  value: string | undefined,
  {
    hasItems,
    hasImage,
  }: {
    hasItems: boolean;
    hasImage: boolean;
  },
): ArticleBlockType {
  if (value === "text") return "text";
  if (value === "bullets") return "bullets";
  if (value === "quote") return "quote";
  if (value === "image") return "image";
  if (value === "divider") return "divider";
  if (hasImage) return "image";
  if (hasItems) return "bullets";
  return "text";
}

function isRenderableArticleBlock(block: ArticleBlock) {
  if (block.type === "image") {
    return typeof block.image === "string" && block.image.trim().length > 0;
  }
  return true;
}

function decorateRichTextHtml(html: string) {
  if (!html.includes("<blockquote")) return html;
  return html.replace(
    /<blockquote(\b[^>]*)>/gi,
    `<blockquote$1>${RICH_TEXT_QUOTE_ICON}`,
  );
}

function convertLegacySectionsToBlocks(
  sections: ArticleSection[],
): ArticleBlock[] {
  return sections.flatMap((section, index) => {
    const paragraphs = section.paragraphs ?? [];
    const blocks: ArticleBlock[] = [];

    if ((section.bullets ?? []).length > 0) {
      blocks.push({
        id: section.id,
        type: "bullets",
        title: section.title,
        html: "",
        paragraphs,
        items: section.bullets,
        image: null,
        imageAlt: "",
        order: index * 10,
      });
    } else if (paragraphs.length > 0 || section.title.trim().length > 0) {
      blocks.push({
        id: section.id,
        type: "text",
        title: section.title,
        html: "",
        paragraphs,
        items: undefined,
        image: null,
        imageAlt: "",
        order: index * 10,
      });
    }

    return blocks;
  });
}

function buildTocEntries(blocks: ArticleBlock[]): TocEntry[] {
  return blocks
    .filter(
      (block) => block.title.trim().length > 0 && block.type !== "divider",
    )
    .map((block) => ({
      id: block.id,
      title: block.title,
    }));
}

function createFallbackArticle(
  slug: string | undefined,
  fallbackCopy: BlogPostFallbackCopy,
): BlogPostArticle {
  const normalizedSlug =
    typeof slug === "string" && slug.trim() ? slug.trim() : "post";

  return {
    slug: normalizedSlug,
    category: fallbackCopy.defaultCategory,
    title:
      typeof slug === "string" && slug.trim()
        ? humanizeSlug(normalizedSlug)
        : fallbackCopy.untitledPost,
    heroImage: null,
    subtitle: fallbackCopy.fallbackSubtitle,
    author: "",
    authorRole: "",
    publishedAt: null,
    readTime: null,
    blocks: [],
  };
}

function mapBlogPostFromApi(
  payload: BlogPostApiResponse,
  fallback: BlogPostArticle,
  formatReadTime: (minutes: number) => string,
): BlogPostArticle {
  const rawBlocks = Array.isArray(payload.blocks)
    ? [...payload.blocks].sort((left, right) => {
        const leftOrder =
          typeof left.order === "number" && Number.isFinite(left.order)
            ? left.order
            : 0;
        const rightOrder =
          typeof right.order === "number" && Number.isFinite(right.order)
            ? right.order
            : 0;
        return leftOrder - rightOrder;
      })
    : [];
  const mappedBlocks = rawBlocks
    .map((block, index): ArticleBlock | null => {
      const title = typeof block.title === "string" ? block.title.trim() : "";
      const paragraphs = toStringArray(block.paragraphs);
      const items = toStringArray(block.items);
      const image =
        [block.image, block.image_url].find(
          (value): value is string =>
            typeof value === "string" && value.trim().length > 0,
        ) ?? null;
      const type = normalizeBlockType(
        typeof block.type === "string"
          ? block.type.trim().toLowerCase()
          : undefined,
        {
          hasItems: Boolean(items?.length),
          hasImage: Boolean(image),
        },
      );
      const rawId =
        typeof block.id === "string" && block.id.trim()
          ? block.id.trim()
          : title || `${type}-${index + 1}`;
      const id = normalizeAnchorId(rawId);

      return {
        id,
        type,
        title,
        html: typeof block.html === "string" ? block.html.trim() : "",
        paragraphs,
        items,
        image,
        imageAlt:
          typeof block.image_alt === "string" ? block.image_alt.trim() : "",
        order:
          typeof block.order === "number" && Number.isFinite(block.order)
            ? block.order
            : index * 10,
      };
    })
    .filter((block): block is ArticleBlock => block !== null);

  const rawSections = Array.isArray(payload.sections) ? payload.sections : [];
  const legacySections = rawSections
    .map((section): ArticleSection | null => {
      const title =
        typeof section.title === "string" ? section.title.trim() : "";
      const rawId =
        typeof section.id === "string" && section.id.trim()
          ? section.id.trim()
          : title || `section-${section.order ?? 0}`;
      if (!title && !rawId) return null;

      return {
        id: normalizeAnchorId(rawId),
        title,
        paragraphs: toStringArray(section.paragraphs),
        bullets: toStringArray(section.bullets),
      };
    })
    .filter((section): section is ArticleSection => section !== null);

  const blocks =
    mappedBlocks.length > 0
      ? mappedBlocks
      : legacySections.length > 0
        ? convertLegacySectionsToBlocks(legacySections)
        : fallback.blocks;

  const publishedAt =
    typeof payload.published_at === "string" && payload.published_at.trim()
      ? payload.published_at
      : fallback.publishedAt;
  const readTime =
    typeof payload.read_time === "string" && payload.read_time.trim()
      ? payload.read_time
      : typeof payload.read_minutes === "number" &&
          Number.isFinite(payload.read_minutes)
        ? formatReadTime(payload.read_minutes)
        : fallback.readTime;
  const heroImage =
    [
      payload.hero_image,
      payload.cover_image,
      payload.image_url,
      payload.image,
      payload.thumbnail,
    ].find(
      (value): value is string =>
        typeof value === "string" && value.trim().length > 0,
    ) ?? fallback.heroImage;

  return {
    slug:
      typeof payload.slug === "string" && payload.slug.trim()
        ? payload.slug
        : fallback.slug,
    category:
      typeof payload.category === "string" && payload.category.trim()
        ? payload.category
        : fallback.category,
    title:
      typeof payload.title === "string" && payload.title.trim()
        ? payload.title
        : fallback.title,
    heroImage,
    subtitle:
      typeof payload.subtitle === "string" && payload.subtitle.trim()
        ? payload.subtitle
        : fallback.subtitle,
    author:
      typeof payload.author === "string" && payload.author.trim()
        ? payload.author
        : "",
    authorRole:
      typeof payload.author_role === "string" && payload.author_role.trim()
        ? payload.author_role
        : "",
    publishedAt,
    readTime,
    blocks,
  };
}

function BrowserHeroIllustration({
  slug,
  category,
  title,
  heroImage,
}: {
  slug: string;
  category: string;
  title: string;
  heroImage: string | null;
}) {
  const hasHeroImage =
    typeof heroImage === "string" && heroImage.trim().length > 0;
  const seededGradient = getSeededHeroGradient(`${slug}:${category}:${title}`);

  return (
    <div
      className="relative h-80 w-full overflow-hidden rounded-[22px] border border-white/35 bg-[#cfe0f1] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] md:h-100 lg:h-120"
      style={hasHeroImage ? undefined : { backgroundImage: seededGradient }}
    >
      {hasHeroImage ? (
        <>
          <img
            src={heroImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/18" />
        </>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_24%,rgba(255,255,255,0.65),transparent_44%),radial-gradient(circle_at_72%_70%,rgba(255,255,255,0.35),transparent_48%)]" />
      )}
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          <span className="inline-flex rounded-full border border-black/25 bg-white/50 px-3 py-1 text-sm font-medium text-[#222222] shadow-inner shadow-black/25 backdrop-blur">
            {category}
          </span>
        </div>
        <div className="max-w-[60%] space-y-3 pb-2 max-md:max-w-[80%]">
          <h1 className="text-2xl leading-tight font-semibold text-white drop-shadow-[0_1px_0_rgba(0,0,0,0.08)] sm:text-3xl">
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
}

function ArticleMedia({ image }: { image: string | null }) {
  const hasImage = typeof image === "string" && image.trim().length > 0;
  if (!hasImage) return null;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[20px] bg-[#d9d9d9]">
      <img
        src={image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}

function RichTextContent({
  html,
  variant = "text",
}: {
  html: string;
  variant?: "text" | "quote";
}) {
  const decoratedHtml = decorateRichTextHtml(html);

  return (
    <div
      className={cn(
        "[&_a]:underline [&_blockquote]:relative [&_blockquote]:mt-3 [&_blockquote]:rounded-2xl [&_blockquote]:bg-[#d9d9d9] [&_blockquote]:px-6 [&_blockquote]:py-5 [&_blockquote]:pl-16 [&_blockquote]:text-xl [&_blockquote]:leading-8 [&_blockquote]:text-[#111111] [&_blockquote]:shadow-[inset_0_2px_10px_rgba(0,0,0,0.25)] [&_blockquote]:sm:text-2xl [&_blockquote_p+p]:mt-3 [&_em]:italic [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:text-[#111111] [&_h2]:sm:text-3xl [&_h3]:text-xl [&_h3]:font-medium [&_h3]:text-[#111111] [&_h3]:sm:text-2xl [&_hr]:my-10 [&_hr]:h-px [&_hr]:border-0 [&_hr]:bg-black/12 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-2xl [&_li]:list-disc [&_li]:marker:text-[#111111] [&_ol]:space-y-3 [&_ol]:pl-8 [&_ol]:text-lg [&_ol]:leading-8 [&_ol]:text-[#2f2f2f] [&_ol]:sm:text-xl [&_p+p]:mt-4 [&_strong]:font-semibold [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-black/10 [&_td]:p-2 [&_th]:border [&_th]:border-black/10 [&_th]:p-2 [&_th]:text-left [&_ul]:space-y-3 [&_ul]:pl-8 [&_ul]:text-lg [&_ul]:leading-8 [&_ul]:text-[#2f2f2f] [&_ul]:sm:text-xl",
        variant === "quote"
          ? "[&_p]:text-xl [&_p]:leading-8 [&_p]:text-[#111111] [&_p]:sm:text-2xl"
          : "[&_p]:text-lg [&_p]:leading-8 [&_p]:text-[#2f2f2f] [&_p]:sm:text-xl",
      )}
      dangerouslySetInnerHTML={{ __html: decoratedHtml }}
    />
  );
}

function TocLink({
  id,
  title,
  active,
  onActivate,
}: {
  id: string;
  title: string;
  index: number;
  active: boolean;
  onActivate: (id: string) => void;
}) {
  return (
    <a
      href={`#${id}`}
      onClick={() => onActivate(id)}
      className={cn(
        "group flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-[#9c8d76]/10",
        active ? "font-medium text-[#222]" : "text-[#666]",
      )}
      aria-current={active ? "location" : undefined}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 shrink-0 rounded-full transition",
          active ? "bg-[#6199d8] opacity-100" : "opacity-0",
        )}
      />
      <span>{title}</span>
    </a>
  );
}

export default function BlogPost() {
  const { t } = useTranslation();
  const { lng, post } = useParams();
  const currentLanguage = resolveLanguage(lng);
  const fallbackCopy = useMemo<BlogPostFallbackCopy>(
    () => ({
      untitledPost: t("blog.common.untitledPost"),
      defaultCategory: t("blog.common.defaultCategory"),
      fallbackSubtitle: t("blog.post.fallbackSubtitle"),
    }),
    [currentLanguage, t],
  );
  const [article, setArticle] = useState<BlogPostArticle>(() =>
    createFallbackArticle(post, fallbackCopy),
  );
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );
  const [activeSectionId, setActiveSectionId] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );

  useEffect(() => {
    const fallbackArticle = createFallbackArticle(post, fallbackCopy);
    setArticle(fallbackArticle);
    setStatus(post ? "loading" : "error");

    if (!post) return;

    const controller = new AbortController();

    const loadArticle = async () => {
      try {
        const response = await fetch(`${API_BASE}/blog/posts/${post}/`, {
          signal: controller.signal,
          headers: {
            "Accept-Language": currentLanguage,
          },
        });

        if (!response.ok) {
          throw new Error(`Blog post request failed with ${response.status}`);
        }

        const payload = (await response.json()) as BlogPostApiResponse;
        setArticle(
          mapBlogPostFromApi(payload, fallbackArticle, (minutes) =>
            t("blog.common.minRead", { count: minutes }),
          ),
        );
        setStatus("ready");
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          return;
        }
        console.error("Failed to load blog post detail", error);
        setArticle(fallbackArticle);
        setStatus("error");
      }
    };

    void loadArticle();

    return () => controller.abort();
  }, [currentLanguage, fallbackCopy, post, t]);

  const articlePath = buildLocalizedPath(
    currentLanguage,
    `/blog/${article.slug}`,
  );
  const articleUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${articlePath}`
      : `https://www.aidef.com${articlePath}`;
  const renderableBlocks = article.blocks.filter(isRenderableArticleBlock);
  const tocEntries = buildTocEntries(renderableBlocks);

  useEffect(() => {
    const sectionIds = tocEntries.map((section) => section.id);
    const hashId = window.location.hash.replace("#", "");

    if (hashId && sectionIds.includes(hashId)) {
      setActiveSectionId(hashId);
    } else {
      setActiveSectionId(sectionIds[0] ?? "");
    }

    const sectionElements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top ||
              b.intersectionRatio - a.intersectionRatio,
          );

        if (visibleEntries[0]) {
          setActiveSectionId(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-18% 0px -60% 0px",
        threshold: [0, 0.15, 0.35, 0.6],
      },
    );

    sectionElements.forEach((element) => observer.observe(element));

    const handleHashChange = () => {
      const nextHash = window.location.hash.replace("#", "");
      if (nextHash && sectionIds.includes(nextHash)) {
        setActiveSectionId(nextHash);
      }
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [tocEntries]);

  const handleCopyArticleUrl = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(articleUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = articleUrl;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopyState("copied");
    } catch (error) {
      console.error("Failed to copy article URL", error);
      setCopyState("error");
    }

    window.setTimeout(() => {
      setCopyState((prev) => (prev === "idle" ? prev : "idle"));
    }, 1500);
  };

  return (
    <main className="relative pt-34 pb-24 max-lg:pt-32 max-md:pb-16">
      <div className="container">
        <div className="rounded-[28px] border border-white/70 bg-white shadow-xl shadow-black/50 backdrop-blur-xl">
          <div className="space-y-6 p-5">
            <div className="rounded-3xl border border-white/70 bg-white/55">
              <BrowserHeroIllustration
                slug={article.slug}
                category={article.category}
                title={article.title}
                heroImage={article.heroImage}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-[240px_1fr] lg:items-start">
              <div className="space-y-4 lg:sticky lg:top-32 xl:top-34">
                {tocEntries.length > 0 ? (
                  <>
                    <p className="text-[#666666]">
                      {t("blog.post.tableOfContent")}
                    </p>
                    <div className="flex flex-col max-lg:rounded-xl max-lg:border max-lg:border-gray-300/75 max-lg:bg-gray-300/25 max-lg:p-2.5">
                      {tocEntries.map((section, index) => (
                        <TocLink
                          key={section.id}
                          id={section.id}
                          title={section.title}
                          index={index}
                          active={activeSectionId === section.id}
                          onActivate={setActiveSectionId}
                        />
                      ))}
                    </div>
                  </>
                ) : null}

                <div className="flex items-center justify-between gap-3 rounded-2xl border border-black/10 bg-[#999]/7 px-4 py-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-md ring-1 shadow-black/15 ring-[#EEF2F7]">
                    <Link2 className="h-4.5 w-4.5 text-[#76B8FF]" />
                  </div>

                  <p className="text-sm font-medium tracking-tight text-[#9da3b2]">
                    {t("blog.post.share")}
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyArticleUrl}
                      className={cn(
                        "grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors",
                        copyState === "copied"
                          ? "bg-[#EEF6FF] text-[#3B82F6]"
                          : copyState === "error"
                            ? "bg-rose-50 text-rose-600"
                            : "text-[#202020] hover:bg-[#F8FAFC]",
                      )}
                      aria-label={
                        copyState === "copied"
                          ? t("blog.post.copy.aria.copied")
                          : t("blog.post.copy.aria.copy")
                      }
                      title={
                        copyState === "copied"
                          ? t("blog.post.copy.title.copied")
                          : copyState === "error"
                            ? t("blog.post.copy.title.error")
                            : t("blog.post.copy.title.default")
                      }
                    >
                      <Copy className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              <article
                className="space-y-6 rounded-2xl border border-white/70 bg-white/78 p-5 pt-0 shadow-[0_20px_40px_-30px_rgba(0,0,0,0.24)]"
                aria-busy={status === "loading"}
              >
                <div className="flex justify-between md:grid-cols-[220px_1fr_auto] md:items-center">
                  {article.author.trim().length > 0 ? (
                    <div className="flex items-center gap-3">
                      <div className="grid h-8 w-8 place-items-center rounded-full border border-[#D1D5DB] bg-white text-sm font-semibold text-[#374151]">
                        {article.author
                          .split(" ")
                          .map((part) => part.charAt(0))
                          .join("")}
                      </div>
                      <div>
                        <p className="text-lg font-medium text-[#222]">
                          {article.author}
                        </p>
                      </div>
                    </div>
                  ) : null}
                  <div className="flex flex-wrap items-center gap-3 text-[#6B7280]">
                    {article.publishedAt ? (
                      <span className="inline-flex items-center gap-1.5 font-medium text-[#555]">
                        {formatDate(article.publishedAt, currentLanguage)}
                      </span>
                    ) : null}
                    {article.publishedAt && article.readTime ? (
                      <span className="hidden h-1 w-1 rounded-full bg-[#666]/75 md:block" />
                    ) : null}
                    {article.readTime ? (
                      <span className="inline-flex items-center gap-1.5 text-[#666]/75">
                        {article.readTime}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-9">
                  <section className="space-y-3">
                    <h1 className="text-3xl leading-tight font-semibold text-[#222222] md:text-4xl">
                      {article.title}
                    </h1>
                    <p className="text-text-alt text-xl leading-tight md:text-2xl">
                      {article.subtitle}
                    </p>
                  </section>

                  {renderableBlocks.map((block, index) => {
                    const hasContentBlockBelow = renderableBlocks
                      .slice(index + 1)
                      .some((candidate) => candidate.type !== "divider");

                    if (block.type === "bullets") {
                      const hasRichText = block.html.trim().length > 0;

                      return (
                        <section
                          key={block.id}
                          id={block.id}
                          className="scroll-mt-32 space-y-6"
                        >
                          {!hasRichText && (block.items ?? []).length > 0 ? (
                            <ul className="space-y-4 pl-8 text-xl leading-8 text-[#111111] marker:text-[#111111] sm:text-2xl sm:leading-9">
                              {(block.items ?? []).map((item) => (
                                <li key={item} className="list-disc">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          ) : null}

                          {block.title ||
                          hasRichText ||
                          (block.paragraphs ?? []).length > 0 ? (
                            <div className="space-y-4">
                              {block.title ? (
                                <h2 className="text-2xl leading-tight font-medium text-[#111111] sm:text-3xl">
                                  {block.title}
                                </h2>
                              ) : null}

                              {block.html ? (
                                <RichTextContent html={block.html} />
                              ) : (
                                (block.paragraphs ?? []).map(
                                  (paragraph, index) => (
                                    <p
                                      key={`${block.id}-p-${index}`}
                                      className="text-lg leading-8 text-[#2f2f2f] sm:text-xl"
                                    >
                                      {paragraph}
                                    </p>
                                  ),
                                )
                              )}
                            </div>
                          ) : null}
                        </section>
                      );
                    }

                    if (block.type === "quote") {
                      return (
                        <section
                          key={block.id}
                          id={block.id}
                          className="scroll-mt-32 space-y-4"
                        >
                          {block.title ? (
                            <h2 className="text-2xl leading-tight font-medium text-[#111111] sm:text-3xl">
                              {block.title}
                            </h2>
                          ) : null}
                          <blockquote className="relative rounded-2xl bg-[#d9d9d9] px-6 py-5 pl-16 text-xl leading-8 text-[#111111] shadow-[inset_0_2px_10px_rgba(0,0,0,0.25)] sm:text-2xl">
                            <Quote
                              className="absolute top-5 left-5 h-6 w-6 text-[#666666]"
                              aria-hidden="true"
                            />
                            {block.html ? (
                              <RichTextContent
                                html={block.html}
                                variant="quote"
                              />
                            ) : (
                              (block.paragraphs ?? []).map(
                                (paragraph, index) => (
                                  <p
                                    key={`${block.id}-quote-${index}`}
                                    className={cn(index > 0 && "mt-3")}
                                  >
                                    {paragraph}
                                  </p>
                                ),
                              )
                            )}
                          </blockquote>
                        </section>
                      );
                    }

                    if (block.type === "image") {
                      return (
                        <section
                          key={block.id}
                          id={block.id}
                          className="scroll-mt-32 space-y-4"
                        >
                          {block.title ? (
                            <h2 className="text-2xl leading-tight font-medium text-[#111111] sm:text-3xl">
                              {block.title}
                            </h2>
                          ) : null}
                          <ArticleMedia image={block.image} />
                          {(block.paragraphs ?? []).map((paragraph, index) => (
                            <p
                              key={`${block.id}-caption-${index}`}
                              className="text-lg leading-8 text-[#2f2f2f] sm:text-xl"
                            >
                              {paragraph}
                            </p>
                          ))}
                        </section>
                      );
                    }

                    if (block.type === "divider") {
                      if (!hasContentBlockBelow) return null;

                      return (
                        <div
                          key={block.id}
                          id={block.id}
                          className="h-px w-full bg-black/12"
                        />
                      );
                    }

                    return (
                      <section
                        key={block.id}
                        id={block.id}
                        className="scroll-mt-32 space-y-4"
                      >
                        {block.title ? (
                          <h2 className="text-2xl leading-tight font-medium text-[#111111] sm:text-3xl">
                            {block.title}
                          </h2>
                        ) : null}

                        {block.html ? (
                          <RichTextContent html={block.html} />
                        ) : (
                          (block.paragraphs ?? []).map((paragraph, index) => (
                            <p
                              key={`${block.id}-p-${index}`}
                              className="text-lg leading-8 text-[#2f2f2f] sm:text-xl"
                            >
                              {paragraph}
                            </p>
                          ))
                        )}
                      </section>
                    );
                  })}
                </div>
              </article>
            </div>

            <section
              className="relative overflow-hidden rounded-[20px] border border-[#28466D] px-6 py-7 text-white shadow-[0_24px_50px_-36px_rgba(0,0,0,0.65)] max-md:px-5 max-md:py-6"
              style={{
                backgroundColor: "#172B4A",
                backgroundImage: "url('/blog-footer-cta.svg')",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            >
              <div className="flex items-center justify-between gap-6 max-md:flex-col max-md:items-start">
                <div className="max-w-[780px] space-y-2">
                  <h2 className="text-3xl font-semibold tracking-tight max-lg:text-2xl">
                    {t("blog.post.cta.title")}
                  </h2>
                  <p className="max-w-[760px] text-base leading-7 text-white/85 max-lg:text-[15px] max-lg:leading-6">
                    {t("blog.post.cta.description")}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={dispatchOpenContactModal}
                  className="group relative inline-flex h-14 w-48 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-white text-lg font-bold text-black uppercase transition-all duration-300 ease-out will-change-transform hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.35),inset_0_-6px_20px_rgba(0,0,0,0.45)] active:scale-[0.93] active:shadow-[inset_0_1px_6px_rgba(255,255,255,0.5),inset_0_-8px_22px_rgba(0,0,0,0.65)] max-md:h-12 max-md:w-42 max-md:text-base"
                >
                  {t("blog.post.cta.button")}
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
