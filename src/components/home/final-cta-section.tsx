"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap-config";
import { AnimatedCTALink } from "@/components/shared/animated-cta-link";


// Pre-split into word spans to avoid runtime text splitting
const headlineWords = ["READY", "TO", "FRAME", "YOUR", "OBSESSION?"];

export function FinalCTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const words = headlineRef.current?.querySelectorAll("[data-word]");
      if (!words || words.length === 0) return;

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
    },
    { scope: sectionRef },
  );

  return (
    <div ref={sectionRef} className="frame-container relative z-10 text-center">
      <h2
        ref={headlineRef}
        className="display-kicker text-5xl md:text-8xl mb-10 tracking-tighter flex flex-wrap justify-center gap-x-[0.25em] gap-y-0"
      >
        {headlineWords.map((word) => (
          <span
            key={word}
            data-word
            className="inline-block"
            style={{ opacity: 0 }}
          >
            {word}
          </span>
        ))}
      </h2>

      <p className="mx-auto mt-5 max-w-2xl text-sm text-[#f7dcda] mb-10">
        Rs. 5,000. Fully customised. Delivered nationwide. Takes 2 minutes to order.
      </p>

      <AnimatedCTALink
        href="/shop"
        className="inline-block bg-[#810c0c] text-[#F5F5F5] display-kicker text-2xl tracking-[0.2em] w-full md:w-auto px-8 md:px-16 py-4 md:py-6"
      >
        ORDER NOW
      </AnimatedCTALink>

      <p className="mt-12 text-[10px] uppercase tracking-[0.3em] text-[#f1c0bc] display-kicker">
        NATIONWIDE DELIVERY · SECURE PAYMENT · HANDCRAFTED TO ORDER
      </p>
    </div>
  );
}
