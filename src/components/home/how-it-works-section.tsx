"use client";

import { useRef, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import { useScrollTriggerReady } from "@/components/providers/scroll-trigger-environment";

const steps = [
  {
    label: "PICK YOUR CAR",
    description: "Select from available models or request your preferred car.",
  },
  {
    label: "CUSTOMISE IT",
    description:
      "Choose your background style and share notes for the build.",
  },
  {
    label: "WE BUILD & SHIP",
    description:
      "We source, build, and ship your frame nationwide across Pakistan.",
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

      gsap.fromTo(
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
        }
      );
    },
    { scope: sectionRef, dependencies: [scrollTriggerReady] }
  );

  return (
    <div ref={sectionRef}>
      <div className="mb-14 flex flex-wrap items-end justify-between gap-4">
        <h2 className="display-kicker text-5xl leading-tight md:text-7xl">
          THREE STEPS. ONE FRAME. DELIVERED TO YOUR DOOR.
        </h2>
        <p className="technical-label text-[10px] text-text-muted uppercase tracking-[0.3em]">
          Three Steps to Perfection
        </p>
      </div>

      <div className="grid gap-0 md:grid-cols-3">
        {steps.map((step, index) => (
          <article
            key={step.label}
            ref={(el) => setCardRef(el, index)}
            onMouseEnter={() => handleCardEnter(index)}
            onMouseLeave={() => handleCardLeave(index)}
            className={`relative min-h-[280px] md:min-h-0 md:aspect-square overflow-hidden border border-border-dark/30 p-8 md:p-10 flex flex-col justify-end group ${
              index === 1
                ? "bg-bg-elevated border-t-2 border-t-brand"
                : "bg-[#1A1614]"
            }`}
            style={{ opacity: 0 }}
          >
            <div
              ref={(el) => setGhostRef(el, index)}
              className="absolute -top-6 -left-2 text-[160px] md:text-[200px] leading-none display-kicker text-text-primary select-none pointer-events-none"
              style={{ opacity: 0.03 }}
            >
              0{index + 1}
            </div>
            <div className="relative z-10 mt-auto">
              <h3 className="display-kicker mb-4 text-3xl leading-none">
                {step.label}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {step.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
