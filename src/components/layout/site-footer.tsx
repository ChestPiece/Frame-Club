"use client";

import { Button } from "@/components/ui/button";
import { COPY } from "@/lib/copy-constants";
import { TransitionLink } from "@/components/layout/page-transition";

const footerNavItems = [
  { href: "/shop", label: "Collection" },
  { href: "/about", label: "Story" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border-dark bg-bg-recessed">
      <div className="frame-container flex flex-col justify-between gap-8 py-12 md:flex-row md:items-center">
        <p className="display-kicker text-2xl text-text-primary">THE FRAME CLUB</p>

        <nav className="flex flex-wrap gap-6 text-[10px] uppercase tracking-[0.2em] text-text-muted">
          {footerNavItems.map((item) => (
            <Button
              key={item.href}
              render={<TransitionLink href={item.href} />}
              variant="ghost"
              size="sm"
              className="display-kicker border-transparent px-0 py-0 text-[10px] text-text-muted hover:bg-transparent hover:text-text-primary"
            >
              {item.label}
            </Button>
          ))}
        </nav>

        <p className="text-[10px] uppercase tracking-[0.18em] text-text-muted">
          © 2026 THE FRAME CLUB
        </p>
      </div>

      <div className="border-t border-border-dark/60">
        <div className="frame-container py-5 text-center text-[10px] uppercase tracking-[0.18em] text-text-muted">
          {COPY.trustLine}
        </div>
      </div>
    </footer>
  );
}
