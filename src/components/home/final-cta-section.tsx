"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/animation/gsap-config";
import { useScrollTriggerReady } from "@/components/providers/scroll-trigger-environment";
import { TransitionLink } from "@/components/layout/page-transition";
import { Button } from "@/components/ui/button";
import { COPY } from "@/lib/content/copy-constants";

const headlineWords = ["READY", "TO", "FRAME", "YOUR", "OBSESSION?"];

export function FinalCTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const scrollTriggerReady = useScrollTriggerReady();

  useGSAP(
    () => {
      if (!scrollTriggerReady) return;

      const words = headlineRef.current?.querySelectorAll("[data-word]");
      if (!words || words.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(Array.from(words), { opacity: 1, y: 0, clearProps: "all" });
        return () => {};
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          Array.from(words),
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: headlineRef.current,
              start: "top 80%",
              once: true,
            },
          },
        );
        return () => {};
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [scrollTriggerReady] },
  );

  return (
    <div ref={sectionRef} className="frame-container relative z-10 text-center px-1">
      <h2
        ref={headlineRef}
        className="display-kicker text-3xl sm:text-4xl md:text-5xl mb-8 md:mb-10 tracking-tighter flex flex-wrap justify-center gap-x-[0.2em] sm:gap-x-[0.25em] gap-y-1 max-w-full"
      >
        {headlineWords.map((word) => (
          <span key={word} data-word data-motion-reveal className="inline-block" style={{ opacity: 0 }}>
            {word}
          </span>
        ))}
      </h2>

      <p className="mx-auto mt-5 max-w-2xl text-sm sm:text-base text-text-muted mb-8 md:mb-10 px-2 leading-relaxed">
        Fully customised frames, priced per model in the collection. Delivered nationwide. Takes 2 minutes to order.
      </p>
      <svg
        aria-hidden="true"
        data-drawsvg-cta
        className="w-24 h-px mx-auto mb-8 block max-w-[min(100%,6rem)]"
        viewBox="0 0 96 1"
        preserveAspectRatio="none"
      >
        <line x1="0" y1="0.5" x2="96" y2="0.5" stroke="var(--brand-mid)" strokeWidth="1" />
      </svg>

      <Button
        render={<TransitionLink href="/shop" />}
        variant="outline"
        className="relative inline-flex overflow-hidden display-kicker text-lg sm:text-xl md:text-2xl tracking-[0.14em] sm:tracking-[0.2em] w-full max-w-md md:max-w-none md:w-auto px-6 sm:px-10 md:px-16 py-4 md:py-6 border-2 border-border bg-bg-surface text-text-primary hover:bg-bg-elevated transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand-bright focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep"
      >
        <span
          ref={fillRef}
          data-button-fill="true"
          aria-hidden="true"
          className="absolute inset-0 bg-text-primary pointer-events-none"
          style={{ transform: "scaleX(0)", transformOrigin: "0% 50%" }}
        />
        <span className="relative z-10 mix-blend-difference">ORDER NOW</span>
      </Button>

      <p className="mt-10 md:mt-12 text-xs sm:text-sm uppercase tracking-[0.12em] sm:tracking-[0.2em] text-text-muted display-kicker px-2 leading-relaxed">
        {COPY.trustLine}
      </p>
    </div>
  );
}
