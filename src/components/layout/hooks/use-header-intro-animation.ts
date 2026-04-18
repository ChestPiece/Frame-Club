"use client";

import * as React from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/animation/gsap-config";

type UseHeaderIntroAnimationParams = {
  rootRef: React.RefObject<HTMLElement | null>;
  scrollTriggerReady: boolean;
  headerTintRef: React.RefObject<HTMLDivElement | null>;
  navRowRef: React.RefObject<HTMLDivElement | null>;
  logoRef: React.RefObject<HTMLAnchorElement | null>;
  tickerWrapRef: React.RefObject<HTMLDivElement | null>;
  setHeaderReady: (ready: boolean) => void;
};

export function useHeaderIntroAnimation({
  rootRef,
  scrollTriggerReady,
  headerTintRef,
  navRowRef,
  logoRef,
  tickerWrapRef,
  setHeaderReady,
}: UseHeaderIntroAnimationParams) {
  useGSAP(
    () => {
      if (!scrollTriggerReady) return;

      setHeaderReady(true);
      const navLinks = gsap.utils.toArray<HTMLElement>("[data-desktop-link]");
      const logoXOffset = window.innerWidth < 400 ? -8 : -16;

      gsap.set("[data-header-ticker]", { y: -8, scaleY: 1, transformOrigin: "top center" });
      gsap.set("[data-header-logo]", { x: logoXOffset });
      gsap.set(navLinks, { y: -6 });
      gsap.set("[data-header-cta]", { scale: 0.92 });
      if (headerTintRef.current) {
        gsap.set(headerTintRef.current, { autoAlpha: 0 });
      }

      const introTimeline = gsap.timeline({ defaults: { clearProps: "transform" } });
      introTimeline
        .to("[data-header-ticker]", {
          autoAlpha: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        })
        .to(
          "[data-header-logo]",
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.4,
            ease: "power3.out",
          },
          0.1,
        )
        .to(
          navLinks,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.3,
            stagger: 0.06,
            ease: "power2.out",
          },
          0.18,
        )
        .to(
          "[data-header-cta]",
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.35,
            ease: "back.out(1.4)",
          },
          0.38,
        );

      const compactTimeline = gsap.timeline({ paused: true });
      if (headerTintRef.current) {
        compactTimeline.to(
          headerTintRef.current,
          {
            autoAlpha: 1,
            duration: 0.4,
            ease: "power2.out",
          },
          0,
        );
      }
      compactTimeline
        .to(
          navRowRef.current,
          {
            y: -4,
            duration: 0.4,
            ease: "power2.out",
          },
          0,
        )
        .to(
          logoRef.current,
          {
            scale: 0.88,
            transformOrigin: "left center",
            duration: 0.4,
            ease: "power2.out",
          },
          0,
        )
        .to(
          tickerWrapRef.current,
          {
            scaleY: 0,
            autoAlpha: 0,
            transformOrigin: "top center",
            duration: 0.35,
            ease: "power2.out",
          },
          0,
        );

      const trigger = ScrollTrigger.create({
        start: 60,
        onEnter: () => compactTimeline.play(),
        onLeaveBack: () => compactTimeline.reverse(),
      });

      return () => {
        trigger.kill();
      };
    },
    { scope: rootRef, dependencies: [scrollTriggerReady] },
  );
}
