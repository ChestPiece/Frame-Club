"use client";

import * as React from "react";
import { animate } from "animejs";
import { useScrollAnimate } from "@/hooks/use-scroll-animate";

type CardRevealProps = {
  children: React.ReactNode;
  index: number;
  className?: string;
};

export function CardReveal({ children, index, className }: CardRevealProps) {
  const animateFn = React.useCallback(
    (el: HTMLElement) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        animate(el, { opacity: [0, 1], duration: 200 });
        return;
      }
      animate(el, {
        opacity: [0, 1],
        translateY: [48, 0],
        duration: 750,
        delay: index * 100,
        ease: "outExpo",
      });
    },
    [index]
  );

  const ref = useScrollAnimate(animateFn, { threshold: 0.08 });

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
