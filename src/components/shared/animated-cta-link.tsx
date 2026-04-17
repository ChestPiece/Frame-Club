"use client";

import Link from "next/link";
import { useRef } from "react";

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

  return (
    <Link
      href={href}
      data-button-motion="true"
      className={`relative overflow-hidden block ${className}`}
    >
      <span
        ref={fillRef}
        data-button-fill="true"
        className="absolute inset-0 bg-text-primary pointer-events-none"
        style={{ transform: "scaleX(0)", transformOrigin: "0% 50%" }}
        aria-hidden="true"
      />
      <span className="relative z-10 mix-blend-difference">{children}</span>
    </Link>
  );
}
