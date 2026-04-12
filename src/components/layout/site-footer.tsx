import Link from "next/link";
import { Button } from "@/components/ui/button";
import { COPY } from "@/lib/copy-constants";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border-dark bg-bg-recessed">
      <div className="frame-container flex flex-col justify-between gap-8 py-12 md:flex-row md:items-center">
        <p className="display-kicker text-2xl text-text-primary">THE FRAME CLUB</p>

        <nav className="flex flex-wrap gap-6 text-[10px] uppercase tracking-[0.2em] text-text-muted">
          <Button
            render={<Link href="/shop" />}
            variant="ghost"
            size="sm"
            className="display-kicker border-transparent px-0 py-0 text-[10px] text-text-muted hover:bg-transparent hover:text-text-primary"
          >
            Collection
          </Button>
          <Button
            render={<Link href="/about" />}
            variant="ghost"
            size="sm"
            className="display-kicker border-transparent px-0 py-0 text-[10px] text-text-muted hover:bg-transparent hover:text-text-primary"
          >
            Story
          </Button>
          <Button
            render={<Link href="/contact" />}
            variant="ghost"
            size="sm"
            className="display-kicker border-transparent px-0 py-0 text-[10px] text-text-muted hover:bg-transparent hover:text-text-primary"
          >
            Contact
          </Button>
          <Button
            render={<Link href="/admin/login" />}
            variant="ghost"
            size="sm"
            className="display-kicker border-transparent px-0 py-0 text-[10px] text-text-muted hover:bg-transparent hover:text-text-primary"
          >
            Admin
          </Button>
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
