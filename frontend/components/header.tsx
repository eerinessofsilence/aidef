"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { ContactForm } from "./ui/contact-form";
import { CONTACT_MODAL_EVENT } from "../lib/contact-modal";

const NAV_LINKS = [
  { text: "Home", href: "/" },
  { text: "Products", href: "#", hasDropdown: true },
  { text: "Solutions", href: "#", hasDropdown: true },
  { text: "Technology", href: "#", hasDropdown: true },
  { text: "Company", href: "#", hasDropdown: true },
  { text: "Support", href: "/support" },
  { text: "Contact", href: "#" },
];

const LANGUAGES = [
  {
    id: 1,
    title: "English",
    img: "/en.svg",
  },
  {
    id: 2,
    title: "German",
    img: "/de.svg",
  },
  {
    id: 3,
    title: "Slovakia",
    img: "/sv.svg",
  },
  {
    id: 4,
    title: "French",
    img: "/fr.svg",
  },
];

type Item = {
  title: string;
  href: string;
  icon?: string;
  description?: string;
};

type Menus = Record<
  "Products" | "Solutions" | "Technology" | "Company",
  Item[]
>;

const DROPDOWN_MENUS: Menus = {
  Products: [
    {
      title: "AX2NG KRAKATIT",
      href: "/products/ax2ng-krakatit",
      icon: "/products-1.png",
    },
    { title: "AV2 VTOL", href: "/products/av2-vtol", icon: "/products-2.png" },
    {
      title: "AXQ QUADROCOPTER",
      href: "/products/axq-quadrocopter",
      icon: "/products-3.png",
    },
    {
      title: "Ground Control Station",
      href: "/products/ground-control-station",
      icon: "/products-4.png",
    },
    {
      title: "UGV 150-DUP",
      href: "/products/ugv-150-dup",
      icon: "/products-5.png",
    },
  ],
  Solutions: [
    {
      title: "Integration into military vehicles",
      href: "#",
      icon: "/solutions-1.svg",
    },
    {
      title: "Aviation",
      href: "#",
      icon: "/solutions-2.svg",
    },
    {
      title: "Security",
      href: "#",
      icon: "/solutions-3.svg",
    },
    {
      title: "Defense",
      href: "#",
      icon: "/solutions-4.svg",
    },
  ],
  Technology: [
    {
      title: "Propulsion (AD20PRO, jet engine systems)",
      href: "#",
      icon: "/technology-1.svg",
    },
    { title: "Electronics & Avionics", href: "#", icon: "/technology-2.svg" },
    {
      title: "C2, GCS & API integration",
      href: "#",
      icon: "/technology-3.svg",
    },
  ],
  Company: [
    { title: "About Us", href: "#", icon: "/company-1.svg" },
    { title: "Careers", href: "#", icon: "/company-2.svg" },
  ],
};

