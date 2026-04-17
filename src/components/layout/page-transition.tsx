"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { gsap } from "@/lib/animation/gsap-config";

type TransitionContextValue = {
  startTransition: (href: string) => void;
};

const TransitionContext = React.createContext<TransitionContextValue>({
  startTransition: (href) => {
    window.location.href = href;
  },
});

export function usePageTransition() {
  return React.useContext(TransitionContext);
}

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const enteringRef = React.useRef(false);

  const startTransition = React.useCallback(
    (href: string) => {
      if (href === pathname) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        router.push(href);
        return;
      }

      const overlay = overlayRef.current;
      if (!overlay) return;

      gsap.killTweensOf(overlay);

      gsap.fromTo(
        overlay,
        { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" },
        {
          clipPath: "polygon(0 0, 110% 0, 110% 100%, 0 100%)",
          duration: 0.45,
          ease: "power4.inOut",
          onComplete: () => {
            enteringRef.current = true;
            router.push(href);
          },
        },
      );
    },
    [pathname, router],
  );

  // Enter: panel exits to the right when new pathname resolves
  React.useEffect(() => {
    if (!enteringRef.current) return;
    enteringRef.current = false;

    const overlay = overlayRef.current;
    if (!overlay) return;

    gsap.killTweensOf(overlay);

    gsap.to(overlay, {
      clipPath: "polygon(110% 0, 110% 0, 110% 100%, 110% 100%)",
      duration: 0.45,
      ease: "power4.inOut",
      onComplete: () => {
        gsap.set(overlay, {
          clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)",
        });
      },
    });
  }, [pathname]);

  return (
    <TransitionContext.Provider value={{ startTransition }}>
      {/* z-80 (theme): below fullscreen nav (z-90) and loader (z-100), above everything else */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-80 bg-brand pointer-events-none"
        style={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" }}
        aria-hidden="true"
      />
      {children}
    </TransitionContext.Provider>
  );
}

type TransitionLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

export const TransitionLink = React.forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  ({ href, children, className, onClick, ...props }, ref) => {
    const { startTransition } = React.useContext(TransitionContext);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);
      if (e.defaultPrevented) return;

      if (e.button !== 0) return;
      // Let browser handle modifier-key clicks (new tab, etc.)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (props.download) return;
      if (props.target && props.target !== "_self") return;
      // Only intercept app-internal routes and let anchors/external URLs behave natively.
      if (!href.startsWith("/")) return;

      const targetUrl = new URL(href, window.location.origin);
      if (targetUrl.origin !== window.location.origin) return;

      const currentPath = window.location.pathname;
      const currentSearch = window.location.search;
      const isSamePath = targetUrl.pathname === currentPath;
      const isSameSearch = targetUrl.search === currentSearch;

      // Same-page hash anchors should keep default browser/handler scrolling behavior.
      if (isSamePath && isSameSearch && targetUrl.hash.length > 0) {
        return;
      }

      e.preventDefault();
      startTransition(`${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`);
    };

    return (
      <a ref={ref} href={href} onClick={handleClick} className={className} {...props}>
        {children}
      </a>
    );
  },
);

TransitionLink.displayName = "TransitionLink";
