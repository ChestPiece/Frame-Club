"use client";

import { gsap, ScrollTrigger } from "@/lib/animation/gsap-config";
import { useGSAP } from "@gsap/react";
import { useScrollTriggerReady } from "@/components/providers/scroll-trigger-environment";

export function ShopAnimations() {
  const scrollTriggerReady = useScrollTriggerReady();

  useGSAP(
    () => {
      if (!scrollTriggerReady) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          normal: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const reduceMotion = Boolean(context.conditions?.reduceMotion);

          const grid = document.querySelector("[data-shop-grid]") as HTMLElement | null;
          if (!grid) return;

          if (reduceMotion) {
            ScrollTrigger.refresh();
            return;
          }

          // Pinning through ScrollTrigger avoids sticky inconsistencies with ScrollSmoother transforms.
          ScrollTrigger.create({
            id: "shop-grid-pin-stabilizer",
            trigger: grid,
            start: "top top+=80",
            end: "+=1",
            pin: true,
            pinSpacing: false,
          });
        },
      );

      return () => {
        mm.revert();
      };
    },
    { dependencies: [scrollTriggerReady] },
  );

  return null;
}
