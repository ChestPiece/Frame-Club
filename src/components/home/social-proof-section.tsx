"use client";

import { useRef, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import { animate } from "animejs";
import { gsap, ScrollTrigger } from "@/lib/gsap-config";
import { useScrollAnimate } from "@/hooks/use-scroll-animate";


type Testimonial = {
  quote: string;
  author: string;
};

type SocialProofSectionProps = {
  testimonials: Testimonial[];
};

export function SocialProofSection({ testimonials }: SocialProofSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const counterSpanRef = useRef<HTMLSpanElement>(null);
  const cardRefs = useRef<HTMLElement[]>([]);

  const setCardRef = (el: HTMLElement | null, index: number) => {
    if (el) cardRefs.current[index] = el;
  };

  // Counter animation fires when stat enters viewport
  const counterAnimateFn = useCallback(
    (el: HTMLElement) => {
      const span = el.querySelector("[data-counter]") as HTMLElement;
      if (!span) return;
      const target = { value: 0 };
      animate(target, {
        value: 50,
        duration: 1800,
        ease: "outExpo",
        onUpdate: () => {
          span.textContent = Math.round(target.value) + "+";
        },
      });
    },
    [],
  );

  const counterRef = useScrollAnimate(counterAnimateFn, { threshold: 0.5 });

  // Testimonial left-sweep clip wipe
  useGSAP(
    () => {
      if (cardRefs.current.length === 0) return;

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
    },
    { scope: sectionRef },
  );

  return (
    <div ref={sectionRef}>
      <div ref={counterRef as React.RefObject<HTMLDivElement>}>
        <h2 className="display-kicker text-5xl leading-none md:text-7xl mb-16">
          <span data-counter>50+</span> FRAMES DELIVERED.
          <br />
          <span className="text-[#ffb3af]">ZERO COMPLAINTS.</span>
        </h2>
      </div>

      <div ref={gridRef} className="grid gap-8 md:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <article
            key={testimonial.quote}
            ref={(el) => setCardRef(el, index)}
            className="border-l-4 border-brand bg-[#1A1614] p-10 flex flex-col gap-8 relative overflow-hidden"
            style={{ opacity: 0 }}
          >
            <div className="absolute -top-8 left-2 text-[200px] leading-none opacity-5 display-kicker text-text-primary select-none pointer-events-none">
              &ldquo;
            </div>

            <p className="text-lg italic font-light text-text-primary relative z-10">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
            <p className="technical-label mt-auto text-[11px] text-text-muted uppercase tracking-widest relative z-10">
              — {testimonial.author.split(",")[0]}{" "}
              <span className="text-brand mx-1">●</span>{" "}
              {testimonial.author.split(",")[1]}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
