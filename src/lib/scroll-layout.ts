/**
 * Scroll / ScrollSmoother layout constants.
 * `SCROLL_SMOOTHER_MIN_WIDTH_PX` matches Tailwind’s default `lg` breakpoint (1024px).
 */

export const SCROLL_SMOOTHER_MIN_WIDTH_PX = 1024;

export const scrollSmootherMatchMediaQuery = `(min-width: ${SCROLL_SMOOTHER_MIN_WIDTH_PX}px) and (prefers-reduced-motion: no-preference)`;

/** Debounce for ScrollTrigger.refresh after resize / content size changes. */
export const SCROLL_REFRESH_DEBOUNCE_MS = 150;

/** Extra animation frames to wait before trusting ScrollTrigger geometry after DOM changes. */
export const SCROLL_LAYOUT_STABILIZE_FRAME_COUNT = 2;

/**
 * Set `NEXT_PUBLIC_ENABLE_SCROLL_SMOOTHER=false` to disable ScrollSmoother on desktop (diagnostic / fallback).
 * Default: smoother enabled when the viewport matches {@link scrollSmootherMatchMediaQuery}.
 */
export function isScrollSmootherEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_SCROLL_SMOOTHER !== "false";
}

/** Set `NEXT_PUBLIC_DEBUG_SCROLL=1` to log `#smooth-wrapper` / `#smooth-content` layout once after refresh (development aid). */
export function logScrollLayoutDebug(context: string): void {
  if (process.env.NEXT_PUBLIC_DEBUG_SCROLL !== "1" || typeof document === "undefined") return;
  const w = document.querySelector("#smooth-wrapper");
  const c = document.querySelector("#smooth-content");
  if (!w || !c || !(w instanceof HTMLElement) || !(c instanceof HTMLElement)) return;
  const wr = w.getBoundingClientRect();
  const cr = c.getBoundingClientRect();
  console.info(`[debug-scroll] ${context}`, {
    inner: { w: window.innerWidth, h: window.innerHeight },
    wrapper: { h: w.clientHeight, scrollH: w.scrollHeight, rect: wr },
    content: { h: c.clientHeight, scrollH: c.scrollHeight, rect: cr, transform: getComputedStyle(c).transform },
  });
}
