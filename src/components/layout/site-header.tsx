"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

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

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="items-center gap-8 text-xs uppercase tracking-[0.22em]">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);

              return (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink
                    render={<Link href={item.href} />}
                    className={`border-b-2 pb-1 ${
                      active
                        ? "border-brand text-text-primary"
                        : "border-transparent text-text-muted hover:border-brand hover:text-text-primary"
                    }`}
                  >
                    {item.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-3">
          <Button
            render={<Link href="/shop" />}
            variant="brand"
            size="sm"
            className="display-kicker px-4 py-2 md:px-6 md:text-sm"
          >
            ORDER NOW
          </Button>

          <Sheet>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation menu" />}
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-sm border-l border-border-dark bg-bg-recessed">
              <SheetTitle className="display-kicker text-3xl">NAVIGATION</SheetTitle>
              <nav className="mt-5 flex flex-col gap-3">
                {navItems.map((item) => {
                  const active = isActive(pathname, item.href);

                  return (
                    <Button
                      key={item.href}
                      render={<Link href={item.href} />}
                      variant={active ? "brand" : "outline"}
                      className="display-kicker w-full justify-start"
                    >
                      {item.label}
                    </Button>
                  );
                })}

                <Button render={<Link href="/shop" />} variant="brand" className="display-kicker mt-2 w-full">
                  ORDER NOW
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
