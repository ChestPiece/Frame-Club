"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { SiteTicker } from "@/components/layout/site-ticker";
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
  const rootRef = React.useRef<HTMLElement | null>(null);
  const navRowRef = React.useRef<HTMLDivElement | null>(null);
  const logoRef = React.useRef<HTMLAnchorElement | null>(null);
  const tickerWrapRef = React.useRef<HTMLDivElement | null>(null);
  const sheetContentRef = React.useRef<HTMLDivElement | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const [headerReady, setHeaderReady] = React.useState(false);
  const exploreActive = pathname === "/";

  const handleExploreClick = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (pathname !== "/") return;
      event.preventDefault();
      const target = "#collection-section";
      const smoother = ScrollSmoother.get();

      if (smoother) {
        smoother.scrollTo(target, true, "top 120px");
        return;
      }

      gsap.to(window, {
        duration: 1,
        ease: "power2.out",
        scrollTo: { y: target, offsetY: 120 },
      });
    },
    [pathname]
  );

  const animateUnderline = React.useCallback(
    (event: React.MouseEvent<HTMLElement>, shouldShow: boolean) => {
      const currentTarget = event.currentTarget;
      const underline = currentTarget.querySelector<HTMLElement>("[data-nav-underline]");
      if (!underline) return;

      gsap.to(underline, {
        scaleX: shouldShow ? 1 : 0,
        transformOrigin: shouldShow ? "left center" : "right center",
        duration: shouldShow ? 0.25 : 0.2,
        ease: shouldShow ? "power2.out" : "power2.in",
      });
    },
    []
  );

  useGSAP(
    () => {
      setHeaderReady(true);
      const navLinks = gsap.utils.toArray<HTMLElement>("[data-desktop-link]");

      gsap.set("[data-header-ticker]", { y: -8 });
      gsap.set("[data-header-logo]", { x: -16 });
      gsap.set(navLinks, { y: -6 });
      gsap.set("[data-header-cta]", { scale: 0.92 });

      const introTimeline = gsap.timeline({ defaults: { clearProps: "transform" } });
      introTimeline
        .to("[data-header-ticker]", {
          autoAlpha: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        })
        .to(
          "[data-header-logo]",
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.4,
            ease: "power3.out",
          },
          0.1
        )
        .to(
          navLinks,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.3,
            stagger: 0.06,
            ease: "power2.out",
          },
          0.18
        )
        .to(
          "[data-header-cta]",
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.35,
            ease: "back.out(1.4)",
          },
          0.38
        );

      const compactTimeline = gsap.timeline({ paused: true });
      compactTimeline
        .to(
          rootRef.current,
          {
            backgroundColor: "rgba(14,14,14,0.97)",
            duration: 0.4,
            ease: "power2.out",
          },
          0
        )
        .to(
          navRowRef.current,
          {
            height: 56,
            duration: 0.4,
            ease: "power2.out",
          },
          0
        )
        .to(
          logoRef.current,
          {
            scale: 0.88,
            transformOrigin: "left center",
            duration: 0.4,
            ease: "power2.out",
          },
          0
        )
        .to(
          tickerWrapRef.current,
          {
            height: 0,
            autoAlpha: 0,
            duration: 0.35,
            ease: "power2.out",
          },
          0
        );

      const trigger = ScrollTrigger.create({
        start: 60,
        onEnter: () => compactTimeline.play(),
        onLeaveBack: () => compactTimeline.reverse(),
      });

      return () => {
        trigger.kill();
      };
    },
    { scope: rootRef }
  );

  useGSAP(
    () => {
      if (!mobileNavOpen || !sheetContentRef.current) return;

      gsap.fromTo(
        "[data-mobile-nav-item]",
        { x: 24, autoAlpha: 0 },
        {
          x: 0,
          autoAlpha: 1,
          duration: 0.35,
          ease: "power3.out",
          stagger: 0.07,
        }
      );
    },
    { scope: sheetContentRef, dependencies: [mobileNavOpen] }
  );

  return (
    <header
      ref={rootRef}
      className="fixed inset-x-0 top-0 z-40 bg-(--bg-nav) backdrop-blur-xl"
    >
      <div
        ref={tickerWrapRef}
        className={`${headerReady ? "gsap-hidden" : ""} overflow-hidden`}
        data-header-ticker
      >
        <SiteTicker />
      </div>
      <div ref={navRowRef} className="frame-container grid h-20 w-full grid-cols-[auto_1fr_auto] items-center gap-4">
        <Link
          ref={logoRef}
          href="/"
          data-header-logo
          className={`${headerReady ? "gsap-hidden" : ""} display-kicker flex items-center gap-3 text-2xl leading-none text-text-primary md:text-3xl`}
        >
          <Image src="/FrameClub.png" alt="The Frame Club Logo" width={36} height={36} className="object-contain" />
          THE FRAME CLUB
        </Link>

        <NavigationMenu className="hidden justify-self-center md:flex">
          <NavigationMenuList className="items-center gap-10 text-xs uppercase tracking-[0.22em]">
            <NavigationMenuItem>
              <NavigationMenuLink
                render={<Link href="/#collection-section" onClick={handleExploreClick} />}
                data-desktop-link
                onMouseEnter={(event) => animateUnderline(event, true)}
                onMouseLeave={(event) => animateUnderline(event, false)}
                className={`group/nav-link relative border-0 pb-1 pl-4 text-text-muted hover:text-text-primary ${
                  exploreActive ? "text-text-primary" : ""
                }`}
              >
                {exploreActive ? <span className="absolute top-1/2 left-0 h-4 w-[2px] -translate-y-1/2 bg-brand-mid" /> : null}
                Explore
                <span data-nav-underline className="nav-link-underline" />
              </NavigationMenuLink>
            </NavigationMenuItem>
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);

              return (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink
                    render={<Link href={item.href} />}
                    data-desktop-link
                    onMouseEnter={(event) => animateUnderline(event, true)}
                    onMouseLeave={(event) => animateUnderline(event, false)}
                    className={`group/nav-link relative border-0 pb-1 pl-4 ${
                      active ? "text-text-primary" : "text-text-muted hover:text-text-primary"
                    }`}
                  >
                    {active ? <span className="absolute top-1/2 left-0 h-4 w-[2px] -translate-y-1/2 bg-brand-mid" /> : null}
                    {item.label}
                    <span data-nav-underline className="nav-link-underline" />
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center justify-self-end gap-3">
          <Button
            render={<Link href="/shop" />}
            variant="brand"
            size="sm"
            data-header-cta
            className={`${headerReady ? "gsap-hidden" : ""} display-kicker px-4 py-2 md:px-6 md:text-sm`}
          >
            <span className="md:hidden">ORDER</span>
            <span className="hidden md:inline">ORDER NOW</span>
          </Button>

          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation menu" />}
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </SheetTrigger>
            <SheetContent
              ref={sheetContentRef}
              side="right"
              className="w-full max-w-sm border-l border-border-dark bg-bg-recessed"
            >
              <SheetTitle className="display-kicker text-3xl" data-mobile-nav-item>
                NAVIGATION
              </SheetTitle>
              <nav className="mt-5 flex flex-col gap-3">
                <Button
                  render={<Link href="/#collection-section" onClick={handleExploreClick} />}
                  variant="outline"
                  data-mobile-nav-item
                  className="display-kicker w-full justify-start"
                >
                  Explore
                </Button>
                {navItems.map((item) => {
                  const active = isActive(pathname, item.href);

                  return (
                    <Button
                      key={item.href}
                      render={<Link href={item.href} />}
                      variant={active ? "brand" : "outline"}
                      data-mobile-nav-item
                      className="display-kicker w-full justify-start"
                    >
                      {item.label}
                    </Button>
                  );
                })}

                <Button
                  render={<Link href="/shop" />}
                  variant="brand"
                  data-mobile-nav-item
                  className="display-kicker mt-2 w-full"
                >
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
