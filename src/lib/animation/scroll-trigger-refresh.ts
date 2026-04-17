import { ScrollTrigger } from "@/lib/animation/gsap-config";
import { SCROLL_REFRESH_DEBOUNCE_MS } from "@/lib/animation/scroll-layout";

let debounceId: ReturnType<typeof setTimeout> | null = null;
let lastRefreshAt = 0;
const MIN_REFRESH_INTERVAL_MS = 140;

/** Single debounced ScrollTrigger.refresh for resize / layout observers / reveal events. */
export function scheduleScrollTriggerRefresh(): void {
  if (debounceId != null) {
    clearTimeout(debounceId);
  }
  debounceId = setTimeout(() => {
    debounceId = null;
    const now = Date.now();
    if (now - lastRefreshAt < MIN_REFRESH_INTERVAL_MS) return;
    try {
      ScrollTrigger.refresh();
      lastRefreshAt = now;
    } catch {
      /* noop */
    }
  }, SCROLL_REFRESH_DEBOUNCE_MS);
}
