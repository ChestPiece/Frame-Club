"use client";

import { useRef, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import { useScrollTriggerReady } from "@/components/providers/scroll-trigger-environment";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const steps = [
  {
    label: "PICK YOUR CAR",
    description: "Select from available models or request your preferred car.",
  },
  {
    label: "CUSTOMISE IT",
    description: "Choose your background style and share notes for the build.",
  },
  {
    label: "WE BUILD & SHIP",
    description: "We source, build, and ship your frame nationwide across Pakistan.",
  },
];

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLElement[]>([]);
  const ghostRefs = useRef<HTMLDivElement[]>([]);
  const scrollTriggerReady = useScrollTriggerReady();

  const setCardRef = useCallback((el: HTMLElement | null, index: number) => {
    if (el) cardRefs.current[index] = el;
  }, []);

  const setGhostRef = useCallback((el: HTMLDivElement | null, index: number) => {
    if (el) ghostRefs.current[index] = el;
  }, []);

  const handleCardEnter = useCallback((index: number) => {
    const ghost = ghostRefs.current[index];
    if (!ghost) return;
    gsap.killTweensOf(ghost);
    gsap.to(ghost, {
      opacity: 0.07,
      scale: 1.04,
      duration: 0.35,
      ease: "expo.out",
    });
  }, []);

  const handleCardLeave = useCallback((index: number) => {
    const ghost = ghostRefs.current[index];
    if (!ghost) return;
    gsap.killTweensOf(ghost);
    gsap.to(ghost, {
      opacity: 0.03,
      scale: 1,
      duration: 0.3,
      ease: "expo.in",
    });
  }, []);

  useGSAP(
    () => {
      if (!scrollTriggerReady || cardRefs.current.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(cardRefs.current.filter(Boolean), { opacity: 1, y: 0, clearProps: "all" });
        return () => {};
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tween = gsap.fromTo(
          cardRefs.current,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              once: true,
            },
          },
        );
        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [scrollTriggerReady] },
  );

  return (
    <div ref={sectionRef}>
      <div className="mb-10 md:mb-14 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <h2 className="display-kicker text-3xl leading-tight sm:text-4xl md:text-5xl max-w-full">
          THREE STEPS. ONE FRAME. DELIVERED TO YOUR DOOR.
        </h2>
        <p className="technical-label text-xs sm:text-[11px] text-text-muted uppercase tracking-[0.14em] sm:tracking-[0.22em] shrink-0">
          Three Steps to Perfection
        </p>
      </div>
      <Separator className="mb-8 bg-border/40" />

      <div className="grid gap-0 md:grid-cols-3">
        {steps.map((step, index) => (
          <Card
            key={step.label}
            ref={(el) => setCardRef(el, index)}
            data-motion-reveal
            onMouseEnter={() => handleCardEnter(index)}
            onMouseLeave={() => handleCardLeave(index)}
            onFocus={() => handleCardEnter(index)}
            onBlur={() => handleCardLeave(index)}
            tabIndex={0}
            className={`relative min-h-[260px] sm:min-h-[280px] md:min-h-0 md:aspect-square overflow-hidden border border-border/30 flex flex-col justify-end outline-none focus-visible:ring-2 focus-visible:ring-brand-mid focus-visible:ring-inset ${
              index === 1 ? "bg-bg-elevated border-t-2 border-t-brand" : "bg-bg-surface"
            }`}
            style={{ opacity: 0 }}
          >
            <div
              ref={(el) => setGhostRef(el, index)}
              className="absolute -top-6 -left-2 text-[clamp(4rem,18vw,10rem)] md:text-[160px] lg:text-[200px] leading-none display-kicker text-text-primary select-none pointer-events-none"
              style={{ opacity: 0.03 }}
            >
              0{index + 1}
            </div>
            <CardContent className="p-6 md:p-8 flex flex-col justify-end h-full relative z-10 mt-auto">
              <h3 className="display-kicker mb-3 md:mb-4 text-lg sm:text-xl leading-none">{step.label}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
