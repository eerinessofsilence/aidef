"use client";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";

const NAV_LINKS = [
  {
    link: "/",
    text: "Home",
  },
  {
    link: "/products",
    text: "Products",
  },
  {
    link: "/services",
    text: "Services",
  },
  {
    link: "#footer",
    text: "Support",
  },
];

const NAV_BUTTONS = [
  "./language-icon.svg",
  "./search-icon.svg",
  "./cart-icon.svg",
];

const PRODUCTS_BUTTONS = [
  {
    icon: "./nav-button-1.svg",
    text: "Autonomous unmanned aerial vehicles",
  },
  {
    icon: "./nav-button-2.svg",
    text: "Components for UAV manufacturing",
  },
  {
    icon: "./nav-button-3.svg",
    text: "Unmanned ground vehicle",
  },
  {
    icon: "./nav-button-4.svg",
    text: "Small ARMS",
  },
];
export default function Header() {
  const [productsIsOpen, setProductsIsOpen] = useState(false);
  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);

  const menuId = "products-menu";
  const mobileMenuId = "mobile-menu";

  const handleProductsToggle = () =>
    setProductsIsOpen((prevState) => !prevState);
  const handleMobileMenuToggle = () =>
    setMobileMenuIsOpen((prevState) => !prevState);
  const handleMobileMenuLinkClick = () => setMobileMenuIsOpen(false);

  return (
    <div className="fixed left-1/2 z-50 container mx-auto -translate-x-1/2 py-6 max-lg:px-10">
      <header className="border-border/75 rounded-[20px] border bg-linear-to-b from-black/25 via-black/25 to-black/25 px-8 py-6 shadow-sm shadow-black backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center space-x-2">
            <img src="./logo-ai-def.svg" className="w-36" alt="" />
          </a>

          <div className="flex items-center gap-6 max-lg:hidden">
            {NAV_LINKS.map(({ link, text }) => {
              const isProducts = text === "Products";
              if (!isProducts) {
                return (
                  <Link
                    key={link}
                    to={link}
                    className="group text-foreground hover:text-foreground/80 relative font-medium transition-all duration-300 ease-out will-change-transform hover:opacity-90"
                  >
                    {text}
                  </Link>
                );
              } else {
                return (
                  <button
                    key={link}
                    onClick={handleProductsToggle}
                    aria-expanded={productsIsOpen}
                    aria-controls={menuId}
                    className="group text-foreground hover:text-foreground/80 relative flex items-center font-medium transition-all duration-300 ease-out will-change-transform hover:opacity-90"
                  >
                    {text}
                    <ChevronDown
                      className={`h-5 w-5 transition-transform duration-300 ${
                        productsIsOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                );
              }
            })}
          </div>

          <div className="flex items-center gap-6 max-lg:gap-3">
            {NAV_BUTTONS.map((item) =>
              item !== "./language-icon.svg" ? (
                <a
                  key={item}
                  href="#"
                  className="border-border/50 flex h-9.5 w-9.5 items-center justify-center rounded-[10px] border bg-linear-to-br from-black/20 via-black/25 to-black/25 backdrop-blur-xl transition-all duration-300 hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.28),inset_0_-6px_20px_rgba(0,0,0,0.45)] max-lg:hidden"
                >
                  <img src={item} className="h-4.5 w-4.5" alt="" />
                </a>
              ) : (
                <a
                  key={item}
                  href="#"
                  className="border-border/50 flex h-9.5 w-9.5 items-center justify-center rounded-[10px] border bg-linear-to-br from-black/20 via-black/25 to-black/25 backdrop-blur-xl transition-all duration-300 hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.28),inset_0_-6px_20px_rgba(0,0,0,0.45)]"
                >
                  <img src={item} className="h-4.5 w-4.5" alt="" />
                </a>
              ),
            )}

            <a href="#footer" className="hidden lg:inline-flex">
              <button className="group bg-foreground text-background relative inline-flex h-10 w-30 items-center justify-center overflow-hidden rounded-2xl text-sm font-bold uppercase transition-all duration-300 ease-in hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.28),inset_0_-6px_20px_rgba(0,0,0,0.45)]">
                <span className="relative z-10 transition-transform duration-300">
                  Contact Us
                </span>
              </button>
            </a>

            <button
              type="button"
              onClick={handleMobileMenuToggle}
              aria-expanded={mobileMenuIsOpen}
              aria-controls={mobileMenuId}
              className="border-border/50 flex h-9.5 w-9.5 items-center justify-center rounded-[10px] border bg-linear-to-br from-black/20 via-black/25 to-black/25 backdrop-blur-xl transition-all duration-300 hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.28),inset_0_-6px_20px_rgba(0,0,0,0.45)] lg:hidden"
            >
              {mobileMenuIsOpen ? (
                <X className="h-4.5 w-4.5" />
              ) : (
                <Menu className="h-4.5 w-4.5" />
              )}
            </button>
          </div>
        </div>
      </header>
      <div className="relative hidden lg:block">
        <div
          id={menuId}
          aria-hidden={!productsIsOpen}
          className={`border-border/75 absolute right-0 z-50 mt-2.5 grid w-fit origin-top-right transform grid-cols-2 gap-x-10 gap-y-5 overflow-hidden rounded-[20px] border bg-linear-to-b from-black/20 via-black/20 to-black/20 p-7.5 shadow-lg shadow-black/25 backdrop-blur-md transition-all duration-500 ease-out ${
            productsIsOpen
              ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
              : "pointer-events-none -translate-y-3 scale-95 opacity-0"
          }`}
        >
          <div className="from-foreground/30 via-foreground/5 pointer-events-none absolute inset-0 -z-10 mx-auto mt-3 h-3/4 w-[80%] rounded-[30px] bg-linear-to-b to-transparent opacity-40 blur-3xl" />
          {PRODUCTS_BUTTONS.map(({ icon, text }, index) => (
            <div
              key={text}
              style={{
                transitionDelay: `${productsIsOpen ? index * 90 + 80 : 0}ms`,
              }}
              className={`flex items-center gap-5 rounded-2xl transition-all duration-500 ease-out ${
                productsIsOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-3 opacity-0"
              }`}
            >
              <div className="border-border/75 h-15 w-15 rounded-2xl border bg-linear-to-br from-black/20 via-black/25 to-black/25 p-3 shadow-md shadow-black/25 backdrop-blur-2xl hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.28),inset_0_-6px_20px_rgba(0,0,0,0.45)]">
                <img src={icon} className="h-8.5 w-8.5" alt="" />
              </div>
              <h1 className="text-lg font-semibold">{text}</h1>
            </div>
          ))}
        </div>
      </div>

      <div className="relative lg:hidden">
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
            {NAV_LINKS.map(({ link, text }) => (
              <Link
                key={link}
                to={link}
                onClick={handleMobileMenuLinkClick}
                className="hover:text-foreground/80 transition-colors duration-200"
              >
                {text}
              </Link>
            ))}
          </nav>

          <div className="flex flex-wrap items-center gap-4 max-lg:hidden">
            {NAV_BUTTONS.map((item) => (
              <a
                key={item}
                href="#"
                onClick={handleMobileMenuLinkClick}
                className="border-border/50 flex h-9.5 w-9.5 items-center justify-center rounded-[10px] border bg-linear-to-br from-black/20 via-black/20 to-black/25 backdrop-blur-xl transition-all duration-300 hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.28),inset_0_-6px_20px_rgba(0,0,0,0.45)]"
              >
                <img src={item} className="h-4.5 w-4.5" alt="" />
              </a>
            ))}
          </div>

          <a
            href="#footer"
            onClick={handleMobileMenuLinkClick}
            className="inline-flex"
          >
            <button className="group relative inline-flex h-11 w-full items-center justify-center overflow-hidden rounded-2xl bg-white text-sm font-bold text-black uppercase transition-all duration-300 ease-in hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.28),inset_0_-6px_20px_rgba(0,0,0,0.45)]">
              <span className="relative z-10 transition-transform duration-300">
                Contact Us
              </span>
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
