"use client";

import * as React from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import { SITE_LOADER_DONE_EVENT } from "@/components/layout/site-loader";

const SITE_LOADER_DONE_FLAG = "__frameClubLoaderDone";
const APP_REVEAL_FALLBACK_MS = 3000;

declare global {
  interface Window {
    __frameClubLoaderDone?: boolean;
  }
}

export function AppReveal({ children }: { children: React.ReactNode }) {
  const rootRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = rootRef.current;
      if (!el || typeof window === "undefined") return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(el, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(el, { autoAlpha: 0, y: 18 });

      let done = false;
      let fallbackTimer: ReturnType<typeof setTimeout> | null = null;

      const reveal = () => {
        if (done) return;
        done = true;
        if (fallbackTimer) {
          clearTimeout(fallbackTimer);
          fallbackTimer = null;
        }
        gsap.to(el, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          clearProps: "transform,opacity,visibility",
        });
      };

      const onLoaderDone = () => {
        reveal();
      };

      if (window[SITE_LOADER_DONE_FLAG]) {
        reveal();
        return;
      }

      window.addEventListener(SITE_LOADER_DONE_EVENT, onLoaderDone, { once: true });
      fallbackTimer = setTimeout(reveal, APP_REVEAL_FALLBACK_MS);

      return () => {
        if (fallbackTimer) {
          clearTimeout(fallbackTimer);
          fallbackTimer = null;
        }
        window.removeEventListener(SITE_LOADER_DONE_EVENT, onLoaderDone);
      };
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className="will-change-transform">
      {children}
    </div>
  );
}
