"use client";

import Link from "next/link";
import { useRef, useCallback } from "react";
import { gsap } from "@/lib/gsap-config";

type AnimatedCTALinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function AnimatedCTALink({
  href,
  children,
  className = "",
}: AnimatedCTALinkProps) {
  const fillRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = useCallback(() => {
    if (!fillRef.current) return;
    gsap.to(fillRef.current, { scaleX: 1, duration: 0.28, ease: "expo.out" });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!fillRef.current) return;
    gsap.to(fillRef.current, { scaleX: 0, duration: 0.22, ease: "expo.in" });
  }, []);

  return (
    <Link
      href={href}
      className={`relative overflow-hidden block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span
        ref={fillRef}
        className="absolute inset-0 bg-[#F5F5F5] pointer-events-none"
        style={{ transform: "scaleX(0)", transformOrigin: "0% 50%" }}
        aria-hidden="true"
      />
      <span className="relative z-10 mix-blend-difference">{children}</span>
    </Link>
  );
}
