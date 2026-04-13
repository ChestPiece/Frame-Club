"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import { useScrollTriggerReady } from "@/components/providers/scroll-trigger-environment";
import { ScrollReveal } from "@/components/home/scroll-reveal";


export function WhatIsThisSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const scrollTriggerReady = useScrollTriggerReady();

  useGSAP(
    () => {
      if (!scrollTriggerReady) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
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

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [scrollTriggerReady] },
  );

  return (
    <div ref={sectionRef} className="frame-container grid gap-16 md:grid-cols-[1fr_1.5fr]">
      <div className="md:sticky md:top-32 md:self-start">
        <h2
          ref={headlineRef}
          className="display-kicker text-5xl leading-none md:text-7xl"
        >
          NOT A POSTER.
          <br />
          NOT A TOY.
          <br />
          <span className="text-[#ffb3af]">SOMETHING BETTER.</span>
        </h2>
      </div>

      <div className="space-y-12 text-text-muted">
        <ScrollReveal>
          <div className="space-y-6 text-lg leading-relaxed">
            <p>
              Every frame is built to order around your selected car and your chosen
              background design. No warehouse stock, no random variants, and no shortcuts.
            </p>
            <p>
              Each unit is sourced, assembled, and finished by hand. The website captures
              your request, then production starts.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-8 pt-4">
          <ScrollReveal delay={100}>
            <article className="flex items-start gap-6">
              <span className="display-kicker text-4xl text-brand">01</span>
              <div>
                <h3 className="display-kicker text-2xl mb-2 text-text-primary">
                  ARCHIVAL PROTECTION
                </h3>
                <p className="text-sm leading-relaxed text-text-muted">
                  Museum-style framing, archival mounting, and clean typography built for
                  long-term display.
                </p>
              </div>
            </article>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <article className="flex items-start gap-6">
              <span className="display-kicker text-4xl text-brand">02</span>
              <div>
                <h3 className="display-kicker text-2xl mb-2 text-text-primary">
                  HANDCRAFTED PROCESS
                </h3>
                <p className="text-sm leading-relaxed text-text-muted">
                  Built manually for each order, from model sourcing to final sealing and
                  shipping prep.
                </p>
              </div>
            </article>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
