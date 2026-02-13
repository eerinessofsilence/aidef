"use client";

import { ScrollReveal } from "../ui/scroll-reveal";

type DummyLinkedInPost = {
  id: number;
  author: string;
  role: string;
  publishedAt: string;
  text: string;
  image: string;
  reactions: number;
  comments: number;
  url: string;
};

type LinkedInEmbedPost = {
  id: number;
  embedUrl: string;
  height?: number;
};

const LINKEDIN_POSTS: LinkedInEmbedPost[] = [
  {
    id: 1,
    embedUrl:
      "https://www.linkedin.com/embed/feed/update/urn:li:share:7424766080130125824?collapsed=1",
    height: 636,
  },
  {
    id: 2,
    embedUrl:
      "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7424765399566655488?collapsed=1",
    height: 862,
  },
  {
    id: 3,
    embedUrl:
      "https://www.linkedin.com/embed/feed/update/urn:li:share:7424218069163696128?collapsed=1",
    height: 636,
  },
];

const DUMMY_POSTS: DummyLinkedInPost[] = [
  {
    id: 1,
    author: "AI-DEF",
    role: "Aerospace Engineering",
    publishedAt: "2026-02-11",
    text: "Field validation complete: AX2NG autonomous guidance package hit 98.4% mission-path accuracy in low-visibility test windows.",
    image: "/hero-bg-1.jpg",
    reactions: 184,
    comments: 21,
    url: "https://www.linkedin.com/",
  },
  {
    id: 2,
    author: "AI-DEF",
    role: "Systems Integration",
    publishedAt: "2026-02-09",
    text: "Live integration update: ground control telemetry now streams with lower packet loss under high-load swarm scenarios.",
    image: "/hero-bg-2.jpg",
    reactions: 132,
    comments: 14,
    url: "https://www.linkedin.com/",
  },
  {
    id: 3,
    author: "AI-DEF",
    role: "Product Development",
    publishedAt: "2026-02-06",
    text: "New production run shipped this week with refined airframe tolerances and a faster pre-flight diagnostics cycle.",
    image: "/hero-bg-3.jpg",
    reactions: 97,
    comments: 9,
    url: "https://www.linkedin.com/",
  },
];

function formatPostDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default function Blog() {
  const isProduction = import.meta.env.PROD;
  const visibleLinkedInPosts = LINKEDIN_POSTS.filter((post) =>
    Boolean(post.embedUrl),
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
      {isProduction ? (
        <div className="flex flex-wrap items-start justify-center gap-6">
          {visibleLinkedInPosts.map((post, index) => (
            <ScrollReveal key={post.id} delay={index * 0.08}>
              <div className="border-border/35 bg-secondary/20 w-full max-w-[504px] overflow-hidden rounded-3xl border p-2 backdrop-blur-sm">
                <iframe
                  src={post.embedUrl}
                  title="Embed post"
                  width={504}
                  height={post.height ?? 804}
                  frameBorder="0"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {DUMMY_POSTS.map((post, index) => (
            <ScrollReveal key={post.id} delay={index * 0.08}>
              <article className="border-border/35 bg-secondary/20 hover:border-border/60 flex h-full flex-col overflow-hidden rounded-3xl border backdrop-blur-sm transition">
                <header className="border-border/20 flex items-center gap-3 border-b px-5 py-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-sm font-semibold">
                    AD
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {post.author}
                    </p>
                    <p className="text-foreground/60 truncate text-xs">
                      {post.role}
                    </p>
                  </div>
                  <p className="text-foreground/50 ml-auto text-xs whitespace-nowrap">
                    {formatPostDate(post.publishedAt)}
                  </p>
                </header>
                <div className="space-y-4 px-5 pt-4 pb-5">
                  <p className="text-foreground/85 min-h-24 text-sm leading-relaxed">
                    {post.text}
                  </p>
                  <div className="overflow-hidden rounded-2xl">
                    <img
                      src={post.image}
                      alt={`${post.author} post`}
                      className="h-48 w-full object-cover"
                    />
                  </div>
                  <footer className="text-foreground/65 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
                    <span>{post.reactions} reactions</span>
                    <span>{post.comments} comments</span>
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-[#7ec3ff] hover:text-[#a8d8ff]"
                    >
                      View post
                    </a>
                  </footer>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      )}
    </section>
  );
}
