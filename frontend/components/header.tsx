"use client";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

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
  const [open, setOpen] = useState(false);
  const isOpen = open === true;
  const menuId = "products-menu";
  const handleToggle = () => setOpen((prev) => !prev);

  return (
    <div className="fixed left-1/2 z-50 container mx-auto -translate-x-1/2 py-6">
      <header className="border-border/75 rounded-[20px] border bg-linear-to-b from-black/10 via-black/10 to-white/10 px-8 py-6 shadow-sm shadow-black backdrop-blur-md">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center space-x-2">
            <img src="./logo-ai-def.svg" className="w-36" alt="" />
          </a>

          <div className="flex items-center gap-6">
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
                    onClick={handleToggle}
                    aria-expanded={isOpen}
                    aria-controls={menuId}
                    className="group text-foreground hover:text-foreground/80 relative flex items-center font-medium transition-all duration-300 ease-out will-change-transform hover:opacity-90"
                  >
                    {text}
                    <ChevronDown
                      className={`h-5 w-5 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                );
              }
            })}
          </div>

          <div className="flex items-center gap-6">
            {NAV_BUTTONS.map((item) => (
              <a
                key={item}
                href="#"
                className="border-border/50 flex h-9.5 w-9.5 items-center justify-center rounded-[10px] border bg-linear-to-br from-white/10 via-white/15 to-white/20 backdrop-blur-xl transition-all duration-300 hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.28),inset_0_-6px_20px_rgba(0,0,0,0.45)]"
              >
                <img src={item} className="h-4.5 w-4.5" alt="" />
              </a>
            ))}

            <a href="#footer" className="hidden md:inline-flex">
              <button className="group relative inline-flex h-10 w-30 items-center justify-center overflow-hidden rounded-2xl bg-white text-sm font-bold text-black uppercase transition-all duration-300 ease-in hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.28),inset_0_-6px_20px_rgba(0,0,0,0.45)]">
                <span className="relative z-10 transition-transform duration-300">
                  Contact Us
                </span>
              </button>
            </a>
          </div>
        </div>
      </header>
      <div className="relative">
        <div
          id={menuId}
          aria-hidden={!isOpen}
          className={`border-border/75 absolute right-0 z-50 mt-2.5 grid w-fit origin-top-right transform grid-cols-2 gap-x-10 gap-y-5 overflow-hidden rounded-[20px] border bg-linear-to-b from-black/10 via-black/10 to-white/10 p-7.5 shadow-lg shadow-black/25 backdrop-blur-md transition-all duration-500 ease-out ${isOpen ? "pointer-events-auto translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-3 scale-95 opacity-0"}`}
        >
          <div className="from-foreground/30 via-foreground/5 pointer-events-none absolute inset-0 -z-10 mx-auto mt-3 h-3/4 w-[80%] rounded-[30px] bg-linear-to-b to-transparent opacity-40 blur-3xl" />
          {PRODUCTS_BUTTONS.map(({ icon, text }, index) => (
            <div
              key={text}
              style={{
                transitionDelay: `${isOpen ? index * 90 + 80 : 0}ms`,
              }}
              className={`flex items-center gap-5 rounded-2xl transition-all duration-500 ease-out ${
                isOpen ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
            >
              <div className="border-border/75 h-15 w-15 rounded-2xl border bg-linear-to-br from-white/15 via-white/20 to-white/25 p-3 shadow-md shadow-black/25 backdrop-blur-2xl hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.28),inset_0_-6px_20px_rgba(0,0,0,0.45)]">
                <img src={icon} className="h-8.5 w-8.5" alt="" />
              </div>
              <h1 className="text-lg font-semibold">{text}</h1>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
