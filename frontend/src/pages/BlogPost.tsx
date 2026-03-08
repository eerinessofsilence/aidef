import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Copy, Link as Link2 } from "lucide-react";
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

type BlogPostTemplate = {
  slug: string;
  category: string;
  title: string;
  heroImage: string | null;
  subtitle: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  readTime: string;
  sections: ArticleSection[];
};

type BlogPostApiSection = {
  id?: string;
  title?: string;
  paragraphs?: unknown;
  bullets?: unknown;
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
  sections?: BlogPostApiSection[];
};

const API_BASE = (() => {
  const raw =
    import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "";
  const trimmed = raw.replace(/\/+$/, "");
  if (!trimmed) return "/api";
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
})();

const TEMPLATE_POST_SLUG = "how-to-write-strong-work-experience";
const TEMPLATE_POST_PUBLISHED_AT = "2026-01-27";

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

type TranslateFn = (key: string, options?: Record<string, unknown>) => string;

function createTemplatePost(t: TranslateFn): BlogPostTemplate {
  return {
    slug: TEMPLATE_POST_SLUG,
    category: t("blog.static.post.category"),
    title: t("blog.static.post.title"),
    heroImage: null,
    subtitle: t("blog.static.post.subtitle"),
    author: t("blog.static.post.author"),
    authorRole: t("blog.static.post.authorRole"),
    publishedAt: TEMPLATE_POST_PUBLISHED_AT,
    readTime: t("blog.common.minRead", { count: 3 }),
    sections: [
      {
        id: "why-work-experience-matters",
        title: t("blog.static.post.sections.why.title"),
        paragraphs: [
          t("blog.static.post.sections.why.paragraph1"),
          t("blog.static.post.sections.why.paragraph2"),
        ],
      },
      {
        id: "tips-to-strengthen",
        title: t("blog.static.post.sections.strengthen.title"),
        bullets: [
          t("blog.static.post.sections.strengthen.bullet1"),
          t("blog.static.post.sections.strengthen.bullet2"),
          t("blog.static.post.sections.strengthen.bullet3"),
          t("blog.static.post.sections.strengthen.bullet4"),
          t("blog.static.post.sections.strengthen.bullet5"),
        ],
        paragraphs: [t("blog.static.post.sections.strengthen.paragraph1")],
      },
      {
        id: "example-rewrite",
        title: t("blog.static.post.sections.rewrite.title"),
        paragraphs: [
          t("blog.static.post.sections.rewrite.paragraph1"),
          t("blog.static.post.sections.rewrite.paragraph2"),
          t("blog.static.post.sections.rewrite.paragraph3"),
        ],
      },
      {
        id: "final-takeaway",
        title: t("blog.static.post.sections.takeaway.title"),
        paragraphs: [
          t("blog.static.post.sections.takeaway.paragraph1"),
          t("blog.static.post.sections.takeaway.paragraph2"),
        ],
      },
    ],
  };
}

