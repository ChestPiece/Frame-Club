"use client";

import * as React from "react";

type ScrollAnimateOptions = {
  threshold?: number;
};

export function useScrollAnimate(
  animateFn: (el: HTMLElement) => void,
  options?: ScrollAnimateOptions,
) {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        animateFn(element);
        observer.disconnect();
      },
      { threshold: options?.threshold ?? 0.15 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [animateFn, options?.threshold]);

  return ref;
}
