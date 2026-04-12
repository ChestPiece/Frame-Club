"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

type PageScrollAnimationsProps = {
  children: React.ReactNode;
  config: "about" | "shop" | "contact";
};

export function PageScrollAnimations({ children, config }: PageScrollAnimationsProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
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
  }, { scope: rootRef, dependencies: [config] });

  return <div ref={rootRef}>{children}</div>;
}
