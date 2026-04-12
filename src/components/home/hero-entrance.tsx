"use client";

import * as React from "react";
import { createTimeline } from "animejs";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap-config";

type HeroEntranceProps = {
  children: React.ReactNode;
  className?: string;
};

export function HeroEntrance({ children, className }: HeroEntranceProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const accentLine = element.querySelector('[data-hero-animate="accent-line"]');
    const label = element.querySelector('[data-hero-animate="label"]');
    const headline = element.querySelector('[data-hero-animate="headline"]');
    const subcopy = element.querySelector('[data-hero-animate="subcopy"]');
    const cta = element.querySelector('[data-hero-animate="cta"]');
    const imagePlate = element.querySelector('[data-hero-animate="image-plate"]');

    if (!accentLine || !label || !headline || !subcopy || !cta || !imagePlate) return;

    const timeline = createTimeline({
      defaults: {
        duration: 400,
      },
      autoplay: false,
    });

    timeline
      .add(accentLine, {
        width: ["0px", "96px"],
        ease: "outExpo",
        duration: 200,
      })
      .add(
        label,
        {
          opacity: [0, 1],
          translateY: [8, 0],
          duration: 300,
          ease: "outExpo",
        },
        "-=100",
      )
      .add(
        headline,
        {
          opacity: [0, 1],
          translateY: [48, 0],
          ease: "spring(1, 80, 10, 0)",
          duration: 450,
        },
        "-=100",
      )
      .add(
        subcopy,
        {
          opacity: [0, 1],
          translateY: [16, 0],
          duration: 400,
          ease: "outExpo",
        },
        "-=250",
      )
      .add(
        cta,
        {
          opacity: [0, 1],
          scale: [0.96, 1],
          duration: 350,
          ease: "outExpo",
        },
        "-=200",
      )
      .add(
        imagePlate,
        {
          opacity: [0, 1],
          translateX: [24, 0],
          duration: 500,
          ease: "outExpo",
        },
        100,
      );

    timeline.play();

    return () => {
      timeline.pause();
    };
  }, []);

  // Hero image parallax — image plate drifts up at ~30% scroll rate
  useGSAP(
    () => {
      const imagePlate = ref.current?.querySelector(
        '[data-hero-animate="image-plate"]'
      );
      if (!imagePlate) return;

      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(imagePlate, {
          y: -80,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      });
    },
    { scope: ref, dependencies: [] }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
