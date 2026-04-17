"use client";

export const BUTTON_MOTION_SELECTOR = "[data-button-motion]";
export const BUTTON_FILL_SELECTOR = "[data-button-fill]";
export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export type ButtonMotionLevel = "strong" | "default" | "subtle" | "minimal";

export const BUTTON_MOTION_LEVEL_ATTR = "data-button-motion-level";

export const BUTTON_MOTION_TWEENS: Record<
  ButtonMotionLevel,
  {
    rest: { scale: number; duration: number; ease: string };
    hover: { scale: number; duration: number; ease: string };
    press: { scale: number; duration: number; ease: string };
  }
> = {
  strong: {
    rest: { scale: 1, duration: 0.22, ease: "power2.out" },
    hover: { scale: 1.02, duration: 0.26, ease: "power2.out" },
    press: { scale: 0.982, duration: 0.12, ease: "power2.out" },
  },
  default: {
    rest: { scale: 1, duration: 0.2, ease: "power2.out" },
    hover: { scale: 1.015, duration: 0.24, ease: "power2.out" },
    press: { scale: 0.985, duration: 0.12, ease: "power2.out" },
  },
  subtle: {
    rest: { scale: 1, duration: 0.18, ease: "power2.out" },
    hover: { scale: 1.01, duration: 0.2, ease: "power2.out" },
    press: { scale: 0.99, duration: 0.1, ease: "power2.out" },
  },
  minimal: {
    rest: { scale: 1, duration: 0.16, ease: "power2.out" },
    hover: { scale: 1.006, duration: 0.18, ease: "power2.out" },
    press: { scale: 0.994, duration: 0.1, ease: "power2.out" },
  },
};

export const BUTTON_FILL_TWEENS = {
  fillIn: { scaleX: 1, duration: 0.28, ease: "expo.out" },
  fillOut: { scaleX: 0, duration: 0.22, ease: "expo.in" },
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}
