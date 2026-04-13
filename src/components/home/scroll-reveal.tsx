"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import { useScrollTriggerReady } from "@/components/providers/scroll-trigger-environment";

type ScrollRevealProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
};

const SAFETY_UNHIDE_MS = 2000;

export function ScrollReveal({ children, delay = 0, className }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollTriggerReady = useScrollTriggerReady();

  useGSAP(
    () => {
      if (!scrollTriggerReady || !ref.current) return;
      const el = ref.current;

      const safetyTimer = window.setTimeout(() => {
        const styles = window.getComputedStyle(el);
        if (styles.visibility === "hidden" || Number.parseFloat(styles.opacity) < 0.05) {
          gsap.set(el, { autoAlpha: 1, y: 0, clearProps: "opacity,visibility,transform" });
        }
      }, SAFETY_UNHIDE_MS);

      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 32 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          delay: delay / 1000,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
          onComplete: () => {
            window.clearTimeout(safetyTimer);
          },
        },
      );

      return () => {
        window.clearTimeout(safetyTimer);
      };
    },
    { scope: ref, dependencies: [scrollTriggerReady, delay] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
