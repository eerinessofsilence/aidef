"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ChevronDown,
  LogOut,
  Menu,
  Settings,
  UserRound,
  X,
  LayoutDashboard,
} from "lucide-react";
import { ContactForm } from "./ui/contact-form";
import { CONTACT_MODAL_EVENT } from "../lib/contact-modal";
import {
  buildLocalizedPath,
  replaceLanguageInPath,
  resolveLanguage,
  type SupportedLanguage,
} from "../src/i18n";

type NavKey =
  | "home"
  | "solutions"
  | "products"
  | "technology"
  | "company"
  | "support"
  | "contact";
type MenuKey = "products" | "company";

const NAV_LINKS: Array<{
  key: NavKey;
  href: string;
  hasDropdown?: boolean;
  isContact?: boolean;
}> = [
  { key: "home", href: "/" },
  { key: "solutions", href: "/solutions" },
  { key: "products", href: "#", hasDropdown: true },
  { key: "technology", href: "/technology" },
  { key: "company", href: "#", hasDropdown: true },
  { key: "support", href: "/support" },
  { key: "contact", href: "#", isContact: true },
];

const LANGUAGES: Array<{
  id: number;
  code: SupportedLanguage;
  labelKey: string;
  img: string;
}> = [
  {
    id: 1,
    code: "en",
    labelKey: "English",
    img: "/en.svg",
  },
  {
    id: 2,
    code: "de",
    labelKey: "German",
    img: "/de.svg",
  },
  {
    id: 3,
    code: "sk",
    labelKey: "Slovak",
    img: "/sk.svg",
  },
];

type CompanyMenuItem = {
  titleKey: string;
  href: string;
  icon?: string;
};

type ProductImagePreview = {
  url: string | null;
  alt?: string | null;
};

type ProductListApiItem = {
  id: number;
  slug: string;
  name: string;
  order?: number | null;
  icon?: ProductImagePreview | null;
  first_image?: ProductImagePreview | null;
};

type ProductMenuItem = {
  id: number;
  name: string;
  href: string;
  icon: string;
  iconAlt: string;
  order?: number | null;
};

const COMPANY_MENU_ITEMS: CompanyMenuItem[] = [
  {
    titleKey: "header.menus.company.about",
    href: "/about-us",
    icon: "/company-1.svg",
  },
  {
    titleKey: "header.menus.company.careers",
    href: "#",
    icon: "/company-2.svg",
  },
];

