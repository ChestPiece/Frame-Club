"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/shop", label: "Collection" },
  { href: "/about", label: "Story" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border-dark bg-[#1a1614]/95 backdrop-blur-xl">
      <div className="frame-container flex h-20 items-center justify-between gap-4">
        <Link href="/" className="display-kicker text-2xl leading-none text-text-primary md:text-3xl">
          THE FRAME CLUB
        </Link>

        <nav className="hidden items-center gap-10 text-xs uppercase tracking-[0.22em] md:flex">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`border-b-2 pb-1 transition-colors ${
                  active
                    ? "border-brand text-text-primary"
                    : "border-transparent text-text-muted hover:border-brand hover:text-text-primary"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/shop"
            className="display-kicker border border-brand bg-brand px-4 py-2 text-xs text-text-primary transition-colors hover:bg-brand-mid md:px-6 md:text-sm"
          >
            ORDER NOW
          </Link>
        </div>
      </div>
    </header>
  );
}
