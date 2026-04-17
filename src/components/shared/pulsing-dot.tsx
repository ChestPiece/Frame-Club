"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/animation/gsap-config";

export function PulsingDot() {
  const dotRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!dotRef.current || !ringRef.current) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const ringAnim = gsap.fromTo(
      ringRef.current,
      { scale: 0.8, autoAlpha: 0.45 },
      { scale: 1.9, autoAlpha: 0, duration: 1.15, repeat: -1, ease: "sine.out" },
    );
    const dotAnim = gsap.to(dotRef.current, {
      scale: 1.08,
      duration: 0.26,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    return () => {
      ringAnim.kill();
      dotAnim.kill();
    };
  }, []);

  return (
    <span className="relative inline-block h-2 w-2" aria-hidden="true">
      <span ref={ringRef} className="absolute inset-0 border border-text-success/60" />
      <span ref={dotRef} className="absolute inset-0 bg-text-success" />
    </span>
  );
}
