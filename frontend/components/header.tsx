"use client";

import { Menu } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "../components/ui/sheet";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "#support", label: "Support" },
];

export default function Header() {
  return (
    <header className="border-border bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <a href="/" className="flex items-center space-x-2">
          <img width={100} src="./logo aidef.svg" alt="" />
        </a>

        <div className="hidden gap-12 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              href={href}
              className="text-foreground hover:text-foreground/50 font-medium uppercase transition-colors duration-300"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a href="#footer">
            <button className="tracking-wide-caps text-background hover:text-foreground hover:bg-background bg-foreground hidden h-10 w-36 items-center justify-center rounded-xl uppercase transition-all duration-300 ease-in-out md:inline-flex">
              Contact Us
            </button>
          </a>

          <Sheet>
            <SheetTrigger asChild>
              <button className="hover:bg-foreground/25 border-secondary bg-foreground/75 text-foreground flex transform-gpu items-center justify-center rounded-xl border p-2 transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-px motion-reduce:transform-none md:hidden">
                <Menu className="size-8 text-black" />
                <span className="sr-only">Open menu</span>
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex h-full flex-col gap-8 px-6 py-10"
            >
              <nav className="flex flex-col gap-6">
                {NAV_LINKS.map(({ href, label }) => (
                  <SheetClose className="size" asChild key={href}>
                    <a
                      href={href}
                      className="tracking-wide-caps text-foreground hover:text-foreground/50 font-medium uppercase transition-colors duration-300"
                    >
                      {label}
                    </a>
                  </SheetClose>
                ))}
              </nav>
              <SheetClose asChild>
                <a href="#footer" className="mt-auto">
                  <button className="tracking-wide-caps text-background hover:text-foreground hover:bg-background bg-foreground mt-auto h-10 w-full rounded-xl uppercase transition-all duration-300 ease-in-out">
                    Contact Us
                  </button>
                </a>
              </SheetClose>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
