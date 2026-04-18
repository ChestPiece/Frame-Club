"use client";

import { Button } from "@/components/ui/button";
import { COPY } from "@/lib/content/copy-constants";
import { FOOTER_NAV_ITEMS } from "@/lib/content/nav-constants";
import { TransitionLink } from "@/components/layout/page-transition";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-bg-deep">
      <div className="frame-container flex min-inline-safe flex-col justify-between gap-8 py-12 md:flex-row md:items-center">
        <p className="display-kicker text-2xl text-text-primary min-inline-safe">THE FRAME CLUB</p>

        <nav className="flex flex-wrap gap-4 text-[10px] uppercase tracking-[0.2em] text-text-muted">
          {FOOTER_NAV_ITEMS.map((item) => (
            <Button
              key={item.href}
              render={<TransitionLink href={item.href} />}
              variant="ghost"
              size="sm"
              className="display-kicker min-touch-target border-transparent px-0 py-0 text-[10px] text-text-muted hover:bg-transparent hover:text-text-primary"
            >
              {item.label}
            </Button>
          ))}
        </nav>

        <p className="text-[10px] uppercase tracking-[0.18em] text-text-muted">
          © 2026 THE FRAME CLUB
        </p>
      </div>

      <div className="border-t border-border/60">
        <div className="frame-container py-5 text-center text-[10px] uppercase tracking-[0.18em] text-text-muted">
          {COPY.trustLine}
        </div>
      </div>
    </footer>
  );
}
