import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Cpu,
  FileText,
  Gauge,
  Lock,
  LogOut,
  Package2,
  Radar,
  Radio,
  Settings,
  ShieldCheck,
  UserRound,
} from "lucide-react";

type StoredUser = {
  email?: string;
  first_name?: string;
  last_name?: string;
};

export default function ClientPortal() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<{
    email: string | null;
    name: string | null;
  }>({ email: null, name: null });
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const API_BASE = useMemo(() => {
    const raw =
      import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "";
    const trimmed = raw.replace(/\/+$/, "");
    if (!trimmed) return "/api";
    return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncUserProfile = () => {
      const rawUser =
        localStorage.getItem("authUser") || sessionStorage.getItem("authUser");
      if (!rawUser) {
        setUserProfile({ email: null, name: null });
        return;
      }
      try {
        const parsed = JSON.parse(rawUser) as StoredUser;
        const email =
          typeof parsed.email === "string" ? parsed.email.trim() : null;
        const first =
          typeof parsed.first_name === "string" ? parsed.first_name.trim() : "";
        const last =
          typeof parsed.last_name === "string" ? parsed.last_name.trim() : "";
        const name =
          [first, last].filter(Boolean).join(" ").trim() ||
          (email ? email.split("@")[0] : null);
        setUserProfile({ email, name });
      } catch (error) {
        console.error("Unable to parse stored user", error);
        setUserProfile({ email: null, name: null });
      }
    };

    syncUserProfile();
    window.addEventListener("auth-updated", syncUserProfile);
    return () => window.removeEventListener("auth-updated", syncUserProfile);
  }, []);

  useEffect(() => {
    const token =
      (typeof window !== "undefined" &&
        (localStorage.getItem("authToken") ||
          sessionStorage.getItem("authToken"))) ||
      null;
    if (!token) {
      navigate("/auth", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickAway = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickAway);
    return () => document.removeEventListener("mousedown", handleClickAway);
  }, [menuOpen]);

  const displayName = userProfile.name || userProfile.email || "Operator";

  const products = [
    {
      id: "ax2ng-krakatit",
      name: "AX2NG KRAKATIT",
      serial: "SN-XXXX-XXXX",
      status: "Active / Owned",
      image: "/drone-product-detail-1.png",
      images: ["/drone-product-detail-1.png", "/drone-product-detail-2.png"],
      range: "120 km+",
      summary:
        "Long-range, multi-role tactical UAV designed for ISR, denied-area recon, and rapid deployment.",
      highlight: "mission-ready",
    },
  ];

  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    () => products[0]?.id ?? null,
  );
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  const specGroups = [
    {
      title: "Positioning & Role",
      icon: ShieldCheck,
      items: [
        {
          label: "Mission type",
          value: "Jet-powered kamikaze UAV for ground and air targets",
        },
        { label: "Effect", value: "4 kg HE/HEF charge for high-value targets" },
        {
          label: "Tagline",
          value: "high speed, difficult-defense breakthrough",
        },
        {
          label: "Integration",
          value: "Swarm-ready, C2 compatible, human-in-loop override",
        },
      ],
    },
    {
      title: "Performance Envelope",
      icon: Gauge,
      items: [
        {
          label: "Autonomous range",
          value: "150 km (operator search radius 110 km)",
        },
        { label: "Max speed (Vne)", value: "430 km/h jet-powered" },
        { label: "Endurance / wait", value: "20-40 min on-station" },
        { label: "Weight", value: "29-35 kg incl. warhead; 4 kg charge" },
        { label: "Dimensions", value: "Length 1.96 m / span 2.16 m" },
        { label: "Prep time", value: "5 minutes from kit to launch" },
      ],
    },
    {
      title: "Autonomy & AI Navigation",
      icon: Cpu,
      items: [
        {
          label: "Intelligent nav",
          value: "Identify/classify/track, object cataloging, swarm control",
        },
        {
          label: "GNSS-denied",
          value:
            "AI fusion of AHRS, magnetometer, differential LiDAR, optical flow",
        },
        {
          label: "Synthetic vision",
          value: "Jetson onboard AI; flight without GPS",
        },
        {
          label: "Training corpus",
          value:
            "161,742 frames / 1,366,494 objects across civilian and military classes",
        },
      ],
    },
    {
      title: "Sensors & EW Resilience",
      icon: Radar,
      items: [
        {
          label: "Primary sensors",
          value: "IR, RGB, LiDAR plus frequency and direction scanning",
        },
        {
          label: "EW hardening",
          value: "GNSS-independent nav, AoA sensors, Safe-Arm control block",
        },
        {
          label: "Comms",
          value:
            "RS-422 hardened link; NLOS commands; Starlink and LTE fallback",
        },
        {
          label: "Swarm ops",
          value: "Data exchange, relay, and reconfiguration between UAVs",
        },
      ],
    },
    {
      title: "Control & Mission Modes",
      icon: Settings,
      items: [
        {
          label: "Control methods",
          value: "Manual, semi-autonomous, autonomous; human override",
        },
        {
          label: "Modes",
          value:
            "Takeoff, route, circle, re-entry, hold, flight-to-point, special",
        },
        {
          label: "Guidance",
          value: "NLOS operator commands plus autonomous/autopilot",
        },
        {
          label: "Operations",
          value:
            "Data logging, telemetry, program execution, status monitoring",
        },
      ],
    },
    {
      title: "Ground Control Station",
      icon: Radio,
      items: [
        {
          label: "Concept",
          value:
            "Military-grade, fire-and-forget; 1 station controls 5+ drones",
        },
        {
          label: "Software",
          value:
            "AI-Def Pilot (UAS) and AI-Def Targeting (dual-res RGB/thermal, map cues)",
        },
        {
          label: "Hardware",
          value: "Rugged GCS with 16-core Intel CPU and Nvidia RTX GPU",
        },
      ],
    },
  ];

  const upgrades = [
    {
      title: "ENGINE AD20PRO",
      description:
        "Dedicated to professional applications (UAVs, etc.) and modelers who prefer reliability and a long operational life.",
      image: "/add-on-modules-1.png",
      action: "Request",
    },
    {
      title: "AUTOMATIC FLIGHT CONTROLER",
      description:
        "Control the flight of UAV in automatic and semiautomatic regime",
      image: "/add-on-modules-2.png",
      action: "Request",
    },
    {
      title: "BOOSTER",
      description:
        "Greater range, stronger takeoff performance and lower detectability ensure fast, reliable mission readiness in only three minutes.",
      image: "/add-on-modules-3.png",
      action: "Request",
    },
    {
      title: "Dual Satellite Navigation System",
      description:
        "Position calculation of a vehicle with the ability of spoofing detection",
      image: "/add-on-modules-4.png",
      action: "Request",
    },
    {
      title: "PAYLOAD ACTIVATION BOARD",
      description:
        "The board is designed to electrically activate different types of payloads",
      image: "/add-on-modules-5.png",
      action: "Request",
    },
    {
      title: "Pitot tube",
      description: "Integrated angle of attack and sliding angle sensor",
      image: "/add-on-modules-6.png",
      action: "Request",
    },
  ];

  const selectedProduct =
    products.find((product) => product.id === selectedProductId) || products[0];

  const productImages =
    selectedProduct?.images?.length && selectedProduct.images.length > 0
      ? selectedProduct.images
      : selectedProduct?.image
        ? [selectedProduct.image]
        : [];
  const hasMultipleImages = productImages.length > 1;

  useEffect(() => {
    setActiveMediaIndex(0);
  }, [selectedProductId]);

  const handleSignOut = async () => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    try {
      await fetch(`${API_BASE}/auth/logout/`, {
        method: "POST",
        headers: token ? { Authorization: `Token ${token}` } : undefined,
        credentials: "include",
      });
    } catch (err) {
      console.error(err);
    }

    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    sessionStorage.removeItem("authUser");
    window.dispatchEvent(new Event("auth-updated"));
    navigate("/", { replace: true });
  };

  const showPreviousImage = () => {
    setActiveMediaIndex((current) => {
      if (!productImages.length) return current;
      return (current - 1 + productImages.length) % productImages.length;
    });
  };

  const showNextImage = () => {
    setActiveMediaIndex((current) => {
      if (!productImages.length) return current;
      return (current + 1) % productImages.length;
    });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(46,126,255,0.12),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(91,194,255,0.16),transparent_25%),radial-gradient(circle_at_50%_80%,rgba(34,197,94,0.1),transparent_30%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.02)_40%,transparent_65%)]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
        <div className="container flex justify-between gap-3 px-4 py-4">
          <div className="flex items-center justify-center gap-3">
            <div className="flex max-w-40 items-center justify-center">
              <a href="/">
                <img src="/logo-ai-def.svg" alt="" />
              </a>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <div ref={menuRef} className="relative">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex w-full min-w-0 cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2 py-2 text-left shadow-lg shadow-black/30 transition hover:border-white/30 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-sky-400/70 focus-visible:outline-none sm:w-auto"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                  <UserRound className="h-4 w-4" aria-hidden="true" />
                </span>
                <p className="max-w-40 min-w-0 truncate text-sm tracking-tight sm:max-w-48">
                  {displayName}
                </p>
                <ChevronDown
                  className={`h-4 w-4 transition duration-300 ${
                    menuOpen ? "rotate-180 text-white" : "text-white/60"
                  }`}
                  aria-hidden="true"
                />
              </button>

              {menuOpen ? (
                <div className="absolute top-[calc(100%+0.6rem)] right-0 z-20 w-full max-w-[18rem] rounded-2xl border border-white/10 bg-slate-900/90 p-1 shadow-2xl backdrop-blur-lg">
                  <div className="px-3 py-2 text-[11px] font-semibold tracking-[0.14em] text-white/50 uppercase">
                    Account
                  </div>
                  <button
                    type="button"
                    className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-sky-400/70 focus-visible:outline-none"
                  >
                    <UserRound className="h-3.5 w-3.5 shrink-0 text-white/70" />
                    Profile
                  </button>
                  <button
                    type="button"
                    className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-sky-400/70 focus-visible:outline-none"
                  >
                    <Settings className="h-3.5 w-3.5 shrink-0 text-white/70" />
                    Settings
                  </button>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/10 hover:text-white focus-visible:ring-2 focus-visible:ring-rose-500/60 focus-visible:outline-none"
                  >
                    <LogOut className="h-3.5 w-3.5 shrink-0" />
                    Sign out
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 pt-12 pb-16 lg:pt-16">
        <section className="space-y-5">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="container space-y-3">
                <div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-white/60 uppercase">
                    Your product
                  </p>
                  <h2 className="text-2xl font-semibold text-white">
                    {selectedProduct.name}
                  </h2>
                </div>
                <div className="flex w-fit items-center gap-2 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  {selectedProduct.status}
                </div>
              </div>
            </div>
            <div className="relative hidden min-h-65 max-md:block">
              <div className="relative h-full">
                {productImages.map((imageSrc, index) => (
                  <img
                    key={`${selectedProduct.id}-${index}`}
                    src={imageSrc}
                    alt={`${selectedProduct.name} view ${index + 1}`}
                    className={`absolute inset-0 transition duration-300 ease-out ${
                      index === activeMediaIndex ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}
              </div>

              {hasMultipleImages ? (
                <>
                  <div className="pointer-events-none absolute inset-y-0 right-0 left-0 container flex items-center justify-between px-3 sm:px-4">
                    <button
                      type="button"
                      onClick={showPreviousImage}
                      aria-label="Show previous image"
                      className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-950/60 text-white shadow-lg transition hover:border-white/30 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-sky-400/70 focus-visible:outline-none"
                    >
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={showNextImage}
                      aria-label="Show next image"
                      className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-950/60 text-white shadow-lg transition hover:border-white/30 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-sky-400/70 focus-visible:outline-none"
                    >
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="pointer-events-none absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-2">
                    {productImages.map((_, index) => (
                      <button
                        key={`${selectedProduct.id}-dot-${index}`}
                        type="button"
                        aria-label={`Show image ${index + 1} of ${productImages.length}`}
                        onClick={() => setActiveMediaIndex(index)}
                        className={`pointer-events-auto h-2.5 w-2.5 rounded-full border transition ${
                          index === activeMediaIndex
                            ? "border-white/70 bg-white"
                            : "border-white/30 bg-white/20 hover:border-white/60"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="absolute right-4 bottom-9 rounded-full bg-slate-950/60 px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur">
                    {activeMediaIndex + 1} / {productImages.length}
                  </div>
                </>
              ) : null}
            </div>
          </div>
          <div className="container grid grid-cols-1 gap-6">
            <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
              <div className="grid lg:grid-cols-2">
                <div className="relative min-h-80 overflow-hidden max-md:hidden">
                  <div className="relative h-full">
                    {productImages.map((imageSrc, index) => (
                      <img
                        key={`${selectedProduct.id}-${index}`}
                        src={imageSrc}
                        alt={`${selectedProduct.name} view ${index + 1}`}
                        className={`absolute inset-0 transition duration-700 ease-out ${
                          index === activeMediaIndex
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />
                    ))}
                  </div>

                  {hasMultipleImages ? (
                    <>
                      <div className="pointer-events-none absolute inset-y-0 right-0 left-0 flex items-center justify-between px-3 sm:px-4">
                        <button
                          type="button"
                          onClick={showPreviousImage}
                          aria-label="Show previous image"
                          className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-950/60 text-white shadow-lg transition hover:border-white/30 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-sky-400/70 focus-visible:outline-none"
                        >
                          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={showNextImage}
                          aria-label="Show next image"
                          className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-950/60 text-white shadow-lg transition hover:border-white/30 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-sky-400/70 focus-visible:outline-none"
                        >
                          <ChevronRight
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </button>
                      </div>

                      <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                        {productImages.map((_, index) => (
                          <button
                            key={`${selectedProduct.id}-dot-${index}`}
                            type="button"
                            aria-label={`Show image ${index + 1} of ${productImages.length}`}
                            onClick={() => setActiveMediaIndex(index)}
                            className={`pointer-events-auto h-2.5 w-2.5 rounded-full border transition ${
                              index === activeMediaIndex
                                ? "border-white/70 bg-white"
                                : "border-white/30 bg-white/20 hover:border-white/60"
                            }`}
                          />
                        ))}
                      </div>

                      <div className="absolute right-4 bottom-4 rounded-full bg-slate-950/60 px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur">
                        {activeMediaIndex + 1} / {productImages.length}
                      </div>
                    </>
                  ) : null}
                </div>
                <div className="flex flex-col justify-between gap-6 p-5">
                  <div className="space-y-3">
                    <p className="text-sm font-semibold tracking-[0.18em] text-white/60 uppercase">
                      Serial {selectedProduct.serial}
                    </p>
                    <h3 className="text-2xl font-semibold text-white">
                      {selectedProduct.name}
                    </h3>
                    <p className="text-sm text-white/65">
                      {selectedProduct.summary}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
                        Mission-ready
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
                        Airworthiness verified
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                      <p className="text-xs tracking-[0.18em] text-white/50 uppercase">
                        Ownership
                      </p>
                      <p className="mt-1 text-lg font-semibold text-white">
                        Active / Owned
                      </p>
                      <p className="text-xs text-white/60">
                        Cleared for operational deployment under your program.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                      <p className="text-xs tracking-[0.18em] text-white/50 uppercase">
                        Documentation
                      </p>
                      <p className="mt-1 text-lg font-semibold text-white">
                        Confidential bundle
                      </p>
                      <p className="text-xs text-white/60">
                        Technical orders, wiring, and maintenance notes secured
                        to this session.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
            <div
              id="tech-specs"
              className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] lg:p-7"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-white/60 uppercase">
                    Specifications & Technical Details
                  </p>
                  <h3 className="text-xl font-semibold text-white">
                    Engineering sheet
                  </h3>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-sky-100">
                  <FileText className="h-5 w-5" aria-hidden="true" />
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm max-md:text-xs">
                  <span className="text-white/70">Serial number</span>
                  <span className="font-semibold text-white">
                    {selectedProduct.serial}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm max-md:text-xs">
                  <span className="text-white/70">Status</span>
                  <span className="font-semibold text-emerald-200">
                    {selectedProduct.status}
                  </span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4">
                {specGroups.map((group) => (
                  <div
                    key={group.title}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm max-md:text-xs"
                  >
                    <div className="flex items-center gap-3 text-sm">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-sky-100">
                        <group.icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <p className="font-semibold text-white">{group.title}</p>
                    </div>
                    <ul className="mt-3 space-y-2 text-white/70">
                      {group.items.map((item) => (
                        <li
                          key={item.label}
                          className="flex items-start justify-between gap-3 rounded-lg bg-slate-900/60 px-3 py-2"
                        >
                          <span>{item.label}</span>
                          <span className="text-right font-semibold wrap-break-word text-white max-md:max-w-25">
                            {item.value}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="container mt-12 space-y-5">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-white/60 uppercase">
                Available upgrades
              </p>
              <h2 className="text-2xl font-semibold text-white">
                Modules built for contested environments
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {upgrades.map((upgrade) => (
              <article
                key={upgrade.title}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.32)] transition"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={upgrade.image}
                    alt={upgrade.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold text-white">
                      {upgrade.title}
                    </h3>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold tracking-wide text-nowrap text-white/60 uppercase">
                      Add-on
                    </span>
                  </div>
                  <p className="text-sm text-white/65">{upgrade.description}</p>
                  <button
                    type="button"
                    className="mt-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-sky-300/60 hover:bg-sky-400/15 focus-visible:ring-2 focus-visible:ring-sky-400/70 focus-visible:outline-none"
                  >
                    {upgrade.action}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="container mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] lg:p-8">
            <p className="text-xs font-semibold tracking-[0.28em] text-white/50 uppercase">
              Overview
            </p>
            <h1 className="mt-3 text-3xl leading-tight font-semibold text-white md:text-4xl">
              Centralized product overview & documentation hub.
            </h1>
            <p className="mt-3 text-base text-white/65">
              Browse your full lineup, compare key specs, and access manuals,
              service notes, and integration materials in one place.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold tracking-[0.18em] text-white/50 uppercase">
                  Products
                </p>
                <div className="mt-2 flex items-center gap-2 text-2xl font-bold text-white">
                  {products.length}
                  <span className="text-2xl font-semibold text-emerald-300">
                    Active
                  </span>
                </div>
                <p className="text-sm text-white/60">
                  Ready to deploy. More assets appear instantly when acquired.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold tracking-[0.18em] text-white/50 uppercase">
                  Clearance
                </p>
                <div className="mt-2 flex items-center gap-2 text-2xl font-bold text-white">
                  Verified
                </div>
                <p className="text-sm text-white/60">
                  Session encrypted, device fingerprint recorded.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold tracking-[0.18em] text-white/50 uppercase">
                  Documents
                </p>
                <div className="mt-2 flex items-center gap-2 text-2xl font-bold text-white">
                  Controlled
                </div>
                <p className="text-sm text-white/60">
                  Specs, export notes, and field manuals stay inside this
                  session.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl border border-white/10 bg-linear-to-br from-white/10 via-white/5 to-slate-900/60 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-white/60 uppercase">
                    Access Summary
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-white">
                    Secure session ready
                  </h3>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-200">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300" />
                  Authenticated access enabled after sign-in.
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300" />
                  All activity is logged; distribution is prohibited.
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300" />
                  Contact support for mission approvals or export controls.
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
              <p className="text-xs font-semibold tracking-[0.18em] text-white/70 uppercase">
                Product lineup
              </p>
              <div className="mt-3 grid grid-cols-1 gap-3">
                {products.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => setSelectedProductId(product.id)}
                    aria-pressed={selectedProduct?.id === product.id}
                    className={`flex flex-col justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition focus-visible:ring-2 focus-visible:ring-sky-400/70 focus-visible:outline-none md:flex-row md:items-center ${
                      selectedProduct?.id === product.id
                        ? "border-sky-400/60 bg-sky-400/15"
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-400/15 text-sky-100">
                        <Package2 className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div className="leading-tight">
                        <p className="text-sm font-semibold text-white">
                          {product.name}
                        </p>
                        <p className="text-xs text-white/60">
                          {product.serial}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-nowrap text-emerald-200">
                      {product.status}
                    </span>
                  </button>
                ))}
                <p className="text-xs text-white/50">
                  Future purchases will appear here automatically—select a unit
                  to view specs and documentation.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="container mt-12">
          <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-slate-900/80 p-5 text-sm text-white/70 shadow-[0_20px_50px_rgba(0,0,0,0.35)] md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col items-start gap-3 md:flex-row">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-sky-100">
                <Lock className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="space-y-1">
                <p className="text-xs font-semibold tracking-[0.18em] text-white/60 uppercase">
                  Security & Confidentiality Notice
                </p>
                <p className="text-sm text-white">
                  This information is confidential and available only to
                  authorized users. Unauthorized distribution is strictly
                  prohibited.
                </p>
              </div>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-center text-[11px] font-semibold tracking-[0.14em] text-nowrap text-white/70 uppercase">
              Session monitored
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}
