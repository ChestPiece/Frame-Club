"use client";

import { ScrollSmoother } from "gsap/ScrollSmoother";
import { gsap } from "@/lib/animation/gsap-config";

const COLLECTION_SCROLL_TARGET = "#collection-section";

/** Scroll homepage featured collection into view (ScrollSmoother or window). */
export function scrollToCollectionSection() {
  const smoother = ScrollSmoother.get();

  if (smoother) {
    smoother.scrollTo(COLLECTION_SCROLL_TARGET, true, "top 120px");
    return;
  }

  gsap.to(window, {
    duration: 1,
    ease: "power2.out",
    scrollTo: { y: COLLECTION_SCROLL_TARGET, offsetY: 120 },
  });
}
