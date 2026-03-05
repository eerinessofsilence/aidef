"use client";

import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, Calendar, Clock3 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ScrollReveal } from "../ui/scroll-reveal";
import { buildLocalizedPath, resolveLanguage } from "../../src/i18n";

type BlogPostListApiItem = {
  id?: number;
  slug?: string;
  category?: string | null;
  title?: string;
  subtitle?: string;
  hero_image?: string | null;
  published_at?: string | null;
  read_minutes?: number;
  read_time?: string;
  author?: string;
};

type HomeBlogPostCard = {
  id: number;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  image: string | null;
  publishedAt: string;
  readMinutes: number;
  author: string;
};

const API_BASE = (() => {
  const raw =
    import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "";
  const trimmed = raw.replace(/\/+$/, "");
  if (!trimmed) return "/api";
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
})();

function formatDate(dateString: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

function hashString(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function getSeededGradient(seed: string) {
  const hash = hashString(seed);
  const hueA = hash % 360;
  const hueB = (hueA + 40 + ((hash >>> 8) % 70)) % 360;
  const hueC = (hueA + 170 + ((hash >>> 16) % 50)) % 360;

  return `linear-gradient(135deg, hsl(${hueA} 60% 74%) 0%, hsl(${hueB} 58% 62%) 52%, hsl(${hueC} 52% 70%) 100%)`;
}

function getSafeDate(value: string | null | undefined) {
  if (typeof value !== "string" || !value.trim()) return "2026-01-01";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "2026-01-01";
  return value;
}

function getReadMinutes(
  readMinutes: number | undefined,
  readTime: string | undefined,
) {
  if (typeof readMinutes === "number" && Number.isFinite(readMinutes)) {
    return Math.max(1, Math.round(readMinutes));
  }
  if (typeof readTime === "string") {
    const match = readTime.match(/\d+/);
    if (match) return Math.max(1, Number.parseInt(match[0], 10));
  }
  return 3;
}

type BlogFallbackCopy = {
  defaultCategory: string;
  untitledPost: string;
  openArticleFallback: string;
  defaultAuthor: string;
};

function mapApiPost(
  item: BlogPostListApiItem,
  fallbackCopy: BlogFallbackCopy,
): HomeBlogPostCard | null {
  if (typeof item.id !== "number" || !Number.isFinite(item.id)) return null;
  if (typeof item.slug !== "string" || !item.slug.trim()) return null;

  return {
    id: item.id,
    slug: item.slug.trim(),
    category:
      typeof item.category === "string" && item.category.trim()
        ? item.category.trim()
        : fallbackCopy.defaultCategory,
    title:
      typeof item.title === "string" && item.title.trim()
        ? item.title.trim()
        : fallbackCopy.untitledPost,
    excerpt:
      typeof item.subtitle === "string" && item.subtitle.trim()
        ? item.subtitle.trim()
        : fallbackCopy.openArticleFallback,
    image:
      typeof item.hero_image === "string" && item.hero_image.trim()
        ? item.hero_image.trim()
        : null,
    publishedAt: getSafeDate(item.published_at),
    readMinutes: getReadMinutes(item.read_minutes, item.read_time),
    author:
      typeof item.author === "string" && item.author.trim()
        ? item.author.trim()
        : fallbackCopy.defaultAuthor,
  };
}

export default function LatestBlogPosts() {
  const { t } = useTranslation();
  const { lng } = useParams<{ lng?: string }>();
  const currentLanguage = resolveLanguage(lng);
  const [posts, setPosts] = useState<HomeBlogPostCard[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );

  const fallbackCopy = useMemo<BlogFallbackCopy>(
    () => ({
      defaultCategory: t("blog.common.defaultCategory"),
      untitledPost: t("blog.common.untitledPost"),
      openArticleFallback: t("blog.common.openArticleFallback"),
      defaultAuthor: t("blog.common.defaultAuthor"),
    }),
    [t, currentLanguage],
  );

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");

    const loadPosts = async () => {
      try {
        const response = await fetch(`${API_BASE}/blog/posts/`, {
          signal: controller.signal,
          headers: {
            "Accept-Language": currentLanguage,
          },
        });

        if (!response.ok) {
          throw new Error(`Blog list request failed with ${response.status}`);
        }

        const payload = (await response.json()) as BlogPostListApiItem[];
        const mapped = Array.isArray(payload)
          ? payload
              .map((item) => mapApiPost(item, fallbackCopy))
              .filter((item): item is HomeBlogPostCard => item !== null)
              .slice(0, 3)
          : [];

        setPosts(mapped);
        setStatus("ready");
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        console.error("Failed to load latest blog posts for home page", error);
        setPosts([]);
        setStatus("error");
      }
    };

    void loadPosts();

    return () => controller.abort();
  }, [currentLanguage, fallbackCopy]);

  const viewAllHref = buildLocalizedPath(currentLanguage, "/blog");

  return (
    <section className="container space-y-8 py-16 max-lg:py-12">
      <div className="flex justify-center">
        <div className="text-center">
          <p className="text-foreground/60 text-sm tracking-[0.18em] uppercase">
            {t("blog.home.kicker")}
          </p>
          <h2 className="mt-2 text-5xl font-bold max-md:text-4xl">
            {t("blog.home.title")}
          </h2>
          <p className="text-foreground/70 mt-2 max-w-2xl text-base max-md:text-sm">
            {t("blog.home.description")}
          </p>
        </div>
      </div>
      {status === "ready" && posts.length === 0 ? (
        <div className="flex justify-center">
          <div className="w-fit rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
            {t("blog.home.empty")}
          </div>
        </div>
      ) : (
        <div className="space-y-5 overflow-hidden rounded-[28px] border border-white/10 bg-white/4 p-5 shadow-[0_25px_70px_-45px_rgba(0,0,0,0.75)] backdrop-blur-sm max-md:rounded-3xl max-md:p-4">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post, index) => {
              const articleHref = buildLocalizedPath(
                currentLanguage,
                `/blog/${post.slug}`,
              );

              return (
                <ScrollReveal
                  key={post.id}
                  delay={Math.min(index * 0.06, 0.18)}
                  from="up"
                  distance={12}
                >
                  <Link
                    to={articleHref}
                    className="group block h-full overflow-hidden rounded-2xl border border-white/10 bg-white/6 shadow-[0_20px_50px_-36px_rgba(0,0,0,0.7)] transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/8"
                  >
                    <div className="relative aspect-16/10 overflow-hidden">
                      {post.image ? (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className="h-full w-full"
                          style={{
                            backgroundImage: getSeededGradient(
                              `${post.slug}:${post.category}:${post.title}`,
                            ),
                          }}
                        />
                      )}
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,7,18,0.05)_0%,rgba(3,7,18,0.55)_100%)]" />
                      <span className="absolute top-3 left-3 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[11px] font-medium tracking-[0.08em] text-white uppercase backdrop-blur">
                        {post.category}
                      </span>
                    </div>

                    <div className="space-y-3 p-4">
                      <h3 className="line-clamp-2 text-lg leading-6 font-semibold text-white">
                        {post.title}
                      </h3>
                      <p className="text-foreground/70 line-clamp-3 text-sm leading-6">
                        {post.excerpt}
                      </p>

                      <div className="text-foreground/65 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                        <span className="text-white/80">{post.author}</span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(post.publishedAt, currentLanguage)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock3 className="h-3.5 w-3.5" />
                          {t("blog.common.minRead", {
                            count: post.readMinutes,
                          })}
                        </span>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
          <div className="flex justify-end">
            <Link
              to={viewAllHref}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-4 py-2 text-sm font-medium text-white transition hover:border-white/35 hover:bg-white/12"
            >
              {t("blog.home.viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {status === "loading" && posts.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
              {t("blog.home.loading")}
            </div>
          ) : null}

          {status === "error" ? (
            <div className="mt-6 rounded-2xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {t("blog.home.error")}
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
