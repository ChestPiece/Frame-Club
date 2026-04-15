import { ScrollTrigger } from "@/lib/gsap-config";
import { SCROLL_REFRESH_DEBOUNCE_MS } from "@/lib/scroll-layout";

let debounceId: ReturnType<typeof setTimeout> | null = null;

/** Single debounced ScrollTrigger.refresh for resize / layout observers / reveal events. */
export function scheduleScrollTriggerRefresh(): void {
  if (debounceId != null) {
    clearTimeout(debounceId);
  }
  debounceId = setTimeout(() => {
    debounceId = null;
    try {
      ScrollTrigger.refresh();
    } catch {
      /* noop */
    }
  }, SCROLL_REFRESH_DEBOUNCE_MS);
}
