"use client";

import * as React from "react";
import { animate } from "animejs";
import { useScrollAnimate } from "@/hooks/use-scroll-animate";

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  translateY?: number;
  scaleFrom?: number;
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  duration = 700,
  translateY = 32,
  scaleFrom,
}: ScrollRevealProps) {
  const animateFn = React.useCallback(
    (el: HTMLElement) => {
      const animationParams: Record<string, unknown> = {
        opacity: [0, 1],
        translateY: [translateY, 0],
        duration,
        delay,
        ease: "outExpo",
      };

      if (typeof scaleFrom === "number") {
        animationParams.scale = [scaleFrom, 1];
      }

      animate(el, animationParams);
    },
    [delay, duration, scaleFrom, translateY],
  );

  const ref = useScrollAnimate(animateFn);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
