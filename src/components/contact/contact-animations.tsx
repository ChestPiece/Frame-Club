"use client";

import { gsap } from "@/lib/gsap-config";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { useScrollTriggerReady } from "@/components/providers/scroll-trigger-environment";

/**
 * Contact split hero: heading SplitText, kicker + channel ScrambleText, vertical DrawSVG divider.
 */
export function ContactAnimations() {
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

          const heading = document.querySelector("[data-contact-heading]") as HTMLElement | null;
          const kicker = document.querySelector("[data-contact-kicker]") as HTMLElement | null;
          const dividerLines = gsap.utils.toArray<SVGLineElement>("[data-drawsvg-contact-divider] line");
          const channelLabels = gsap.utils.toArray<HTMLElement>("[data-channel-label]");

          if (reduceMotion) {
            if (heading) gsap.set(heading, { autoAlpha: 1, clearProps: "all" });
            if (kicker) gsap.set(kicker, { autoAlpha: 1, clearProps: "all" });
            channelLabels.forEach((el) => gsap.set(el, { autoAlpha: 1, clearProps: "all" }));
            if (dividerLines.length) gsap.set(dividerLines, { drawSVG: "100%", autoAlpha: 1 });
            return;
          }

          if (dividerLines.length) gsap.set(dividerLines, { drawSVG: "0%" });

          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          if (kicker) {
            const originalText = kicker.textContent ?? "";
            gsap.set(kicker, { autoAlpha: 1 });
            try {
              tl.to(
                kicker,
                {
                  duration: 0.75,
                  scrambleText: {
                    text: originalText,
                    chars: "upperCase",
                    revealDelay: 0.06,
                    speed: 0.32,
                  },
                },
                0,
              );
            } catch {
              tl.fromTo(kicker, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35 }, 0);
            }
          }

          channelLabels.forEach((label, index) => {
            const text = label.textContent ?? "";
            gsap.set(label, { autoAlpha: 1 });
            try {
              tl.to(
                label,
                {
                  duration: 0.65,
                  scrambleText: {
                    text,
                    chars: "upperCase",
                    revealDelay: 0.05,
                    speed: 0.28,
                  },
                },
                0.25 + index * 0.2,
              );
            } catch {
              tl.fromTo(label, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.25 + index * 0.2);
            }
          });

          if (heading) {
            try {
              const split = SplitText.create(heading, {
                type: "chars",
                charsClass: "contact-hero-char",
              });
              splitInstances.push(split);
              gsap.set(heading, { autoAlpha: 1 });
              gsap.set(split.chars, { autoAlpha: 0 });
              tl.fromTo(
                split.chars,
                { y: 50, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.85, stagger: 0.03 },
                0.08,
              );
            } catch {
              tl.fromTo(
                heading,
                { y: 50, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.85 },
                0.08,
              );
            }
          }

          if (dividerLines.length) {
            tl.fromTo(
              dividerLines,
              { drawSVG: "0%" },
              { drawSVG: "100%", duration: 1.4, ease: "none" },
              0.5,
            );
          }
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
