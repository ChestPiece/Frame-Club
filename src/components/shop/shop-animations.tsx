"use client";

import { gsap, ScrollTrigger } from "@/lib/animation/gsap-config";
import { useGSAP } from "@gsap/react";
import { useScrollTriggerReady } from "@/components/providers/scroll-trigger-environment";
import {
  isScrollSmootherEnabled,
  scrollSmootherMatchMediaQuery,
} from "@/lib/animation/scroll-layout";

type ShopAnimationsProps = {
  /** When catalog results change, pin/triggers recompute. */
  layoutKey?: string;
};

export function ShopAnimations({ layoutKey = "" }: ShopAnimationsProps) {
  const scrollTriggerReady = useScrollTriggerReady();

  useGSAP(
    () => {
      if (!scrollTriggerReady) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          smootherViewport: scrollSmootherMatchMediaQuery,
        },
        (context) => {
          const reduceMotion = Boolean(context.conditions?.reduceMotion);
          const smootherViewport = Boolean(context.conditions?.smootherViewport);

          const grid = document.querySelector("[data-shop-grid]") as HTMLElement | null;
          if (!grid) return;

          if (reduceMotion) {
            ScrollTrigger.refresh();
            return;
          }

          // Pin only when ScrollSmoother is active — avoids touch-scroll + pin issues below 1024px.
          if (!smootherViewport || !isScrollSmootherEnabled()) {
            return;
          }

          ScrollTrigger.create({
            id: "shop-grid-pin-stabilizer",
            trigger: grid,
            start: "top top+=80",
            end: "+=1",
            pin: true,
            pinSpacing: false,
          });

          ScrollTrigger.refresh();
        },
      );

      return () => {
        mm.revert();
      };
    },
    { dependencies: [scrollTriggerReady, layoutKey] },
  );

  return null;
}
