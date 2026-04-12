"use client";

import * as React from "react";
import { animate, stagger } from "animejs";
import { useScrollAnimate } from "@/hooks/use-scroll-animate";

type StaggerGridProps = {
  children: React.ReactNode;
  className?: string;
  staggerMs?: number;
  from?: "first" | "center";
  translateY?: number;
  translateX?: number;
};

export function StaggerGrid({
  children,
  className,
  staggerMs = 100,
  from = "first",
  translateY = 40,
  translateX = 0,
}: StaggerGridProps) {
  const animateFn = React.useCallback(
    (el: HTMLElement) => {
      const targets = el.querySelectorAll('[data-animate-item="true"]');

      if (!targets.length) return;

      animate(targets, {
        opacity: [0, 1],
        translateY: [translateY, 0],
        translateX: [translateX, 0],
        delay: stagger(staggerMs, { from }),
        ease: "spring(1, 80, 10, 0)",
      });
    },
    [from, staggerMs, translateX, translateY],
  );

  const ref = useScrollAnimate(animateFn);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
