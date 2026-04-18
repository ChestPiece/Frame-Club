"use client";

import * as React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { gsap } from "@/lib/animation/gsap-config";
import { useScrollTriggerReady } from "@/components/providers/scroll-trigger-environment";
import { useHeaderIntroAnimation } from "@/components/layout/hooks/use-header-intro-animation";
import { useHeaderScrollAnimation } from "@/components/layout/hooks/use-header-scroll-animation";
import { TransitionLink } from "@/components/layout/page-transition";
import { Button } from "@/components/ui/button";
import { NAV_ITEMS, MOBILE_NAV_ITEMS } from "@/lib/content/nav-constants";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { FullscreenNav } from "@/components/layout/fullscreen-nav";
import { SiteTicker } from "@/components/layout/site-ticker";
import { cn, isPrefixActive } from "@/lib/utils";

const navItems = NAV_ITEMS;
const mobileNavItems = [...MOBILE_NAV_ITEMS];

export function SiteHeader() {
  const pathname = usePathname();
  const rootRef = React.useRef<HTMLElement | null>(null);
  const headerTintRef = React.useRef<HTMLDivElement | null>(null);
  const navRowRef = React.useRef<HTMLDivElement | null>(null);
  const logoRef = React.useRef<HTMLAnchorElement | null>(null);
  const tickerWrapRef = React.useRef<HTMLDivElement | null>(null);
  const mobileToggleRef = React.useRef<HTMLButtonElement | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const [headerReady, setHeaderReady] = React.useState(false);
  const exploreActive = pathname === "/";
  const scrollTriggerReady = useScrollTriggerReady();

  if (pathname.startsWith("/admin")) {
    return null;
  }

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
    [pathname],
  );

  const animateUnderline = React.useCallback((event: React.MouseEvent<HTMLElement>, shouldShow: boolean) => {
    const currentTarget = event.currentTarget;
    const underline = currentTarget.querySelector<HTMLElement>("[data-nav-underline]");
    if (!underline) return;

    gsap.killTweensOf(underline);
    gsap.to(underline, {
      scaleX: shouldShow ? 1 : 0,
      transformOrigin: shouldShow ? "left center" : "right center",
      duration: shouldShow ? 0.25 : 0.2,
      ease: shouldShow ? "power2.out" : "power2.in",
    });
  }, []);

  useHeaderIntroAnimation({
    rootRef,
    scrollTriggerReady,
    headerTintRef,
    navRowRef,
    logoRef,
    tickerWrapRef,
    setHeaderReady,
  });

  useHeaderScrollAnimation({ mobileToggleRef, mobileNavOpen });

  return (
    <header ref={rootRef} className="fixed inset-x-0 top-0 z-40 bg-(--bg-nav) backdrop-blur-xl">
      <div
        ref={headerTintRef}
        className="pointer-events-none absolute inset-0 z-0 bg-bg-deep opacity-0"
        aria-hidden
      />
      <div
        ref={tickerWrapRef}
        className={cn(
          `${headerReady ? "gsap-hidden" : ""} relative z-10 overflow-hidden origin-top`,
          mobileNavOpen && "pointer-events-none md:pointer-events-auto",
        )}
        data-header-ticker
      >
        <SiteTicker />
      </div>
      <div
        ref={navRowRef}
        className={cn(
          "relative z-10 frame-container grid h-20 w-full min-inline-safe grid-cols-[minmax(0,1fr)_auto] items-center gap-2 md:grid-cols-[auto_1fr_auto] md:gap-4",
          mobileNavOpen && "pointer-events-none md:pointer-events-auto",
        )}
      >
        <TransitionLink
          ref={logoRef}
          href="/"
          data-header-logo
          className={`${headerReady ? "gsap-hidden" : ""} display-kicker min-w-0 min-inline-safe flex max-w-full items-center gap-2 text-xl leading-none text-text-primary sm:gap-3 md:max-w-none md:text-3xl`}
        >
          <Image
            src="/Assets/FrameClub.png"
            alt="The Frame Club Logo"
            width={34}
            height={34}
            className="size-[34px] shrink-0 object-contain sm:h-9 sm:w-9"
          />
          <span className="hidden min-w-0 truncate sm:inline">THE FRAME CLUB</span>
        </TransitionLink>

        <NavigationMenu className="hidden justify-self-center md:flex">
          <NavigationMenuList className="items-center gap-10 text-xs uppercase tracking-[0.22em]">
            <NavigationMenuItem>
              <NavigationMenuLink
                render={<TransitionLink href="/#collection-section" onClick={handleExploreClick} />}
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
              const active = isPrefixActive(pathname, item.href);

              return (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink
                    render={<TransitionLink href={item.href} />}
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

        <div className="flex shrink-0 items-center justify-self-end gap-2 sm:gap-3">
          <Button
            render={<TransitionLink href="/shop" />}
            variant="brand"
            size="sm"
            data-header-cta
            className={`${headerReady ? "gsap-hidden" : ""} display-kicker min-touch-target px-3 py-2 sm:px-4 md:px-6 md:text-sm`}
          >
            <span className="md:hidden">ORDER</span>
            <span className="hidden md:inline">ORDER NOW</span>
          </Button>

          <Button
            ref={mobileToggleRef}
            variant="ghost"
            size="icon"
            className="relative md:hidden"
            aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen((previous) => !previous)}
          >
            <span className="sr-only">Toggle navigation</span>
            <span
              data-hamburger-bar
              className="absolute h-[1.5px] w-5 -translate-y-1.5 bg-text-primary"
            />
            <span data-hamburger-bar className="absolute h-[1.5px] w-5 bg-text-primary" />
            <span
              data-hamburger-bar
              className="absolute h-[1.5px] w-5 translate-y-1.5 bg-text-primary"
            />
          </Button>
        </div>
      </div>
      <FullscreenNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        navItems={mobileNavItems}
      />
    </header>
  );
}
