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

export default function Header() {
  const [open, setOpen] = useState(false);
  const isOpen = open === true;

  return (
    <div className="container mx-auto py-8">
      <header className="border-border z-50 rounded-3xl border bg-black/15 px-8 py-6 shadow-sm shadow-black backdrop-blur-md">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center space-x-2">
            <img src="./logo aidef.svg" className="w-34" alt="" />
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
                    className="text-foreground hover:text-foreground/50 flex items-center font-medium transition-colors duration-300"
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
            <a
              href="#"
              className="border-border w-10 rounded-xl border bg-white/25 p-2 shadow-lg shadow-black/25 backdrop-blur-2xl"
            >
              <img src="./placeholder.svg" alt="" />
            </a>
            <a
              href="#"
              className="border-border w-10 rounded-xl border bg-white/25 p-2 shadow-lg shadow-black/25 backdrop-blur-2xl"
            >
              <img src="./placeholder.svg" alt="" />
            </a>
            <a
              href="#"
              className="border-border w-10 rounded-xl border bg-white/25 p-2 shadow-lg shadow-black/25 backdrop-blur-2xl"
            >
              <img src="./placeholder.svg" alt="" />
            </a>
            <a href="#footer">
              <button className="text-background hover:text-foreground hover:bg-background bg-foreground hidden h-11 w-36 items-center justify-center rounded-xl font-bold uppercase transition-all duration-300 ease-in-out md:inline-flex">
                Contact Us
              </button>
            </a>
          </div>
        </div>
      </header>
      <div className="absolute top-32 right-[10%] z-50">
        <div
          className={`border-border mt-3 grid w-fit grid-cols-2 gap-x-12 gap-y-6 rounded-3xl border bg-black/25 p-8 opacity-0 shadow-lg shadow-black/25 backdrop-blur-md transition-all duration-300 ${isOpen ? "opacity-100" : ""}`}
        >
          <div className="flex items-center gap-6">
            <div className="border-border w-16 rounded-2xl border bg-white/25 p-3 shadow-md shadow-black/25 backdrop-blur-2xl">
              <img src="./placeholder.svg" alt="" />
            </div>
            <h1 className="text-xl font-bold">
              Autonomous unmanned aerial vehicles
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="border-border w-16 rounded-2xl border bg-white/25 p-3 shadow-md shadow-black/25 backdrop-blur-2xl">
              <img src="./placeholder.svg" alt="" />
            </div>
            <h1 className="text-xl font-bold">
              Components for UAV manufacturing
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="border-border w-16 rounded-2xl border bg-white/25 p-3 shadow-md shadow-black/25 backdrop-blur-2xl">
              <img src="./placeholder.svg" alt="" />
            </div>
            <h1 className="text-xl font-bold">Unmanned ground vehicle</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="border-border w-16 rounded-2xl border bg-white/25 p-3 shadow-md shadow-black/25 backdrop-blur-2xl">
              <img src="./placeholder.svg" alt="" />
            </div>
            <h1 className="text-xl font-bold">Small ARMS</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
