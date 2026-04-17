"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/animation/gsap-config";
import { useScrollTriggerReady } from "@/components/providers/scroll-trigger-environment";

export function WhatIsThisSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const scrollTriggerReady = useScrollTriggerReady();

  useGSAP(
    () => {
      if (!scrollTriggerReady) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        if (headlineRef.current) {
          gsap.set(headlineRef.current, { yPercent: 0, clearProps: "transform" });
        }
        return () => {};
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const inner = gsap.matchMedia();
        inner.add("(min-width: 768px)", () => {
          const tween = gsap.to(headlineRef.current, {
            yPercent: -15,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 1.5,
            },
          });

          return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
          };
        });
        return () => inner.revert();
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [scrollTriggerReady] },
  );

  return (
    <div ref={sectionRef} className="frame-container grid gap-10 md:gap-12 md:grid-cols-[1fr_1.5fr]">
      <div className="md:sticky md:top-32 md:self-start relative pl-4 min-w-0">
        <svg
          aria-hidden="true"
          data-drawsvg-vert
          className="absolute left-0 top-0 h-full w-px"
          viewBox="0 0 1 100"
          preserveAspectRatio="none"
        >
          <line x1="0.5" y1="0" x2="0.5" y2="100" stroke="var(--brand)" strokeWidth="1" />
        </svg>
        <h2 ref={headlineRef} className="display-kicker text-3xl leading-none sm:text-4xl md:text-5xl">
          NOT A POSTER.
          <br />
          NOT A TOY.
          <br />
          <span className="text-brand-bright">SOMETHING BETTER.</span>
        </h2>
      </div>

      <div className="space-y-10 md:space-y-12 text-text-muted min-w-0">
        <div data-animate-item className="space-y-6 text-sm sm:text-base leading-relaxed">
          <p>
            Every frame is built to order around your selected car and your chosen background design. No warehouse
            stock, no random variants, and no shortcuts.
          </p>
          <p>
            Each unit is sourced, assembled, and finished by hand. The website captures your request, then production
            starts.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 pt-2 md:pt-4">
          <article data-animate-item className="flex items-start gap-4 sm:gap-6">
            <span className="display-kicker text-3xl sm:text-4xl text-brand shrink-0">01</span>
            <div className="min-w-0">
              <h3 className="display-kicker text-xl sm:text-2xl mb-2 text-text-primary">ARCHIVAL PROTECTION</h3>
              <p className="text-sm leading-relaxed text-text-muted">
                Museum-style framing, archival mounting, and clean typography built for long-term display.
              </p>
            </div>
          </article>

          <article data-animate-item className="flex items-start gap-4 sm:gap-6">
            <span className="display-kicker text-3xl sm:text-4xl text-brand shrink-0">02</span>
            <div className="min-w-0">
              <h3 className="display-kicker text-xl sm:text-2xl mb-2 text-text-primary">HANDCRAFTED PROCESS</h3>
              <p className="text-sm leading-relaxed text-text-muted">
                Built manually for each order, from model sourcing to final sealing and shipping prep.
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
