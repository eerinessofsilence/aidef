"use client";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { text: "Home", href: "/" },
  { text: "Products", href: "#", hasDropdown: true },
  { text: "Solutions", href: "#", hasDropdown: true },
  { text: "Technology", href: "#", hasDropdown: true },
  { text: "Company", href: "#", hasDropdown: true },
  { text: "Support", href: "/support" },
  { text: "Contact", href: "/contact" },
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
    { title: "AX2NG KRAKATIT", href: "#", icon: "./products-1.png" },
    { title: "AV2 VTOL", href: "#", icon: "./products-2.png" },
    { title: "AXQ QUADROCOPTER", href: "#", icon: "./products-3.png" },
    { title: "Ground Control Station", href: "#", icon: "./products-4.png" },
    { title: "UGV 150-DUP", href: "#", icon: "./products-5.png" },
  ],
  Solutions: [
    {
      title: "Integration into military vehicles",
      href: "#",
      icon: "./solutions-1.svg",
    },
    {
      title: "Aviation",
      href: "#",
      icon: "./solutions-2.svg",
    },
    {
      title: "Security",
      href: "#",
      icon: "./solutions-3.svg",
    },
    {
      title: "Defense",
      href: "#",
      icon: "./solutions-4.svg",
    },
  ],
  Technology: [
    {
      title: "Propulsion (AD20PRO, jet engine systems)",
      href: "#",
      icon: "./technology-1.svg",
    },
    { title: "Electronics & Avionics", href: "#", icon: "./technology-2.svg" },
    {
      title: "C2, GCS & API integration",
      href: "#",
      icon: "./technology-3.svg",
    },
  ],
  Company: [
    { title: "About Us", href: "#", icon: "./company-1.svg" },
    { title: "Careers", href: "#", icon: "./company-2.svg" },
  ],
};

