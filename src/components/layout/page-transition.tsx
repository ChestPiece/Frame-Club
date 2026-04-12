"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap-config";

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

      // Leave: brand-red panel sweeps in from left edge
      gsap.fromTo(
        overlayRef.current,
        { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" },
        {
          clipPath: "polygon(0 0, 110% 0, 110% 100%, 0 100%)",
          duration: 0.45,
          ease: "power4.inOut",
          onComplete: () => {
            enteringRef.current = true;
            router.push(href);
          },
        }
      );
    },
    [pathname, router]
  );

  // Enter: panel exits to the right when new pathname resolves
  React.useEffect(() => {
    if (!enteringRef.current) return;
    enteringRef.current = false;

    gsap.to(overlayRef.current, {
      clipPath: "polygon(110% 0, 110% 0, 110% 100%, 110% 100%)",
      duration: 0.45,
      ease: "power4.inOut",
      onComplete: () => {
        gsap.set(overlayRef.current, {
          clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)",
        });
      },
    });
  }, [pathname]);

  return (
    <TransitionContext.Provider value={{ startTransition }}>
      {/* z-[80]: below fullscreen nav (z-90) and loader (z-100), above everything else */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[80] bg-brand pointer-events-none"
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

export function TransitionLink({ href, children, className, onClick, ...props }: TransitionLinkProps) {
  const { startTransition } = React.useContext(TransitionContext);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Let browser handle modifier-key clicks (new tab, etc.)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    // Only intercept internal routes
    if (!href.startsWith("/")) return;
    e.preventDefault();
    onClick?.(e);
    startTransition(href);
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
}
