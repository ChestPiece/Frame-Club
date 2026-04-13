"use client";

import * as React from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-config";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

type HomeAnimationsProps = {
  children: React.ReactNode;
};

const HIDE_TARGETS = "[data-animate-section]:not([data-animate-section='hero']), [data-animate-item]";
const REVEAL_TARGETS = "[data-animate-section], [data-animate-item]";
const HERO_REVEAL_TARGETS =
  "[data-animate='hero-accent'], [data-animate='hero-label'], [data-animate='hero-heading'], [data-animate='hero-subcopy'], [data-animate='hero-cta'], [data-animate='hero-image']";

export function HomeAnimations({ children }: HomeAnimationsProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const splitInstances: SplitText[] = [];
    const revealAllTargets = (targets: string = `${REVEAL_TARGETS}, ${HERO_REVEAL_TARGETS}`) => {
      gsap.set(targets, { autoAlpha: 1, y: 0, clearProps: "opacity,visibility,transform" });
    };

    mm.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        normal: "(prefers-reduced-motion: no-preference)",
      },
      (context: any) => {
        const { reduceMotion } = context.conditions as { reduceMotion: boolean };

        if (reduceMotion) {
          revealAllTargets();
          return;
        }

        let safetyTimer: ReturnType<typeof setTimeout> | null = null;

        try {
          gsap.registerPlugin(ScrambleTextPlugin, SplitText);

          // 1. Hero Animations
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          tl.fromTo(
            '[data-animate="hero-accent"]',
            { width: 0, autoAlpha: 0 },
            { width: 96, autoAlpha: 1, duration: 0.8, delay: 0.2 }
          );

          tl.fromTo(
            '[data-animate="hero-label"]',
            { y: 10, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.6 },
            "-=0.4"
          );

          const heroLabel = document.querySelector('[data-animate="hero-label"]') as HTMLElement | null;
          if (heroLabel) {
            const originalText = heroLabel.textContent ?? "";
            try {
              tl.to(
                heroLabel,
                {
                  duration: 0.9,
                  scrambleText: {
                    text: originalText,
                    chars: "upperCase",
                    revealDelay: 0.1,
                    speed: 0.35,
                  },
                },
                "-=0.2"
              );
            } catch {
              tl.to(heroLabel, { autoAlpha: 1, y: 0, duration: 0.3 }, "-=0.2");
            }
          }

          const heading = document.querySelector('[data-animate="hero-heading"]') as HTMLElement | null;
          if (heading) {
            try {
              const split = SplitText.create(heading, {
                type: "chars",
                charsClass: "hero-char",
              });
              splitInstances.push(split);

              gsap.set(heading, { autoAlpha: 1 });
              gsap.set(split.chars, { autoAlpha: 0 });
              tl.fromTo(
                split.chars,
                { y: 30, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.02 },
                "-=0.4"
              );
            } catch {
              tl.fromTo(heading, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8 }, "-=0.4");
            }
          }

          tl.fromTo(
            '[data-animate="hero-subcopy"], [data-animate="hero-cta"]',
            { y: 20, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.1 },
            "-=0.6"
          );

          tl.fromTo(
            '[data-animate="hero-image"]',
            { x: 60, autoAlpha: 0 },
            { x: 0, autoAlpha: 1, duration: 1.2, ease: "power2.out" },
            "-=1"
          );

          // 2. ScrollTrigger.batch for Sections
          ScrollTrigger.batch("[data-animate-section]:not([data-animate-section='hero'])", {
            start: "top 85%",
            onEnter: (elements: Element[]) => {
              gsap.to(
                elements,
                { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.15, ease: "power2.out", overwrite: true }
              );
            },
            once: true,
          });

          // 3. ScrollTrigger.batch for Items
          ScrollTrigger.batch("[data-animate-item]", {
            start: "top 90%",
            onEnter: (elements: Element[]) => {
              gsap.to(
                elements,
                { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.12, ease: "power2.out", overwrite: true }
              );
            },
            once: true,
          });

          // Hide only after trigger setup succeeds to avoid dead hidden states.
          gsap.set(HIDE_TARGETS, { autoAlpha: 0, y: 40 });

          // 4. Parallax
          const parallaxElements = gsap.utils.toArray("[data-speed]") as HTMLElement[];
          parallaxElements.forEach((el) => {
            const speed = parseFloat(el.getAttribute("data-speed") || "1");
            gsap.to(el, {
              y: () => -100 * speed,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            });
          });

          ScrollTrigger.refresh();

          safetyTimer = setTimeout(() => {
            const hiddenSections = gsap.utils.toArray(HIDE_TARGETS).filter((target) => {
              if (!(target instanceof HTMLElement)) return false;
              const styles = window.getComputedStyle(target);
              return styles.visibility === "hidden" || Number.parseFloat(styles.opacity) < 0.05;
            }) as HTMLElement[];

            if (hiddenSections.length > 0) {
              gsap.set(hiddenSections, {
                autoAlpha: 1,
                y: 0,
                clearProps: "opacity,visibility,transform",
              });
            }
          }, 2000);
        } catch {
          revealAllTargets();
        }

        return () => {
          if (safetyTimer) clearTimeout(safetyTimer);
        };
      }
    );

    return () => {
      splitInstances.forEach((instance) => instance.revert());
      mm.revert();
    };
  }, { scope: rootRef });

  return <div ref={rootRef}>{children}</div>;
}
