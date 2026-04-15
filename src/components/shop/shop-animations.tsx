"use client";

import { gsap, ScrollTrigger } from "@/lib/gsap-config";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { useScrollTriggerReady } from "@/components/providers/scroll-trigger-environment";

/**
 * Shop hero: SplitText heading, ScrambleText kicker, count slide-in, DrawSVG accent on scroll.
 * Renders no DOM — targets live in `shop/page.tsx`.
 */
export function ShopAnimations() {
  const scrollTriggerReady = useScrollTriggerReady();

  useGSAP(
    () => {
      if (!scrollTriggerReady) return;

      const splitInstances: SplitText[] = [];
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          normal: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const reduceMotion = Boolean(context.conditions?.reduceMotion);

          const heading = document.querySelector("[data-shop-heading]") as HTMLElement | null;
          const kicker = document.querySelector("[data-shop-kicker]") as HTMLElement | null;
          const count = document.querySelector("[data-shop-count]") as HTMLElement | null;
          const accentLines = gsap.utils.toArray<SVGLineElement>("[data-drawsvg-shop-accent] line");

          if (reduceMotion) {
            if (heading) gsap.set(heading, { autoAlpha: 1, clearProps: "all" });
            if (kicker) gsap.set(kicker, { autoAlpha: 1, clearProps: "all" });
            if (count) gsap.set(count, { autoAlpha: 1, clearProps: "all" });
            if (accentLines.length) gsap.set(accentLines, { drawSVG: "100%", autoAlpha: 1 });
            return;
          }

          if (accentLines.length) gsap.set(accentLines, { drawSVG: "0%" });

          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          if (kicker) {
            const originalText = kicker.textContent ?? "";
            gsap.set(kicker, { autoAlpha: 1 });
            try {
              tl.to(
                kicker,
                {
                  duration: 0.9,
                  scrambleText: {
                    text: originalText,
                    chars: "upperCase",
                    revealDelay: 0.1,
                    speed: 0.35,
                  },
                },
                0,
              );
            } catch {
              tl.fromTo(kicker, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 0);
            }
          }

          if (heading) {
            try {
              const split = SplitText.create(heading, {
                type: "chars",
                charsClass: "shop-hero-char",
              });
              splitInstances.push(split);
              gsap.set(heading, { autoAlpha: 1 });
              gsap.set(split.chars, { autoAlpha: 0 });
              tl.fromTo(
                split.chars,
                { y: 40, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.04 },
                0.12,
              );
            } catch {
              tl.fromTo(
                heading,
                { y: 40, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.8 },
                0.12,
              );
            }
          }

          if (count) {
            gsap.set(count, { autoAlpha: 0 });
            tl.fromTo(count, { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.55, ease: "power2.out" }, 0.6);
          }

          ScrollTrigger.batch("[data-drawsvg-shop-accent] line", {
            once: true,
            start: "top 90%",
            onEnter: (elements) => {
              gsap.fromTo(elements, { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.2, ease: "none" });
            },
          });
        },
      );

      return () => {
        splitInstances.forEach((s) => s.revert());
        mm.revert();
      };
    },
    { dependencies: [scrollTriggerReady] },
  );

  return null;
}
