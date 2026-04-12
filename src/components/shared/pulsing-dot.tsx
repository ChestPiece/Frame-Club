"use client";

import { useRef, useEffect } from "react";
import { animate } from "animejs";

export function PulsingDot() {
  const dotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!dotRef.current) return;

    const anim = animate(dotRef.current, {
      boxShadow: [
        "0 0 0px 0px rgba(155, 240, 186, 0)",
        "0 0 0px 4px rgba(155, 240, 186, 0.25)",
        "0 0 0px 0px rgba(155, 240, 186, 0)",
      ],
      duration: 2500,
      loop: true,
      ease: "inOutSine",
    });

    return () => {
      anim.cancel();
    };
  }, []);

  return (
    <span
      ref={dotRef}
      className="inline-block h-2 w-2 bg-[#9bf0ba]"
      aria-hidden="true"
    />
  );
}
