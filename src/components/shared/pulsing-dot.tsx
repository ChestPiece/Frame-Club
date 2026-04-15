"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap-config";

export function PulsingDot() {
  const dotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!dotRef.current) return;

    const anim = gsap.fromTo(
      dotRef.current,
      { boxShadow: "0 0 0px 0px rgba(155, 240, 186, 0)" },
      {
        boxShadow: "0 0 0px 4px rgba(155, 240, 186, 0.25)",
        duration: 1.25,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      }
    );

    return () => {
      anim.kill();
    };
  }, []);

  return (
    <span
      ref={dotRef}
      className="inline-block h-2 w-2 bg-text-success"
      aria-hidden="true"
    />
  );
}
