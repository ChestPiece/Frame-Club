"use client";

import * as React from "react";
import Image from "next/image";
import { createTimeline } from "animejs";
import { gsap } from "@/lib/gsap-config";

const DIAGNOSTICS = [
  { label: "FRAME DATABASE", status: "OK" },
  { label: "CUSTOMISATION ENGINE", status: "READY" },
  { label: "PAYMENT GATEWAY", status: "SECURE" },
  { label: "BUILD NO. FC-2025-001", status: "LOADED" },
];

export function SiteLoader() {
  // null = not yet determined (server render + initial hydration)
  // true = show loader, false = skip
  const [shouldShow, setShouldShow] = React.useState<boolean | null>(null);
  const [done, setDone] = React.useState(false);

  const overlayRef = React.useRef<HTMLDivElement>(null);
  const logoRef = React.useRef<HTMLDivElement>(null);
  const progressBarRef = React.useRef<HTMLDivElement>(null);
  const lineRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  // SSR-safe: check sessionStorage only after hydration
  React.useEffect(() => {
    const seen = sessionStorage.getItem("fc-loader-shown");
    if (seen) {
      setShouldShow(false);
      return;
    }
    sessionStorage.setItem("fc-loader-shown", "1");
    setShouldShow(true);
  }, []);

  React.useEffect(() => {
    if (!shouldShow) return;

    // Skip animation entirely for users who prefer reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDone(true);
      return;
    }

    const tl = createTimeline({
      autoplay: false,
      onComplete: () => {
        // Brief pause, then GSAP wipes the overlay away to the left
        setTimeout(() => {
          if (!overlayRef.current) return;
          gsap.fromTo(
            overlayRef.current,
            { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" },
            {
              clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)",
              duration: 0.65,
              ease: "power4.inOut",
              onComplete: () => setDone(true),
            }
          );
        }, 300);
      },
    });

    // Logo slides in from left
    if (logoRef.current) {
      tl.add(logoRef.current, {
        opacity: [0, 1],
        translateX: [-24, 0],
        duration: 600,
        ease: "outExpo",
      });
    }

    // Diagnostic lines stagger in at absolute time positions
    lineRefs.current.forEach((el, i) => {
      if (!el) return;
      tl.add(
        el,
        {
          opacity: [0, 1],
          translateX: [12, 0],
          duration: 280,
          ease: "outExpo",
        },
        350 + i * 180
      );
    });

    // Progress bar fills after all lines are in
    if (progressBarRef.current) {
      tl.add(
        progressBarRef.current,
        {
          width: ["0%", "100%"],
          duration: 650,
          ease: "linear",
        },
        1050
      );
    }

    tl.play();

    return () => {
      tl.pause();
    };
  }, [shouldShow]);

  // Return null on server, on returning visitors, and after animation completes
  if (shouldShow === null || !shouldShow || done) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#030303]"
      aria-hidden="true"
    >
      {/* Logo lockup */}
      <div
        ref={logoRef}
        className="flex items-center gap-3 mb-14"
        style={{ opacity: 0 }}
      >
        <Image
          src="/FrameClub.png"
          alt="The Frame Club"
          width={36}
          height={36}
          className="object-contain"
          priority
        />
        <span className="display-kicker text-2xl text-text-primary tracking-[0.18em]">
          THE FRAME CLUB
        </span>
      </div>

      {/* Diagnostic readout */}
      <div className="w-full max-w-xs space-y-3 px-6">
        {DIAGNOSTICS.map((line, i) => (
          <div
            key={line.label}
            ref={(el) => {
              lineRefs.current[i] = el;
            }}
            className="flex items-center justify-between"
            style={{ opacity: 0 }}
          >
            <span className="technical-label text-[9px] text-text-muted tracking-[0.16em]">
              {line.label}
            </span>
            <span className="technical-label text-[9px] text-brand-bright tracking-[0.16em]">
              {line.status}
            </span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-10 w-full max-w-xs px-6">
        <div className="h-px w-full bg-[#1C1B1B]">
          <div
            ref={progressBarRef}
            className="h-full bg-brand-mid"
            style={{ width: "0%" }}
          />
        </div>
      </div>
    </div>
  );
}