export default function Header() {
  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null); // used for desktop hover
  const [dropdownTimeout, setDropdownTimeout] = useState<number | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>(
    {},
  );

  const mobileMenuId = "mobile-menu";

  const handleMouseEnter = (name: string) => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
    }
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    const timeout = window.setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
    setDropdownTimeout(timeout);
  };

  const handleDropdownEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
    }
  };
  const handleMobileMenuToggle = () =>
    setMobileMenuIsOpen((prevState) => !prevState);
  const handleMobileMenuLinkClick = () => setMobileMenuIsOpen(false);

  // toggle mobile dropdown expansion (click-to-open under the link)
  const toggleMobileDropdown = (name: string) => {
    setMobileExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="fixed left-1/2 z-50 container mx-auto -translate-x-1/2 py-6 max-[1281px]:px-5">
      <header className="border-border/75 rounded-[20px] border bg-linear-to-b from-black/25 via-black/25 to-black/25 px-8 py-6 shadow-sm shadow-black backdrop-blur-lg max-md:px-5 max-md:py-5">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center space-x-2">
            <img
              src="./logo-ai-def.svg"
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
                  <button className="group text-foreground hover:text-foreground/70 flex cursor-pointer items-center gap-1 text-lg font-medium transition-colors">
                    {link.text}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-300 ${
                        activeDropdown === link.text ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    to={link.href}
                    className="text-foreground hover:text-foreground/70 cursor-pointer text-lg font-medium transition-colors"
                  >
                    {link.text}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-5 max-lg:gap-3">
            <a
              href="#"
              className="border-border/50 active:translate-y-2px flex h-9.5 w-9.5 items-center justify-center rounded-[10px] border bg-linear-to-br from-black/20 via-black/25 to-black/25 backdrop-blur-xl transition-all duration-300 will-change-transform hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.35),inset_0_-6px_20px_rgba(0,0,0,0.45)] active:scale-[0.93] active:shadow-[inset_0_1px_6px_rgba(255,255,255,0.4),inset_0_-6px_18px_rgba(0,0,0,0.7)] max-xl:hidden"
            >
              <img src="./language-icon.svg" className="h-4.5 w-4.5" alt="" />
            </a>
            <Link
              to="/portal"
              className="group relative inline-flex h-10 w-[139px] items-center justify-center overflow-hidden rounded-xl bg-white text-sm font-bold text-black uppercase transition-all duration-300 ease-out will-change-transform hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.35),inset_0_-6px_20px_rgba(0,0,0,0.45)] focus-visible:ring-2 focus-visible:ring-[#0A84FF] focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.93] active:shadow-[inset_0_1px_6px_rgba(255,255,255,0.5),inset_0_-8px_22px_rgba(0,0,0,0.65)] max-xl:hidden"
            >
              Client Portal
            </Link>

            <button
              type="button"
              onClick={handleMobileMenuToggle}
              aria-expanded={mobileMenuIsOpen}
              aria-controls={mobileMenuId}
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

      {/* Desktop dropdowns (hover) */}
      {Object.entries(DROPDOWN_MENUS).map(([name, items]) => {
        // render only when activeDropdown === name
        if (activeDropdown !== name) return null;

        // choose layout per menu type (kept similar to your original layouts)
        if (name === "Products") {
          return (
            <div
              key={name}
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleMouseLeave}
              className={`pointer-events-auto absolute top-full left-1/4 max-w-152.5 -translate-x-1/4 -translate-y-4 rounded-[20px] bg-[#f5f5f5] opacity-100 shadow-sm shadow-black/25 transition-all duration-300`}
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
                      alt=""
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
              className={`pointer-events-auto absolute top-full right-0 left-1/7 max-w-[930px] -translate-y-4 rounded-[20px] bg-white opacity-100 shadow-sm shadow-black transition-all duration-300`}
            >
              <div className="grid grid-cols-2 gap-x-10 gap-y-5 p-7.5">
                {items.map((item) => (
                  <Link
                    key={item.title}
                    to={item.href}
                    className="group flex items-center gap-5 rounded-xl transition-all duration-300 hover:bg-black/7 hover:p-3"
                    onClick={() => setActiveDropdown(null)}
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
              className={`pointer-events-auto absolute top-full right-0 left-1/4 max-w-[930px] -translate-y-4 rounded-[20px] bg-white opacity-100 shadow-sm shadow-black transition-all duration-300`}
            >
              <div className="grid grid-cols-2 gap-x-10 gap-y-5 p-7.5">
                {items.map((item) => (
                  <Link
                    key={item.title}
                    to={item.href}
                    className="group flex items-center gap-5 rounded-xl transition-all duration-300 hover:bg-black/7"
                    onClick={() => setActiveDropdown(null)}
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
              className={`pointer-events-auto absolute top-full right-0 left-1/3 max-w-[930px] -translate-y-4 rounded-[20px] bg-white opacity-100 shadow-sm shadow-black transition-all duration-300`}
            >
              <div className="grid grid-cols-2 gap-x-10 gap-y-5 p-7.5">
                {items.map((item) => (
                  <Link
                    key={item.title}
                    to={item.href}
                    className="group flex items-center gap-5 rounded-xl transition-all duration-300 hover:bg-black/7"
                    onClick={() => setActiveDropdown(null)}
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

      {/* Mobile menu */}
      <div className="relative xl:hidden">
        <div
          id={mobileMenuId}
          aria-hidden={!mobileMenuIsOpen}
          className={`border-border/75 absolute right-0 z-40 mt-3 flex w-full origin-top-right flex-col gap-5 rounded-[20px] border bg-linear-to-b from-black/20 via-black/20 to-black/20 p-6 shadow-lg shadow-black/25 backdrop-blur-md transition-all duration-500 ease-out ${
            mobileMenuIsOpen
              ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
              : "pointer-events-none -translate-y-3 scale-95 opacity-0"
          }`}
        >
          <nav className="text-foreground flex flex-col gap-3 text-lg font-medium">
            {NAV_LINKS.map((link) => {
              if (link.hasDropdown) {
                const submenu = DROPDOWN_MENUS[link.text as keyof Menus] || [];
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
                      {submenu.map((s) => (
                        <Link
                          key={s.title}
                          to={s.href}
                          onClick={handleMobileMenuLinkClick}
                          className="text-foreground/80 hover:text-foreground/50 pl-2 text-base transition-all duration-300"
                        >
                          {s.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <div key={link.text} className="relative">
                  <Link
                    to={link.href}
                    onClick={handleMobileMenuLinkClick}
                    className="text-foreground hover:text-foreground/70 block cursor-pointer text-lg font-medium transition-colors"
                  >
                    {link.text}
                  </Link>
                </div>
              );
            })}
          </nav>

          <Link
            to="/portal"
            className="group relative inline-flex h-11 w-full items-center justify-center overflow-hidden rounded-2xl bg-white text-sm font-bold text-black uppercase transition-all duration-300 ease-out will-change-transform hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.35),inset_0_-6px_20px_rgba(0,0,0,0.45)] focus-visible:ring-2 focus-visible:ring-[#0A84FF] focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.93] active:shadow-[inset_0_1px_6px_rgba(255,255,255,0.5),inset_0_-8px_22px_rgba(0,0,0,0.65)]"
          >
            Client Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
