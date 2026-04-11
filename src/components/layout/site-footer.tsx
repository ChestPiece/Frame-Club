import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border-dark bg-bg-recessed">
      <div className="frame-container flex flex-col justify-between gap-8 py-12 md:flex-row md:items-center">
        <p className="display-kicker text-2xl text-text-primary">THE FRAME CLUB</p>

        <nav className="flex flex-wrap gap-6 text-[10px] uppercase tracking-[0.2em] text-text-muted">
          <Link href="/shop" className="transition-colors hover:text-text-primary">
            Collection
          </Link>
          <Link href="/about" className="transition-colors hover:text-text-primary">
            Story
          </Link>
          <Link href="/contact" className="transition-colors hover:text-text-primary">
            Contact
          </Link>
          <Link href="/admin/login" className="transition-colors hover:text-text-primary">
            Admin
          </Link>
        </nav>

        <p className="text-[10px] uppercase tracking-[0.18em] text-text-muted">
          © 2026 THE FRAME CLUB
        </p>
      </div>

      <div className="border-t border-border-dark/60">
        <div className="frame-container py-5 text-center text-[10px] uppercase tracking-[0.18em] text-text-muted">
          Nationwide Delivery Pakistan | Secure Payment | Handcrafted to Order
        </div>
      </div>
    </footer>
  );
}
