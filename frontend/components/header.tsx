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

const MENU_BUTTONS = [
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

  return (
    <div className="fixed left-1/2 z-50 container mx-auto -translate-x-1/2 py-6">
      <header className="border-border/75 rounded-[20px] border bg-linear-to-b from-black/10 via-black/10 to-white/10 px-8 py-6 shadow-sm shadow-black backdrop-blur-md">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center space-x-2">
            <img src="./logo-ai-def.svg" className="w-34" alt="" />
          </a>

          <div className="flex items-center gap-6">
            {NAV_LINKS.map(({ link, text }) => {
              const isProducts = text === "Products";
              if (!isProducts) {
                return (
                  <Link
                    key={link}
                    to={link}
                    className="text-foreground hover:text-foreground/50 flex items-center text-lg font-medium transition-colors duration-300"
                  >
                    {text}
                  </Link>
                );
              } else {
                return (
                  <button
                    key={link}
                    onClick={() => setOpen(isOpen ? false : true)}
                    className="text-foreground hover:text-foreground/50 flex items-center text-lg font-medium transition-colors duration-300"
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
                href="#"
                className="border-border/75 flex h-9.5 w-9.5 items-center justify-center rounded-[10px] border bg-linear-to-br from-white/15 via-white/20 to-white/25 shadow-md shadow-black/25 backdrop-blur-xl"
              >
                <img src={item} className="h-4.5 w-4.5" alt="" />
              </a>
            ))}

            <a href="#footer">
              <button className="text-background hover:text-foreground hover:bg-background bg-foreground hidden h-11 w-36 items-center justify-center rounded-xl font-bold uppercase transition-all duration-300 ease-in-out md:inline-flex">
                Contact Us
              </button>
            </a>
          </div>
        </div>
      </header>
      <div className="relative">
        <div
          className={`border-border/75 absolute right-0 z-50 mt-2.5 w-fit grid-cols-2 gap-x-10 gap-y-5 rounded-[20px] border bg-linear-to-b from-black/10 via-black/10 to-white/10 p-7.5 shadow-lg shadow-black/25 backdrop-blur-md transition-all duration-300 ${isOpen ? "grid opacity-100" : "hidden opacity-0"}`}
        >
          {MENU_BUTTONS.map(({ icon, text }) => (
            <div className="flex items-center gap-5">
              <div className="border-border/75 h-15 w-15 rounded-2xl border bg-linear-to-br from-white/15 via-white/20 to-white/25 p-3 shadow-md shadow-black/25 backdrop-blur-2xl">
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
