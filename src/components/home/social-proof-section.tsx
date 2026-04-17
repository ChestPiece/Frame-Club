"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/animation/gsap-config";
import { useScrollTriggerReady } from "@/components/providers/scroll-trigger-environment";
import { Card, CardContent } from "@/components/ui/card";
import { COPY } from "@/lib/content/copy-constants";

const proofPoints = [
  {
    title: "REAL ORDERS",
    body: "50+ frames fulfilled through Instagram before this site. Same maker, same standard.",
  },
  {
    title: "NATIONWIDE",
    body: "Built to order and shipped across Pakistan. No warehouse stock.",
  },
  {
    title: "DIRECT LINE",
    body: "Still on Instagram — see builds and updates at @frameclub__.",
    href: "https://instagram.com/frameclub__",
    hrefLabel: "OPEN INSTAGRAM",
  },
] as const;

export function SocialProofSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const counterSpanRef = useRef<HTMLSpanElement>(null);
  const cardRefs = useRef<HTMLElement[]>([]);
  const scrollTriggerReady = useScrollTriggerReady();

  const setCardRef = (el: HTMLElement | null, index: number) => {
    if (el) cardRefs.current[index] = el;
  };

  useGSAP(
    () => {
      if (!scrollTriggerReady) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        if (counterSpanRef.current) {
          counterSpanRef.current.textContent = "50+";
        }
        gsap.set(cardRefs.current.filter(Boolean), {
          autoAlpha: 1,
          clipPath: "none",
          clearProps: "all",
        });
        return () => {};
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (counterSpanRef.current) {
          const counter = { value: 0 };
          gsap.to(counter, {
            value: 50,
            duration: 1.8,
            ease: "expo.out",
            onUpdate: () => {
              if (counterSpanRef.current) {
                counterSpanRef.current.textContent = Math.round(counter.value) + "+";
              }
            },
            scrollTrigger: {
              trigger: counterSpanRef.current,
              start: "top 80%",
              once: true,
            },
          });
        }

        if (cardRefs.current.length > 0) {
          gsap.fromTo(
            cardRefs.current,
            { clipPath: "inset(0% 100% 0% 0%)", opacity: 0 },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              opacity: 1,
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.18,
              scrollTrigger: {
                trigger: gridRef.current,
                start: "top 78%",
                once: true,
              },
            },
          );
        }

        return () => {};
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [scrollTriggerReady] },
  );

  return (
    <div ref={sectionRef}>
      <h2 className="display-kicker text-3xl leading-tight sm:text-4xl md:text-5xl mb-10 md:mb-12">
        <span ref={counterSpanRef}>50+</span> FRAMES DELIVERED.
        <br />
        <span className="text-brand-bright">ZERO COMPLAINTS.</span>
      </h2>

      <div ref={gridRef} className="grid gap-6 sm:gap-8 md:grid-cols-3">
        {proofPoints.map((item, index) => (
          <Card
            key={item.title}
            ref={(el) => setCardRef(el, index)}
            data-motion-reveal
            className="relative overflow-hidden border border-border/30 bg-bg-elevated"
            style={{ opacity: 0 }}
          >
            <CardContent className="flex flex-col gap-4 p-6 md:p-7 relative z-10">
              <h3 className="display-kicker text-lg md:text-xl text-text-primary">{item.title}</h3>
              <p className="text-sm md:text-base leading-relaxed text-text-muted">{item.body}</p>
              {"href" in item && item.href != null ? (
                <Link
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="technical-label mt-auto text-xs text-brand-bright underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-brand-bright focus-visible:outline-offset-2"
                >
                  {item.hrefLabel}
                </Link>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mt-10 md:mt-12 text-center technical-label text-xs sm:text-sm text-text-muted tracking-[0.12em] sm:tracking-[0.18em] max-w-3xl mx-auto leading-relaxed">
        {COPY.trustLine}
      </p>
    </div>
  );
}
