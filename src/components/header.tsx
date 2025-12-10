 "use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

const links = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" }
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const showAdmin = !!process.env.NEXT_PUBLIC_ADMIN_PASS;

  return (
    <header className="sticky top-0 z-50">
      <div className="glass mx-auto flex max-w-6xl items-center justify-between rounded-2xl border px-4 py-3 shadow-glass backdrop-blur lg:px-6">
        <Link href="#home" className="text-lg font-semibold tracking-tight">
          Rimaz.dev
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-slate-200 transition hover:text-cyan-300"
            >
              {link.label}
            </Link>
          ))}
          {showAdmin && (
            <Link
              href="/admin"
              className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-tight text-slate-200 transition hover:border-cyan-300 hover:text-cyan-200"
            >
              Admin
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            className="lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      <div
        className={cn(
          "lg:hidden glass mx-auto mt-2 max-w-6xl rounded-2xl border px-4 py-2 backdrop-blur transition",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div className="flex flex-col gap-3 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-slate-200 transition hover:text-cyan-300"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {showAdmin && (
            <Link
              href="/admin"
              className="text-slate-200 transition hover:text-cyan-300"
              onClick={() => setOpen(false)}
            >
              Admin
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