export default function Header() {
  const { t } = useTranslation();
  const [productMenuItems, setProductMenuItems] = useState<ProductMenuItem[]>(
    [],
  );
  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);
  const [languageSelectorIsOpen, setLanguageSelectorOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<MenuKey | null>(null); // used for desktop hover
  const [dropdownTimeout, setDropdownTimeout] = useState<number | null>(null);
  const [languageDropdownTimeout, setLanguageDropdownTimeout] = useState<
    number | null
  >(null);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>(
    {},
  );
  const [isAuthed, setIsAuthed] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [mobileAccountMenuOpen, setMobileAccountMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    email: string | null;
    name: string | null;
  }>({ email: null, name: null });
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileToggleRef = useRef<HTMLButtonElement | null>(null);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileAccountMenuRef = useRef<HTMLDivElement | null>(null);
  const originalBodyOverflow = useRef<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { lng } = useParams();
  const currentLanguage = resolveLanguage(lng);
  const withLanguage = (path: string) =>
    buildLocalizedPath(currentLanguage, path);
  const dropdownTransitionClasses =
    "transition-all duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)]";
  const getDropdownVisibilityClasses = (isOpen: boolean) =>
    isOpen
      ? "pointer-events-auto opacity-100 -translate-y-3"
      : "pointer-events-none opacity-0 -translate-y-5";

  const mobileMenuId = "mobile-menu";
  const clientPortalHref = withLanguage(isAuthed ? "/client-portal" : "/auth");
  const displayName =
    userProfile.name || userProfile.email || t("header.account.operator");
  const API_BASE = useMemo(() => {
    const raw =
      import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "";
    const trimmed = raw.replace(/\/+$/, "");
    if (!trimmed) return "/api";
    return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
  }, []);

  const openContactModal = useCallback(
    (closeMobile = false) => {
      if (closeMobile) {
        setMobileMenuIsOpen(false);
      }
      setActiveDropdown(null);
      setContactModalOpen(true);
    },
    [setMobileMenuIsOpen, setActiveDropdown, setContactModalOpen],
  );

  const closeContactModal = () => setContactModalOpen(false);

  const handleMouseEnter = (name: MenuKey) => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
    }
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    const timeout = window.setTimeout(() => {
      setActiveDropdown(null);
    }, 300);
    setDropdownTimeout(timeout);
  };

  const handleDropdownEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
    }
  };

  const handleLanguageMouseEnter = () => {
    if (languageDropdownTimeout) {
      clearTimeout(languageDropdownTimeout);
    }
    setLanguageSelectorOpen(true);
  };

  const handleLanguageMouseLeave = () => {
    const timeout = window.setTimeout(() => {
      setLanguageSelectorOpen(false);
    }, 300);
    setLanguageDropdownTimeout(timeout);
  };

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get<ProductListApiItem[]>(`${API_BASE}/items/`, {
        signal: controller.signal,
        params: { lang: currentLanguage },
      })
      .then((res) => {
        const items = [...res.data]
          .filter((product) => Boolean(product.slug))
          .sort(
            (a, b) =>
              (a.order ?? Number.MAX_SAFE_INTEGER) -
                (b.order ?? Number.MAX_SAFE_INTEGER) || a.id - b.id,
          )
          .map((product) => ({
            id: product.id,
            name: product.name,
            href: `/products/${product.slug}`,
            icon:
              product.icon?.url ??
              product.first_image?.url ??
              "/placeholder.svg",
            iconAlt:
              product.icon?.alt?.trim() ||
              product.first_image?.alt?.trim() ||
              product.name,
            order: product.order,
          }));
        setProductMenuItems(items);
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          return;
        }
        console.error("Unable to load header products", error);
        setProductMenuItems([]);
      });

    return () => controller.abort();
  }, [API_BASE, currentLanguage]);

  const handleMobileMenuToggle = () =>
    setMobileMenuIsOpen((prevState) => !prevState);
  const handleMobileMenuLinkClick = () => setMobileMenuIsOpen(false);
  const handleLanguageChange = (
    nextLanguage: SupportedLanguage,
    options?: { closeDropdown?: boolean; closeMobile?: boolean },
  ) => {
    if (nextLanguage === currentLanguage) {
      if (options?.closeDropdown) {
        setLanguageSelectorOpen(false);
      }
      if (options?.closeMobile) {
        handleMobileMenuLinkClick();
      }
      return;
    }

    const targetPath = replaceLanguageInPath(location.pathname, nextLanguage);
    navigate({
      pathname: targetPath,
      search: location.search,
      hash: location.hash,
    });
    if (options?.closeDropdown) {
      setLanguageSelectorOpen(false);
    }
    if (options?.closeMobile) {
      handleMobileMenuLinkClick();
    }
  };

  // toggle mobile dropdown expansion (click-to-open under the link)
  const toggleMobileDropdown = (name: string) => {
    setMobileExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const syncUserProfile = useCallback(() => {
    if (typeof window === "undefined") return;

    const rawUser =
      localStorage.getItem("authUser") || sessionStorage.getItem("authUser");
    if (!rawUser) {
      setUserProfile({ email: null, name: null });
      return;
    }

    try {
      const parsed = JSON.parse(rawUser) as {
        email?: string;
        first_name?: string;
        last_name?: string;
      };
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
  }, []);

  const handleSignOut = useCallback(async () => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    try {
      await fetch(`${API_BASE}/auth/logout/`, {
        method: "POST",
        headers: token ? { Authorization: `Token ${token}` } : undefined,
        credentials: "include",
      });
    } catch (error) {
      console.error(error);
    }

    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    sessionStorage.removeItem("authUser");
    window.dispatchEvent(new Event("auth-updated"));
    setAccountMenuOpen(false);
    setMobileAccountMenuOpen(false);
    setIsAuthed(false);
    navigate(buildLocalizedPath(currentLanguage, "/"), { replace: true });
  }, [API_BASE, currentLanguage, navigate]);

  useEffect(() => {
    if (!mobileMenuIsOpen) return;

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        mobileToggleRef.current &&
        !mobileToggleRef.current.contains(target)
      ) {
        setMobileMenuIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [mobileMenuIsOpen]);

  useEffect(() => {
    if (!accountMenuOpen) return;

    const handleClickAway = (event: MouseEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickAway);
    return () => document.removeEventListener("mousedown", handleClickAway);
  }, [accountMenuOpen]);

  useEffect(() => {
    if (!mobileAccountMenuOpen) return;

    const handleClickAway = (event: MouseEvent) => {
      if (!mobileAccountMenuRef.current?.contains(event.target as Node)) {
        setMobileAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickAway);
    return () => document.removeEventListener("mousedown", handleClickAway);
  }, [mobileAccountMenuOpen]);

  useEffect(() => {
    if (!mobileMenuIsOpen) {
      setMobileAccountMenuOpen(false);
    }
  }, [mobileMenuIsOpen]);

  useEffect(() => {
    const handleOpenContact = () => openContactModal();
    window.addEventListener(CONTACT_MODAL_EVENT, handleOpenContact);

    return () =>
      window.removeEventListener(CONTACT_MODAL_EVENT, handleOpenContact);
  }, [openContactModal]);

  useEffect(() => {
    const computeAuth = () =>
      Boolean(
        typeof window !== "undefined" &&
          (localStorage.getItem("authToken") ||
            sessionStorage.getItem("authToken")),
      );
    const handleAuthChange = () => {
      setIsAuthed(computeAuth());
      syncUserProfile();
      setAccountMenuOpen(false);
      setMobileAccountMenuOpen(false);
    };

    handleAuthChange();
    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("auth-updated", handleAuthChange);
    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("auth-updated", handleAuthChange);
    };
  }, [syncUserProfile]);

  useEffect(() => {
    if (!contactModalOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setContactModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [contactModalOpen]);

  useEffect(() => {
    const shouldLockScroll = mobileMenuIsOpen || contactModalOpen;

    if (shouldLockScroll) {
      if (originalBodyOverflow.current === null) {
        originalBodyOverflow.current = document.body.style.overflow;
      }
      document.body.style.overflow = "hidden";
    } else if (originalBodyOverflow.current !== null) {
      document.body.style.overflow = originalBodyOverflow.current;
      originalBodyOverflow.current = null;
    }

    return () => {
      if (originalBodyOverflow.current !== null) {
        document.body.style.overflow = originalBodyOverflow.current;
        originalBodyOverflow.current = null;
      }
    };
  }, [mobileMenuIsOpen, contactModalOpen]);

  return (
    <>
      <div className="fixed left-1/2 z-50 container -translate-x-1/2 py-5">
        <header className="border-border/50 rounded-[20px] border bg-linear-to-b from-black/50 via-black/40 to-black/30 p-6 px-4 shadow-[inset_0_2px_8px_rgba(255,255,255,0.25)] backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <Link
              to={withLanguage("/")}
              className="flex items-center space-x-2"
            >
              <img src="/logo-ai-def.svg" className="w-40 max-md:w-35" alt="" />
            </Link>

            <div className="flex items-center gap-4 max-xl:hidden">
              {NAV_LINKS.map((link) => {
                const label = t(`header.nav.${link.key}`);
                return (
                  <div
                    key={link.key}
                    className="relative"
                    onMouseEnter={() =>
                      link.hasDropdown
                        ? handleMouseEnter(link.key as MenuKey)
                        : setActiveDropdown(null)
                    }
                    onMouseLeave={handleMouseLeave}
                  >
                    {link.hasDropdown ? (
                      <button className="group text-foreground hover:text-foreground/70 flex cursor-pointer items-center gap-1 text-[17px] font-medium transition-colors">
                        {label}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-300 ${
                            activeDropdown === link.key ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    ) : link.isContact ? (
                      <button
                        type="button"
                        onClick={() => openContactModal()}
                        className="text-foreground hover:text-foreground/70 cursor-pointer text-[17px] font-medium transition-colors"
                      >
                        {label}
                      </button>
                    ) : (
                      <Link
                        to={withLanguage(link.href)}
                        className="text-foreground hover:text-foreground/70 cursor-pointer text-[17px] font-medium transition-colors"
                      >
                        {label}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-2 max-lg:gap-3">
              <div
                onMouseEnter={handleLanguageMouseEnter}
                onMouseLeave={handleLanguageMouseLeave}
                className="border-border/25 active:translate-y-2px flex h-10 w-10 cursor-pointer items-center justify-center rounded-[10px] border bg-linear-to-br from-black/20 via-black/10 to-black/0 backdrop-blur-lg transition-all duration-300 will-change-transform hover:shadow-[inset_0_2px_6px_rgba(255,255,255,0.25)] active:scale-[0.93] max-xl:hidden"
              >
                <img src="/language-icon.svg" className="h-4.5 w-4.5" alt="" />
              </div>
              {isAuthed ? (
                <div ref={accountMenuRef} className="relative max-xl:hidden">
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={accountMenuOpen}
                    onClick={() => setAccountMenuOpen((prev) => !prev)}
                    className="border-border/25 flex w-38 cursor-pointer items-center justify-between gap-1 rounded-xl border bg-black/2 p-2 backdrop-blur-xl transition-all duration-300 hover:shadow-[inset_0_2px_8px_rgba(255,255,255,0.35)]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                        <UserRound className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <p className="max-w-16.5 min-w-0 truncate text-sm font-semibold tracking-tight">
                        {displayName}
                      </p>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 transition duration-300 ${
                        accountMenuOpen
                          ? "rotate-180 text-white"
                          : "text-white/70"
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {accountMenuOpen ? (
                    <div className="border-border/25 absolute top-[calc(100%+0.6rem)] right-0 z-20 w-38 space-y-1 rounded-2xl border bg-black p-2.5 backdrop-blur-xl">
                      <div className="pt-2.5 text-xs font-semibold tracking-widest text-white/70 uppercase">
                        {t("header.account.title")}
                      </div>
                      <Link
                        to={withLanguage("/client-portal")}
                        className="hover:border-border/50 flex w-full cursor-pointer items-center gap-2 rounded-xl border border-transparent p-2.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[inset_0_2px_8px_rgba(255,255,255,0.25)]"
                      >
                        <LayoutDashboard className="h-3.5 w-3.5 shrink-0 text-white/70" />
                        {t("header.actions.clientPortal")}
                      </Link>
                      <button
                        type="button"
                        className="hover:border-border/50 flex w-full cursor-pointer items-center gap-2 rounded-xl border border-transparent p-2.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[inset_0_2px_8px_rgba(255,255,255,0.25)]"
                      >
                        <UserRound className="h-3.5 w-3.5 shrink-0 text-white/70" />
                        {t("header.account.profile")}
                      </button>
                      <button
                        type="button"
                        className="hover:border-border/50 flex w-full cursor-pointer items-center gap-2 rounded-xl border border-transparent p-2.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[inset_0_2px_8px_rgba(255,255,255,0.25)]"
                      >
                        <Settings className="h-3.5 w-3.5 shrink-0 text-white/70" />
                        {t("header.account.settings")}
                      </button>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="hover:border-border/50 flex w-full cursor-pointer items-center gap-2 rounded-xl border border-transparent p-2.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[inset_0_2px_8px_rgba(255,255,255,0.25)]"
                      >
                        <LogOut className="h-3.5 w-3.5 shrink-0 text-white/70" />
                        {t("header.account.signOut")}
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : (
                <Link
                  to={clientPortalHref}
                  className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-xl bg-white px-2 text-sm font-bold text-black uppercase transition-all duration-300 ease-out will-change-transform hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.35),inset_0_-6px_20px_rgba(0,0,0,0.45)] focus-visible:ring-2 focus-visible:ring-[#0A84FF] focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.93] active:shadow-[inset_0_1px_6px_rgba(255,255,255,0.5),inset_0_-8px_22px_rgba(0,0,0,0.65)] max-xl:hidden"
                >
                  {t("header.actions.clientPortal")}
                </Link>
              )}

              <button
                type="button"
                onClick={handleMobileMenuToggle}
                aria-expanded={mobileMenuIsOpen}
                aria-controls={mobileMenuId}
                ref={mobileToggleRef}
                className="border-border/25 active:translate-y-2px flex h-10 w-10 items-center justify-center rounded-[10px] border bg-linear-to-br from-black/20 via-black/10 to-black/0 backdrop-blur-lg transition-all duration-300 will-change-transform hover:shadow-[inset_0_2px_6px_rgba(255,255,255,0.25)] active:scale-[0.93] xl:hidden"
              >
                {mobileMenuIsOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </header>
        <div
          onMouseEnter={handleDropdownEnter}
          onMouseLeave={handleMouseLeave}
          aria-hidden={activeDropdown !== "products"}
          className={`absolute top-full left-1/4 max-h-[464px] max-w-152.5 -translate-x-1/4 overflow-y-auto overscroll-contain rounded-[20px] bg-[#ececec] shadow-sm shadow-black/25 ${dropdownTransitionClasses} ${getDropdownVisibilityClasses(activeDropdown === "products")}`}
        >
          <div className="grid grid-cols-3 gap-5 p-5">
            {productMenuItems.map((item) => (
              <Link
                key={item.id}
                to={withLanguage(item.href)}
                className="group flex h-[202px] w-[170px] flex-col items-center rounded-xl bg-white text-center transition-all duration-300 hover:scale-107 hover:shadow-sm hover:shadow-black/25"
                onClick={() => setActiveDropdown(null)}
              >
                <img
                  src={item.icon}
                  className="max-h-30 w-full rounded-t-xl object-cover"
                  alt={item.iconAlt}
                />
                <div className="flex h-full items-center">
                  <h3 className="text-sm font-semibold text-black">
                    {item.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div
          onMouseEnter={handleDropdownEnter}
          onMouseLeave={handleMouseLeave}
          aria-hidden={activeDropdown !== "company"}
          className={`absolute top-full right-0 left-1/3 max-w-[600px] rounded-[20px] bg-[#ececec] shadow-sm shadow-black ${dropdownTransitionClasses} ${getDropdownVisibilityClasses(activeDropdown === "company")}`}
        >
          <div className="grid grid-cols-2 gap-x-10 gap-y-5 p-4.5">
            {COMPANY_MENU_ITEMS.map((item) => (
              <Link
                key={item.titleKey}
                to={withLanguage(item.href)}
                className="group flex items-center gap-5 rounded-xl p-3 transition-colors duration-300 hover:bg-[#c4c4c4]/35"
              >
                <div className="flex h-15 w-15 items-center justify-center rounded-2xl bg-transparent shadow-md shadow-black/25 backdrop-blur-lg">
                  <img src={item.icon} className="h-8.5 w-8.5" alt="" />
                </div>
                <h3 className="text-lg font-semibold text-black">
                  {t(item.titleKey)}
                </h3>
              </Link>
            ))}
          </div>
        </div>

        <div
          onMouseEnter={handleLanguageMouseEnter}
          onMouseLeave={handleLanguageMouseLeave}
          aria-hidden={!languageSelectorIsOpen}
          className={`absolute top-full left-1/2 w-fit -translate-x-1/17 rounded-[20px] bg-[#f5f5f5] shadow-sm shadow-black/25 ${dropdownTransitionClasses} ${getDropdownVisibilityClasses(languageSelectorIsOpen)}`}
        >
          <div className="grid grid-cols-3 gap-8 p-4.5 px-6">
            {LANGUAGES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  handleLanguageChange(item.code, { closeDropdown: true })
                }
                className="group flex cursor-pointer items-center gap-5 rounded-xl p-3 text-center transition-colors duration-300 hover:bg-[#c4c4c4]/35"
              >
                <div className="flex h-15 w-15 items-center justify-center rounded-2xl bg-transparent shadow-md shadow-black/25 backdrop-blur-lg">
                  <img src={item.img} className="h-7 w-7" alt="" />
                </div>
                <div className="flex items-center">
                  <h3 className="text-sm font-semibold text-black">
                    {t(item.labelKey)}
                  </h3>
                </div>
              </button>
            ))}
          </div>
        </div>
        {/* Mobile menu */}
        <div className="relative xl:hidden">
          <div
            id={mobileMenuId}
            aria-hidden={!mobileMenuIsOpen}
            ref={mobileMenuRef}
            className={`border-border/25 absolute right-0 z-40 mt-3 flex max-h-[calc(100vh-140px)] min-h-0 w-full origin-top-right flex-col gap-5 rounded-[20px] bg-linear-to-b from-black/30 via-black/20 to-black/10 p-5 shadow-[inset_0_2px_12px_rgba(255,255,255,0.35)] backdrop-blur-lg transition-all duration-500 ease-out ${
              mobileMenuIsOpen
                ? "pointer-events-auto translate-y-0 scale-100 border-r border-b border-l opacity-100"
                : "pointer-events-none -translate-y-3 scale-95 border opacity-0"
            }`}
          >
            <nav className="text-foreground flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto overscroll-contain text-lg font-medium">
              {NAV_LINKS.map((link) => {
                const label = t(`header.nav.${link.key}`);
                if (link.hasDropdown && link.key === "products") {
                  const expanded = !!mobileExpanded[link.key];
                  return (
                    <div key={link.key} className="relative">
                      <button
                        onClick={() => toggleMobileDropdown(link.key)}
                        className="text-foreground hover:text-foreground/70 flex w-full cursor-pointer items-center justify-between text-lg font-medium transition-colors"
                        aria-expanded={expanded}
                        aria-controls={`mobile-submenu-${link.key}`}
                      >
                        <span>{label}</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            expanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <div
                        id={`mobile-submenu-${link.key}`}
                        className={`flex flex-col gap-5 pt-5 pl-4 transition-all ${
                          expanded
                            ? "mt-2 max-h-[1000px] opacity-100"
                            : "max-h-0 opacity-0"
                        } overflow-hidden`}
                      >
                        {productMenuItems.map((product) => (
                          <Link
                            key={product.id}
                            to={withLanguage(product.href)}
                            onClick={handleMobileMenuLinkClick}
                            className="text-foreground/70 hover:text-foreground/50 flex items-center gap-4 pl-2 text-base transition-all duration-300"
                          >
                            <img
                              src={product.icon}
                              className="h-6 w-6 rounded-sm object-cover"
                              alt={product.iconAlt}
                            />
                            {product.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                if (link.hasDropdown && link.key === "company") {
                  const expanded = !!mobileExpanded[link.key];
                  return (
                    <div key={link.key} className="relative">
                      <button
                        onClick={() => toggleMobileDropdown(link.key)}
                        className="text-foreground hover:text-foreground/70 flex w-full cursor-pointer items-center justify-between text-lg font-medium transition-colors"
                        aria-expanded={expanded}
                        aria-controls={`mobile-submenu-${link.key}`}
                      >
                        <span>{label}</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            expanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <div
                        id={`mobile-submenu-${link.key}`}
                        className={`flex flex-col gap-5 pt-5 pl-4 transition-all ${
                          expanded
                            ? "mt-2 max-h-[1000px] opacity-100"
                            : "max-h-0 opacity-0"
                        } overflow-hidden`}
                      >
                        {COMPANY_MENU_ITEMS.map((item, subIdx) => (
                          <Link
                            key={item.titleKey}
                            to={withLanguage(item.href)}
                            onClick={handleMobileMenuLinkClick}
                            className="text-foreground/70 hover:text-foreground/50 flex items-center gap-4 pl-2 text-base transition-all duration-300"
                          >
                            <img
                              src={`/company-white-${subIdx + 1}.svg`}
                              className="h-6 w-6"
                              alt=""
                            />
                            {t(item.titleKey)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={link.key} className="relative">
                    {link.isContact ? (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          openContactModal(true);
                        }}
                        className="text-foreground hover:text-foreground/70 block w-full cursor-pointer text-left text-lg font-medium transition-colors"
                      >
                        {label}
                      </button>
                    ) : (
                      <Link
                        to={withLanguage(link.href)}
                        onClick={handleMobileMenuLinkClick}
                        className="text-foreground hover:text-foreground/70 block cursor-pointer text-lg font-medium transition-colors"
                      >
                        {label}
                      </Link>
                    )}
                  </div>
                );
              })}

              <div className="relative">
                <button
                  onClick={() => toggleMobileDropdown("languages")}
                  className="text-foreground hover:text-foreground/70 flex w-full cursor-pointer items-center justify-between text-lg font-medium transition-colors"
                  aria-expanded={!!mobileExpanded.languages}
                  aria-controls="mobile-submenu-languages"
                >
                  <span>{t("header.languages.label")}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      mobileExpanded.languages ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  id="mobile-submenu-languages"
                  className={`mt-2 flex flex-col gap-2 pl-4 transition-all ${
                    mobileExpanded.languages
                      ? "max-h-[1000px] opacity-100"
                      : "max-h-0 opacity-0"
                  } overflow-hidden`}
                >
                  {LANGUAGES.map((language) => (
                    <button
                      key={language.id}
                      type="button"
                      onClick={() =>
                        handleLanguageChange(language.code, {
                          closeMobile: true,
                        })
                      }
                      className="text-foreground/80 hover:text-foreground/50 flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-base transition-all duration-300"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/20 shadow-inner shadow-black/20">
                        <img src={language.img} className="h-6 w-6" alt="" />
                      </div>
                      <span className="font-medium">{language.labelKey}</span>
                    </button>
                  ))}
                </div>
              </div>
            </nav>

            {isAuthed ? (
              <div ref={mobileAccountMenuRef} className="relative">
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={mobileAccountMenuOpen}
                  onClick={() =>
                    setMobileAccountMenuOpen((prevState) => !prevState)
                  }
                  className="border-border/10 flex w-full min-w-0 cursor-pointer items-center gap-2 rounded-xl border bg-black/10 px-4 py-2 shadow-[inset_0_2px_8px_rgba(255,255,255,0.25)] transition-all duration-300 hover:contrast-150"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                    <UserRound className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <p className="max-w-40 min-w-0 truncate text-sm tracking-tight sm:max-w-48">
                    {displayName}
                  </p>
                  <ChevronDown
                    className={`h-4 w-4 transition duration-300 ${
                      mobileAccountMenuOpen
                        ? "rotate-180 text-white"
                        : "text-white/60"
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {mobileAccountMenuOpen ? (
                  <div className="border-border/10 absolute top-[calc(100%+0.6rem)] right-0 z-20 w-full rounded-2xl border bg-black/5 p-1 shadow-[inset_0_2px_8px_rgba(255,255,255,0.25)] backdrop-blur-lg">
                    <div className="px-3 py-2 text-xs font-semibold tracking-widest text-white/70 uppercase">
                      {t("header.account.title")}
                    </div>
                    <Link
                      to={withLanguage("/client-portal")}
                      className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-sky-400/70 focus-visible:outline-none"
                    >
                      <LayoutDashboard className="h-3.5 w-3.5 shrink-0 text-white/70" />
                      {t("header.actions.clientPortal")}
                    </Link>
                    <button
                      type="button"
                      className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-sky-400/70 focus-visible:outline-none"
                    >
                      <UserRound className="h-3.5 w-3.5 shrink-0 text-white/70" />
                      {t("header.account.profile")}
                    </button>
                    <button
                      type="button"
                      className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-sky-400/70 focus-visible:outline-none"
                    >
                      <Settings className="h-3.5 w-3.5 shrink-0 text-white/70" />
                      {t("header.account.settings")}
                    </button>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="text-foreground flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition duration-300 hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-rose-500/60 focus-visible:outline-none"
                    >
                      <LogOut className="h-3.5 w-3.5 shrink-0" />
                      {t("header.account.signOut")}
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <Link
                to={clientPortalHref}
                onClick={handleMobileMenuLinkClick}
                className="group relative inline-flex h-11 w-full items-center justify-center rounded-2xl bg-white text-sm font-bold text-black uppercase transition-all duration-300 ease-out will-change-transform hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.35),inset_0_-6px_20px_rgba(0,0,0,0.45)] active:scale-[0.93] active:shadow-[inset_0_1px_6px_rgba(255,255,255,0.5),inset_0_-8px_22px_rgba(0,0,0,0.65)]"
              >
                {t("header.actions.clientPortal")}
              </Link>
            )}
          </div>
        </div>
      </div>

      {contactModalOpen && (
        <div className="fixed inset-0 z-200 flex items-center justify-center px-4 py-10">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeContactModal}
          />
          <div
            className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl md:p-10 dark:bg-neutral-900"
            aria-modal="true"
            aria-label={t("header.contactModal.ariaLabel")}
          >
            <button
              type="button"
              onClick={closeContactModal}
              className="absolute top-4 right-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black text-white transition hover:bg-black/80 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none dark:bg-white dark:text-black dark:hover:bg-neutral-200"
            >
              <X className="h-5 w-5" />
            </button>
            <ContactForm />
          </div>
        </div>
      )}
    </>
  );
}
