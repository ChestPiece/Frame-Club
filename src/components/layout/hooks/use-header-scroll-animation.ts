"use client";

import * as React from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/animation/gsap-config";

type UseHeaderScrollAnimationParams = {
  mobileToggleRef: React.RefObject<HTMLButtonElement | null>;
  mobileNavOpen: boolean;
};

export function useHeaderScrollAnimation({ mobileToggleRef, mobileNavOpen }: UseHeaderScrollAnimationParams) {
  useGSAP(
    () => {
      if (!mobileToggleRef.current) return;

      const [topBar, midBar, bottomBar] = gsap.utils.toArray<HTMLElement>("[data-hamburger-bar]");
      if (!topBar || !midBar || !bottomBar) return;

      gsap.set(topBar, { y: -6, rotation: 0, transformOrigin: "50% 50%" });
      gsap.set(midBar, { autoAlpha: 1, scaleX: 1, transformOrigin: "50% 50%" });
      gsap.set(bottomBar, { y: 6, rotation: 0, transformOrigin: "50% 50%" });

      const tl = gsap.timeline({ defaults: { duration: 0.28, ease: "power2.out" } });
      if (mobileNavOpen) {
        tl.to(topBar, { y: 6, rotation: 45 }, 0)
          .to(midBar, { autoAlpha: 0, scaleX: 0, duration: 0.2 }, 0)
          .to(bottomBar, { y: -6, rotation: -45 }, 0);
      } else {
        tl.to(topBar, { y: -6, rotation: 0 }, 0)
          .to(midBar, { autoAlpha: 1, scaleX: 1, duration: 0.2 }, 0)
          .to(bottomBar, { y: 6, rotation: 0 }, 0);
      }
    },
    { scope: mobileToggleRef, dependencies: [mobileNavOpen], revertOnUpdate: true },
  );
}
