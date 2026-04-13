"use client";

import * as React from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-config";
import { useGSAP } from "@gsap/react";
import { useScrollTriggerReady } from "@/components/providers/scroll-trigger-environment";

type PageScrollAnimationsProps = {
  children: React.ReactNode;
  config: "about" | "shop" | "contact";
};

export function PageScrollAnimations({ children, config }: PageScrollAnimationsProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const scrollTriggerReady = useScrollTriggerReady();

  useGSAP(() => {
    if (!scrollTriggerReady) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        normal: "(prefers-reduced-motion: no-preference)",
      },
      (context: any) => {
        const { reduceMotion } = context.conditions as { reduceMotion: boolean };

        const targetSelector = "[data-animate-item], [data-animate-heading]";

        if (reduceMotion) {
          gsap.set(targetSelector, { autoAlpha: 1 });
          return;
        }

        // Hide initially
        gsap.set(targetSelector, { autoAlpha: 0, y: 30 });

        ScrollTrigger.batch(targetSelector, {
          start: "top 90%",
          onEnter: (elements: Element[]) => {
            gsap.to(
              elements,
              { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.1, ease: "power2.out", overwrite: true }
            );
          },
          once: true,
        });
      }
    );

    return () => mm.revert();
  }, { scope: rootRef, dependencies: [config, scrollTriggerReady] });

  return <div ref={rootRef}>{children}</div>;
}