export default function Header() {
  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);
  const [languageSelectorIsOpen, setLanguageSelectorOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null); // used for desktop hover
  const [dropdownTimeout, setDropdownTimeout] = useState<number | null>(null);
  const [languageDropdownTimeout, setLanguageDropdownTimeout] = useState<
    number | null
  >(null);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>(
    {},
  );
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileToggleRef = useRef<HTMLButtonElement | null>(null);
  const originalBodyOverflow = useRef<string | null>(null);

  const mobileMenuId = "mobile-menu";

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

  const handleMouseEnter = (name: string) => {
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

  const handleMobileMenuToggle = () =>
    setMobileMenuIsOpen((prevState) => !prevState);
  const handleMobileMenuLinkClick = () => setMobileMenuIsOpen(false);

  // toggle mobile dropdown expansion (click-to-open under the link)
  const toggleMobileDropdown = (name: string) => {
    setMobileExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
  };

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
    const handleOpenContact = () => openContactModal();
    window.addEventListener(CONTACT_MODAL_EVENT, handleOpenContact);

    return () =>
      window.removeEventListener(CONTACT_MODAL_EVENT, handleOpenContact);
  }, [openContactModal]);

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
      <div className="fixed left-1/2 z-50 container mx-auto -translate-x-1/2 p-5">
        <header className="border-border/75 rounded-[20px] border bg-linear-to-b from-black/25 via-black/25 to-black/25 px-8 py-6 shadow-sm shadow-black backdrop-blur-lg max-md:px-5 max-md:py-5">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center space-x-2">
              <img
                src="/logo-ai-def.svg"
                className="w-37.5 max-md:w-32.5"
                alt=""
              />
            </a>

            <div className="flex items-center gap-7.5 max-xl:hidden">
              {NAV_LINKS.map((link) => (
                <div
                  key={link.text}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(link.text)}
                  onMouseLeave={handleMouseLeave}
                >
                  {link.hasDropdown ? (
                    <button className="group text-foreground hover:text-foreground/70 flex cursor-pointer items-center gap-1 text-[17px] font-medium transition-colors">
                      {link.text}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-300 ${
                          activeDropdown === link.text ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  ) : link.text === "Contact" ? (
                    <button
                      type="button"
                      onClick={() => openContactModal()}
                      className="text-foreground hover:text-foreground/70 cursor-pointer text-[17px] font-medium transition-colors"
                    >
                      {link.text}
                    </button>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-foreground hover:text-foreground/70 cursor-pointer text-[17px] font-medium transition-colors"
                    >
                      {link.text}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-5 max-lg:gap-3">
              <div
                onMouseEnter={handleLanguageMouseEnter}
                onMouseLeave={handleLanguageMouseLeave}
                className="border-border/50 active:translate-y-2px flex h-9.5 w-9.5 cursor-pointer items-center justify-center rounded-[10px] border bg-linear-to-br from-black/20 via-black/25 to-black/25 backdrop-blur-xl transition-all duration-300 will-change-transform hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.35),inset_0_-6px_20px_rgba(0,0,0,0.45)] active:scale-[0.93] active:shadow-[inset_0_1px_6px_rgba(255,255,255,0.4),inset_0_-6px_18px_rgba(0,0,0,0.7)] max-xl:hidden"
              >
                <img src="/language-icon.svg" className="h-4.5 w-4.5" alt="" />
              </div>
              <Link
                to="#"
                className="group relative inline-flex h-10 w-[139px] items-center justify-center overflow-hidden rounded-xl bg-white text-sm font-bold text-black uppercase transition-all duration-300 ease-out will-change-transform hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.35),inset_0_-6px_20px_rgba(0,0,0,0.45)] focus-visible:ring-2 focus-visible:ring-[#0A84FF] focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.93] active:shadow-[inset_0_1px_6px_rgba(255,255,255,0.5),inset_0_-8px_22px_rgba(0,0,0,0.65)] max-xl:hidden"
              >
                Client Portal
              </Link>

              <button
                type="button"
                onClick={handleMobileMenuToggle}
                aria-expanded={mobileMenuIsOpen}
                aria-controls={mobileMenuId}
                ref={mobileToggleRef}
                className="border-border/50 active:translate-y-2px flex h-10 w-10 items-center justify-center rounded-[10px] border bg-linear-to-br from-black/20 via-black/25 to-black/25 backdrop-blur-xl transition-all duration-300 will-change-transform hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.35),inset_0_-6px_20px_rgba(0,0,0,0.45)] focus-visible:ring-2 focus-visible:ring-[#0A84FF] focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.93] active:shadow-[inset_0_1px_6px_rgba(255,255,255,0.4),inset_0_-6px_18px_rgba(0,0,0,0.7)] xl:hidden"
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
        {Object.entries(DROPDOWN_MENUS).map(([name, items]) => {
          const transitionClasses =
            "transition-all duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)]";
          const isOpen = activeDropdown === name;
          const visibilityClasses = isOpen
            ? "pointer-events-auto opacity-100 -translate-y-3"
            : "pointer-events-none opacity-0 -translate-y-5";
          if (name === "Products") {
            return (
              <div
                key={name}
                onMouseEnter={handleDropdownEnter}
                onMouseLeave={handleMouseLeave}
                aria-hidden={!isOpen}
                className={`absolute top-full left-1/4 max-w-152.5 -translate-x-1/4 rounded-[20px] bg-[#ececec] shadow-sm shadow-black/25 ${transitionClasses} ${visibilityClasses}`}
              >
                <div className="grid grid-cols-3 gap-5 p-5">
                  {items.map((item) => (
                    <Link
                      key={item.title}
                      to={item.href}
                      className="group flex h-[202px] w-[170px] flex-col items-center rounded-xl bg-white text-center transition-all duration-300 hover:scale-107 hover:shadow-sm hover:shadow-black/25"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <img
                        src={item.icon}
                        className="max-h-30 w-full rounded-t-xl"
                      />
                      <div className="flex h-full items-center">
                        <h3 className="text-sm font-semibold text-black">
                          {item.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          }

          if (name === "Solutions") {
            return (
              <div
                key={name}
                onMouseEnter={handleDropdownEnter}
                onMouseLeave={handleMouseLeave}
                aria-hidden={!isOpen}
                className={`absolute top-full right-0 left-1/7 max-w-[930px] rounded-[20px] bg-[#ececec] shadow-sm shadow-black ${transitionClasses} ${visibilityClasses}`}
              >
                <div className="grid grid-cols-2 gap-x-10 gap-y-5 p-7.5">
                  {items.map((item) => (
                    <Link
                      key={item.title}
                      to={item.href}
                      className="group flex items-center gap-5 rounded-xl p-3 transition-colors duration-300 hover:bg-[#c4c4c4]/35"
                    >
                      <div className="flex h-15 w-15 items-center justify-center rounded-2xl bg-transparent shadow-md shadow-black/25 backdrop-blur-lg">
                        <img src={item.icon} className="h-8.5 w-8.5" alt="" />
                      </div>
                      <h3 className="text-lg font-semibold text-black">
                        {item.title}
                      </h3>
                    </Link>
                  ))}
                </div>
              </div>
            );
          }

          if (name === "Technology") {
            return (
              <div
                key={name}
                onMouseEnter={handleDropdownEnter}
                onMouseLeave={handleMouseLeave}
                aria-hidden={!isOpen}
                className={`absolute top-full right-0 left-1/4 max-w-[930px] rounded-[20px] bg-[#ececec] shadow-sm shadow-black ${transitionClasses} ${visibilityClasses}`}
              >
                <div className="grid grid-cols-2 gap-x-10 gap-y-5 p-7.5">
                  {items.map((item) => (
                    <Link
                      key={item.title}
                      to={item.href}
                      className="group flex items-center gap-5 rounded-xl p-3 transition-colors duration-300 hover:bg-[#c4c4c4]/35"
                    >
                      <div className="flex h-15 w-15 items-center justify-center rounded-2xl bg-transparent shadow-md shadow-black/25 backdrop-blur-lg">
                        <img src={item.icon} className="h-8.5 w-8.5" alt="" />
                      </div>
                      <h3 className="text-lg font-semibold text-black">
                        {item.title}
                      </h3>
                    </Link>
                  ))}
                </div>
              </div>
            );
          }

          if (name === "Company") {
            return (
              <div
                key={name}
                onMouseEnter={handleDropdownEnter}
                onMouseLeave={handleMouseLeave}
                aria-hidden={!isOpen}
                className={`absolute top-full right-0 left-1/3 max-w-[930px] rounded-[20px] bg-[#ececec] shadow-sm shadow-black ${transitionClasses} ${visibilityClasses}`}
              >
                <div className="grid grid-cols-2 gap-x-10 gap-y-5 p-4.5">
                  {items.map((item) => (
                    <Link
                      key={item.title}
                      to={item.href}
                      className="group flex items-center gap-5 rounded-xl p-3 transition-colors duration-300 hover:bg-[#c4c4c4]/35"
                    >
                      <div className="flex h-15 w-15 items-center justify-center rounded-2xl bg-transparent shadow-md shadow-black/25 backdrop-blur-lg">
                        <img src={item.icon} className="h-8.5 w-8.5" alt="" />
                      </div>
                      <h3 className="text-lg font-semibold text-black">
                        {item.title}
                      </h3>
                    </Link>
                  ))}
                </div>
              </div>
            );
          }

          return null;
        })}

        <div
          onMouseEnter={handleLanguageMouseEnter}
          onMouseLeave={handleLanguageMouseLeave}
          aria-hidden={!languageSelectorIsOpen}
          className={`absolute top-full left-1/2 w-full max-w-[813px] -translate-x-1/4 rounded-[20px] bg-[#f5f5f5] shadow-sm shadow-black/25 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
            languageSelectorIsOpen
              ? "pointer-events-auto -translate-y-3 opacity-100"
              : "pointer-events-none -translate-y-5 opacity-0"
          }`}
        >
          <div className="grid grid-cols-4 gap-12.5 p-4.5">
            {LANGUAGES.map((item) => (
              <a
                key={item.id}
                className="group flex cursor-pointer items-center gap-5 rounded-xl p-3 text-center transition-colors duration-300 hover:bg-[#c4c4c4]/35"
              >
                <div className="flex h-15 w-15 items-center justify-center rounded-2xl bg-transparent shadow-md shadow-black/25 backdrop-blur-lg">
                  <img src={item.img} className="h-7 w-7" />
                </div>
                <div className="flex items-center">
                  <h3 className="text-sm font-semibold text-black">
                    {item.title}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        </div>
        {/* Mobile menu */}
        <div className="relative xl:hidden">
          <div
            id={mobileMenuId}
            aria-hidden={!mobileMenuIsOpen}
            ref={mobileMenuRef}
            className={`border-border/75 absolute right-0 z-40 mt-3 flex max-h-[calc(100vh-140px)] w-full origin-top-right flex-col gap-5 overflow-y-auto overscroll-contain rounded-[20px] border bg-linear-to-b from-black/20 via-black/20 to-black/20 p-6 shadow-lg shadow-black/25 backdrop-blur-md transition-all duration-500 ease-out ${
              mobileMenuIsOpen
                ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                : "pointer-events-none -translate-y-3 scale-95 opacity-0"
            }`}
          >
            <nav className="text-foreground flex flex-col gap-3 text-lg font-medium">
              {NAV_LINKS.map((link) => {
                if (link.hasDropdown) {
                  const submenu =
                    DROPDOWN_MENUS[link.text as keyof Menus] || [];
                  const expanded = !!mobileExpanded[link.text];
                  return (
                    <div key={link.text} className="relative">
                      <button
                        onClick={() => toggleMobileDropdown(link.text)}
                        className="text-foreground hover:text-foreground/70 flex w-full cursor-pointer items-center justify-between text-lg font-medium transition-colors"
                        aria-expanded={expanded}
                        aria-controls={`mobile-submenu-${link.text}`}
                      >
                        <span>{link.text}</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            expanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* Submenu as plain text links under the parent item */}
                      <div
                        id={`mobile-submenu-${link.text}`}
                        className={`mt-2 flex flex-col gap-2 pl-4 transition-all ${
                          expanded
                            ? "max-h-[1000px] opacity-100"
                            : "max-h-0 opacity-0"
                        } overflow-hidden`}
                      >
                        {submenu.map((s, subIdx) => (
                          <Link
                            key={s.title}
                            to={s.href}
                            onClick={handleMobileMenuLinkClick}
                            className="text-foreground/70 hover:text-foreground/50 flex items-center gap-4 pl-2 text-base transition-all duration-300"
                          >
                            <img
                              src={`/${link.text.toLowerCase()}-white-${subIdx + 1}.svg`}
                              className="h-6 w-6"
                              alt=""
                            />
                            {s.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={link.text} className="relative">
                    {link.text === "Contact" ? (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          openContactModal(true);
                        }}
                        className="text-foreground hover:text-foreground/70 block w-full cursor-pointer text-left text-lg font-medium transition-colors"
                      >
                        {link.text}
                      </button>
                    ) : (
                      <Link
                        to={link.href}
                        onClick={handleMobileMenuLinkClick}
                        className="text-foreground hover:text-foreground/70 block cursor-pointer text-lg font-medium transition-colors"
                      >
                        {link.text}
                      </Link>
                    )}
                  </div>
                );
              })}

              <div className="relative">
                <button
                  onClick={() => toggleMobileDropdown("Languages")}
                  className="text-foreground hover:text-foreground/70 flex w-full cursor-pointer items-center justify-between text-lg font-medium transition-colors"
                  aria-expanded={!!mobileExpanded.Languages}
                  aria-controls="mobile-submenu-languages"
                >
                  <span>Languages</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      mobileExpanded.Languages ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  id="mobile-submenu-languages"
                  className={`mt-2 flex flex-col gap-2 pl-4 transition-all ${
                    mobileExpanded.Languages
                      ? "max-h-[1000px] opacity-100"
                      : "max-h-0 opacity-0"
                  } overflow-hidden`}
                >
                  {LANGUAGES.map((language) => (
                    <button
                      key={language.id}
                      type="button"
                      onClick={handleMobileMenuLinkClick}
                      className="text-foreground/80 hover:text-foreground/50 flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-base transition-all duration-300"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/20 shadow-inner shadow-black/20">
                        <img src={language.img} className="h-6 w-6" alt="" />
                      </div>
                      <span className="font-medium">{language.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </nav>

            <Link
              to="#"
              onClick={handleMobileMenuLinkClick}
              className="group relative inline-flex h-11 w-full items-center justify-center overflow-hidden rounded-2xl bg-white text-sm font-bold text-black uppercase transition-all duration-300 ease-out will-change-transform hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.35),inset_0_-6px_20px_rgba(0,0,0,0.45)] focus-visible:ring-2 focus-visible:ring-[#0A84FF] focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.93] active:shadow-[inset_0_1px_6px_rgba(255,255,255,0.5),inset_0_-8px_22px_rgba(0,0,0,0.65)]"
            >
              Client Portal
            </Link>
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
            aria-label="Contact form"
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
