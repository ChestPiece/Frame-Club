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

if (typeof window !== "undefined") {
  gsap.registerPlugin(
    useGSAP,
    ScrollTrigger,
    ScrollSmoother,
    ScrollToPlugin,
    SplitText,
    ScrambleTextPlugin,
    TextPlugin
  );
}

export function GSAPProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
