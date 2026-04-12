"use client";

import * as React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { animate } from "animejs";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { SiteTicker } from "@/components/layout/site-ticker";
import { gsap, ScrollTrigger } from "@/lib/gsap-config";
import { TransitionLink } from "@/components/layout/page-transition";
import { FullscreenNav } from "@/components/layout/fullscreen-nav";

const navItems = [
  { href: "/shop", label: "Collection", number: "01" },
  { href: "/about", label: "Story", number: "02" },
  { href: "/contact", label: "Contact", number: "03" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  href,
  label,
  number,
  active,
}: {
  href: string;
  label: string;
  number: string;
  active: boolean;
}) {
  const underlineRef = React.useRef<HTMLSpanElement>(null);

  const handleMouseEnter = React.useCallback(() => {
    if (active || !underlineRef.current) return;
    animate(underlineRef.current, {
      scaleX: [0, 1],
      duration: 200,
      ease: "outExpo",
    });
  }, [active]);

  const handleMouseLeave = React.useCallback(() => {
    if (active || !underlineRef.current) return;
    animate(underlineRef.current, {
      scaleX: [1, 0],
      duration: 160,
      ease: "inExpo",
    });
  }, [active]);

  return (
    <NavigationMenuItem>
      <div
        className="relative pb-1"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <NavigationMenuLink
          render={<TransitionLink href={href} />}
          className={`flex items-baseline gap-1.5 text-xs uppercase tracking-[0.22em] transition-colors duration-150 ${
            active ? "text-text-primary" : "text-text-muted hover:text-text-primary"
          }`}
        >
          <span className="technical-label text-[9px] text-text-muted">{number}</span>
          <span className="text-text-muted mx-0.5">—</span>
          <span>{label}</span>
        </NavigationMenuLink>
        <span
          ref={underlineRef}
          className="absolute bottom-0 left-0 h-px w-full bg-brand pointer-events-none"
          style={{
            transform: active ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "0% 50%",
          }}
          aria-hidden="true"
        />
      </div>
    </NavigationMenuItem>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const headerRef = React.useRef<HTMLDivElement>(null);
  const innerRef = React.useRef<HTMLDivElement>(null);
  const [isNavOpen, setIsNavOpen] = React.useState(false);

  // Scroll progress: write --scroll-progress CSS custom property
  React.useEffect(() => {
    const update = () => {
      const total =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? window.scrollY / total : 0;
      document.documentElement.style.setProperty(
        "--scroll-progress",
        String(progress)
      );
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // Header height collapse on scroll
  useGSAP(
    () => {
      ScrollTrigger.create({
        start: "top top-=80",
        onEnter: () => {
          gsap.to(innerRef.current, {
            height: "56px",
            duration: 0.3,
            ease: "power2.out",
          });
        },
        onLeaveBack: () => {
          gsap.to(innerRef.current, {
            height: "80px",
            duration: 0.3,
            ease: "power2.out",
          });
        },
      });
    },
    { scope: headerRef }
  );

  const handleNavClose = React.useCallback(() => setIsNavOpen(false), []);

  return (
    <>
      <header
        ref={headerRef}
        className="relative sticky top-0 z-40 flex flex-col border-b border-border-dark bg-[#1a1614]/95 backdrop-blur-xl"
      >
        {/* Scroll progress line — 2px, brand-mid, driven by CSS custom property */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 h-[2px] bg-brand-mid pointer-events-none z-50"
          style={{ width: "calc(var(--scroll-progress, 0) * 100%)" }}
        />

        <div
          ref={innerRef}
          className="frame-container flex h-20 w-full items-center justify-between gap-4 overflow-hidden"
        >
          <TransitionLink
            href="/"
            className="flex items-center gap-2 display-kicker text-xl leading-none text-text-primary md:text-3xl"
          >
            <Image
              src="/FrameClub.png"
              alt="The Frame Club Logo"
              width={32}
              height={32}
              className="object-contain"
            />
            THE FRAME CLUB
          </TransitionLink>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="items-center gap-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  number={item.number}
                  active={isActive(pathname, item.href)}
                />
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-3">
            <Button
              render={<TransitionLink href="/shop" />}
              variant="brand"
              size="sm"
              className="display-kicker px-4 py-2 md:px-6 md:text-sm"
            >
              <span className="md:hidden">ORDER</span>
              <span className="hidden md:inline">ORDER NOW</span>
            </Button>

            {/* Hamburger — two-bar SVG, shown on mobile only */}
            <button
              onClick={() => setIsNavOpen(true)}
              className="md:hidden flex flex-col justify-between w-6 h-[14px] text-text-primary hover:text-brand-bright transition-colors"
              aria-label="Open navigation menu"
              aria-expanded={isNavOpen}
            >
              <span className="block h-px w-full bg-current" />
              <span className="block h-px w-full bg-current" />
            </button>
          </div>
        </div>

        <SiteTicker />
      </header>

      {/* Full-screen mobile nav — rendered outside header so it can cover the full viewport */}
      <FullscreenNav
        isOpen={isNavOpen}
        onClose={handleNavClose}
        navItems={navItems}
      />
    </>
  );
}
