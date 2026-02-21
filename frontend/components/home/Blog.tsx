"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { ScrollReveal } from "../ui/scroll-reveal";

type LinkedInEmbedPost = {
  id: number;
  embedUrl: string;
  order?: number | null;
};

type LinkedInPostApiItem = {
  id: number;
  embed_url: string;
  order?: number | null;
};

export default function Blog() {
  const [posts, setPosts] = useState<LinkedInEmbedPost[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );
  const [loadError, setLoadError] = useState<string | null>(null);

  const apiBase = useMemo(() => {
    const metaEnv = (import.meta as any).env || {};
    const raw = metaEnv.VITE_API_BASE_URL || metaEnv.VITE_API_URL || "";
    const trimmed = raw.replace(/\/+$/, "");
    if (!trimmed) return "/api";
    return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    setLoadError(null);

    axios
      .get<LinkedInPostApiItem[]>(`${apiBase}/linkedin-posts/`, {
        signal: controller.signal,
      })
      .then((response) => {
        const nextPosts = response.data.map((item) => ({
          id: item.id,
          embedUrl: item.embed_url,
          order: item.order,
        }));
        setPosts(nextPosts);
        setStatus("ready");
      })
      .catch((error) => {
        if (axios.isCancel(error)) return;
        console.error("Unable to load LinkedIn posts", error);
        setLoadError("Unable to load LinkedIn posts right now.");
        setPosts([]);
        setStatus("error");
      });

    return () => controller.abort();
  }, [apiBase]);

  const visibleLinkedInPosts = useMemo(
    () =>
      [...posts]
        .filter((post) => Boolean(post.embedUrl))
        .sort(
          (a, b) =>
            (a.order ?? Number.MAX_SAFE_INTEGER) -
              (b.order ?? Number.MAX_SAFE_INTEGER) || a.id - b.id,
        ),
    [posts],
  );

  return (
    <section className="container mx-auto space-y-12 px-5 py-20 max-lg:py-10">
      <ScrollReveal
        className="flex flex-col items-center justify-center gap-4 text-center"
        from="down"
        duration={0.5}
        distance={0}
      >
        <p className="text-foreground/60 text-sm tracking-[0.18em] uppercase">
          Social updates
        </p>
        <h2 className="text-5xl font-bold max-lg:text-4xl">
          Latest LinkedIn posts
        </h2>
        <p className="text-foreground/75 max-w-3xl text-lg max-md:text-base">
          Product updates and engineering highlights from our social feed.
        </p>
      </ScrollReveal>
      <div className="w-full">
        <ScrollReveal
          delay={0.15}
          className={`flex w-full flex-nowrap items-start gap-6 overflow-x-auto ${
            visibleLinkedInPosts.length < 0 ? "justify-center" : ""
          }`}
        >
          {visibleLinkedInPosts.length > 0 ? (
            visibleLinkedInPosts.map((post) => (
              <iframe
                key={post.id}
                src={post.embedUrl}
                title="Embed post"
                className="h-[636px] w-[504px] max-w-none shrink-0 rounded-2xl border border-white/10 bg-white/5 shadow-[0_20px_40px_-28px_rgba(0,0,0,0.55)]"
                frameBorder="0"
                allowFullScreen
                loading="lazy"
              />
            ))
          ) : (
            <div className="flex items-center justify-center">
              <div className="text-foreground/70 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                {status === "loading"
                  ? "Loading LinkedIn posts..."
                  : "No LinkedIn posts added yet."}
              </div>
            </div>
          )}
        </ScrollReveal>
        {status === "error" && loadError ? (
          <p className="mt-3 text-center text-sm text-red-300">{loadError}</p>
        ) : null}
      </div>
    </section>
  );
}
