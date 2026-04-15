"use client";

import * as React from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ScrollTrigger,
  ScrollSmoother,
  ScrollToPlugin,
  SplitText,
  ScrambleTextPlugin,
  TextPlugin,
} from "gsap/all";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Flip } from "gsap/Flip";

if (typeof window !== "undefined") {
  gsap.registerPlugin(
    useGSAP,
    ScrollTrigger,
    ScrollSmoother,
    ScrollToPlugin,
    SplitText,
    ScrambleTextPlugin,
    TextPlugin,
    DrawSVGPlugin,
    Flip
  );
  // ScrollSmoother owns scroll normalization; normalizeScroll(true) breaks trigger measurement and batch onEnter.
  ScrollTrigger.normalizeScroll(false);
}

export function GSAPProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