function getPostBySlug(
  slug: string | undefined,
  t: TranslateFn,
): BlogPostTemplate {
  const templatePost = createTemplatePost(t);
  if (!slug || slug === templatePost.slug) return templatePost;
  return {
    ...templatePost,
    slug,
    title: humanizeSlug(slug),
    subtitle: t("blog.post.fallbackSubtitle"),
  };
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

function mapBlogPostFromApi(
  payload: BlogPostApiResponse,
  fallback: BlogPostTemplate,
  formatReadTime: (minutes: number) => string,
): BlogPostTemplate {
  const rawSections = Array.isArray(payload.sections) ? payload.sections : [];
  const mappedSections = rawSections
    .map((section): ArticleSection | null => {
      const title =
        typeof section.title === "string" ? section.title.trim() : "";
      const id =
        typeof section.id === "string" && section.id.trim()
          ? section.id.trim()
          : title
            ? toSectionId(title)
            : "";

      if (!title || !id) return null;

      return {
        id,
        title,
        paragraphs: toStringArray(section.paragraphs),
        bullets: toStringArray(section.bullets),
      };
    })
    .filter((section): section is ArticleSection => section !== null);

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
        : fallback.author,
    authorRole:
      typeof payload.author_role === "string" && payload.author_role.trim()
        ? payload.author_role
        : fallback.authorRole,
    publishedAt,
    readTime,
    sections: mappedSections.length > 0 ? mappedSections : fallback.sections,
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
      className="relative h-80 w-full overflow-hidden rounded-[22px] border border-white/35 bg-[#cfe0f1] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] sm:h-90 lg:h-10"
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
          <span className="inline-flex rounded-full border border-white/40 bg-white/45 px-3 py-1 text-xs font-medium text-[#6B7280] backdrop-blur">
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
        "group flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm transition hover:bg-[#9c8d76]/10",
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
  const [article, setArticle] = useState<BlogPostTemplate>(() =>
    getPostBySlug(post, t),
  );
  const [activeSectionId, setActiveSectionId] = useState(
    getPostBySlug(post, t).sections[0]?.id ?? "",
  );
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );

  useEffect(() => {
    const fallbackArticle = getPostBySlug(post, t);
    setArticle(fallbackArticle);

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
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          return;
        }
        console.error("Failed to load blog post detail", error);
        setArticle(fallbackArticle);
      }
    };

    void loadArticle();

    return () => controller.abort();
  }, [currentLanguage, post, t]);

  const articlePath = buildLocalizedPath(
    currentLanguage,
    `/blog/${article.slug}`,
  );
  const articleUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${articlePath}`
      : `https://www.aidef.com${articlePath}`;
  const weakExamplePrefix = t("blog.static.post.prefix.weak");
  const strongerExamplePrefix = t("blog.static.post.prefix.stronger");

  useEffect(() => {
    const sectionIds = article.sections.map((section) => section.id);
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
  }, [article.slug, article.sections]);

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
                <p className="text-sm text-[#9CA3AF]">
                  {t("blog.post.tableOfContent")}
                </p>
                <div className="flex flex-col max-lg:rounded-xl max-lg:border max-lg:border-gray-300/75 max-lg:bg-gray-300/25 max-lg:p-2.5">
                  {article.sections.map((section, index) => (
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

                <div className="flex max-w-75 items-center justify-between gap-3 rounded-2xl border border-black/10 bg-[#999]/7 px-4 py-3">
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

              <article className="space-y-10 rounded-2xl border border-white/70 bg-white/78 p-5 pt-0 shadow-[0_20px_40px_-30px_rgba(0,0,0,0.24)]">
                <div className="flex justify-between md:grid-cols-[220px_1fr_auto] md:items-center">
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
                  <div className="flex flex-wrap items-center gap-3 text-sm text-[#6B7280]">
                    <span className="inline-flex items-center gap-1.5 font-medium text-[#555]">
                      {formatDate(article.publishedAt, currentLanguage)}
                    </span>
                    <span className="hidden h-1 w-1 rounded-full bg-[#666]/75 md:block" />
                    <span className="inline-flex items-center gap-1.5 text-[#666]/75">
                      {article.readTime}
                    </span>
                  </div>
                </div>

                <div className="space-y-9">
                  {article.sections.map((section) => (
                    <section
                      key={section.id}
                      id={section.id}
                      className="scroll-mt-32"
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <h2 className="text-2xl font-semibold text-[#111827]">
                          {section.title}
                        </h2>
                      </div>

                      {section.paragraphs?.map((paragraph, index) => (
                        <p
                          key={`${section.id}-p-${index}`}
                          className={cn(
                            "text-base leading-6 text-[#6B7280]",
                            index > 0 && "mt-4",
                            paragraph.startsWith(weakExamplePrefix) ||
                              paragraph.startsWith(strongerExamplePrefix)
                              ? "rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 font-medium text-[#475569]"
                              : "",
                          )}
                        >
                          {paragraph}
                        </p>
                      ))}

                      {section.bullets ? (
                        <ul className="mt-4 space-y-3">
                          {section.bullets.map((bullet) => (
                            <li
                              key={bullet}
                              className="flex items-center gap-3 text-base leading-7 text-[#4B5563]"
                            >
                              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#93C5FD]" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </section>
                  ))}
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
