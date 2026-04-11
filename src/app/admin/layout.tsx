"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" as const },
  { href: "/admin/orders", label: "Orders", icon: "orders" as const },
  { href: "/admin/products", label: "Products", icon: "products" as const },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === href;
  }

  return pathname.startsWith(href);
}

function SidebarIcon({ name }: { name: "dashboard" | "orders" | "products" }) {
  if (name === "dashboard") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    );
  }

  if (name === "orders") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="9" cy="20" r="1.4" />
        <circle cx="18" cy="20" r="1.4" />
        <path d="M2.5 3.5h2.5l2.2 11h10.3l2.2-8.5H6.1" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5z" />
      <path d="M4 8.5 12 13l8-4.5" />
      <path d="M12 13v7" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M15.5 17h-7V11a3.5 3.5 0 1 1 7 0z" />
      <path d="M5 17h14" />
      <path d="M10 19.5a2 2 0 0 0 4 0" />
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="8" r="3.25" />
      <path d="M5.5 19.5a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <aside className="fixed left-0 top-0 flex h-screen w-60 flex-col border-r border-border-dark bg-bg-recessed py-8">
        <div className="px-6">
          <p className="technical-label text-xl tracking-[0.08em] text-text-primary">THE FRAME CLUB</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.26em] text-text-muted">Admin Core</p>
        </div>

        <nav className="mt-8 space-y-1 text-xs uppercase tracking-[0.2em]">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-6 py-4 transition-colors ${
                  active
                    ? "border-l-[3px] border-brand-mid bg-brand text-text-primary"
                    : "text-text-muted hover:bg-bg-surface hover:text-text-primary"
                }`}
              >
                <SidebarIcon name={item.icon} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-6 pt-12">
          <div className="border border-border-dark/60 bg-bg-surface p-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-text-primary">System Admin</p>
            <p className="mt-1 text-[10px] text-text-muted">v2.4.1 Active</p>
          </div>
        </div>
      </aside>

      <div className="ml-60 min-h-screen">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border-dark bg-bg-base/80 px-8 backdrop-blur-md">
          <p className="technical-label text-xs text-text-primary">ADMIN CORE</p>

          <div className="flex items-center gap-6">
            <button type="button" className="relative text-text-muted transition-colors hover:text-text-primary" aria-label="Notifications">
              <BellIcon />
              <span className="absolute -right-1 -top-1 h-1.5 w-1.5 bg-brand-mid" />
            </button>
            <span className="text-xs text-text-muted">Superuser Mode</span>
            <span className="text-[#ffb3af]" aria-hidden="true">
              <AccountIcon />
            </span>
            <Link href="/" className="display-kicker border border-border-dark px-3 py-2 text-xs transition-colors hover:bg-bg-surface">
              Storefront
            </Link>
          </div>
        </header>

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
