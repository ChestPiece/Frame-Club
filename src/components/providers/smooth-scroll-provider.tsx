"use client";

import * as React from "react";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";

type SmoothScrollProviderProps = {
  children: React.ReactNode;
};

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = React.useState(false);

  // Wait for hydration to complete before initializing ScrollSmoother
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initialize ScrollSmoother only after hydration is complete
  React.useEffect(() => {
    if (!isMounted) return;
    if (!wrapperRef.current || !contentRef.current) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      ScrollSmoother.create({
        wrapper: wrapperRef.current!,
        content: contentRef.current!,
        smooth: 1.2,
        // Must stay false: when true, ScrollSmoother mutates `[data-speed]` nodes (data-lag,
        // inline transforms) on the client, causing React hydration mismatches vs SSR HTML.
        // Parallax for those elements is handled in `HomeAnimations` via ScrollTrigger.
        effects: false,
        smoothTouch: 0.1,
      });

      return () => {
        ScrollSmoother.get()?.kill();
      };
    });

    return () => {
      mm.revert();
    };
  }, [isMounted]);

  return (
    <div ref={wrapperRef} id="smooth-wrapper">
      <div ref={contentRef} id="smooth-content">
        {children}
      </div>
    </div>
  );
}
