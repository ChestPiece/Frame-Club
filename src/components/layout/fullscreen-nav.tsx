"use client";

import * as React from "react";
import { createTimeline, stagger } from "animejs";
import { TransitionLink } from "@/components/layout/page-transition";

export type NavItem = {
  href: string;
  label: string;
  number: string;
};

type FullscreenNavProps = {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
};

export function FullscreenNav({ isOpen, onClose, navItems }: FullscreenNavProps) {
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const itemWrapperRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const ctaWrapperRef = React.useRef<HTMLDivElement>(null);
  const isAnimating = React.useRef(false);

  // ESC key to close
  React.useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Body scroll lock
  React.useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Animate open/close
  React.useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay || isAnimating.current) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const validItems = itemWrapperRefs.current.filter(Boolean) as HTMLDivElement[];

    if (isOpen) {
      overlay.style.display = "flex";
      isAnimating.current = true;

      if (prefersReduced) {
        overlay.style.opacity = "1";
        validItems.forEach((el) => {
          el.style.opacity = "1";
        });
        if (ctaWrapperRef.current) ctaWrapperRef.current.style.opacity = "1";
        isAnimating.current = false;
        return;
      }

      const tl = createTimeline({
        autoplay: false,
        onComplete: () => {
          isAnimating.current = false;
        },
      });

      tl.add(overlay, {
        opacity: [0, 1],
        duration: 200,
        ease: "outQuad",
      });

      if (validItems.length > 0) {
        tl.add(
          validItems,
          {
            translateY: [60, 0],
            opacity: [0, 1],
            delay: stagger(80),
            duration: 500,
            ease: "outExpo",
          },
          "-=50"
        );
      }

      if (ctaWrapperRef.current) {
        tl.add(
          ctaWrapperRef.current,
          {
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 400,
            ease: "outExpo",
          },
          "-=300"
        );
      }

      tl.play();
    } else {
      isAnimating.current = true;

      if (prefersReduced) {
        overlay.style.opacity = "0";
        overlay.style.display = "none";
        isAnimating.current = false;
        return;
      }

      const tl = createTimeline({
        autoplay: false,
        onComplete: () => {
          overlay.style.display = "none";
          isAnimating.current = false;
        },
      });

      if (ctaWrapperRef.current) {
        tl.add(ctaWrapperRef.current, {
          opacity: [1, 0],
          translateY: [0, 20],
          duration: 180,
          ease: "inExpo",
        });
      }

      if (validItems.length > 0) {
        tl.add(
          [...validItems].reverse(),
          {
            opacity: [1, 0],
            translateY: [0, 30],
            delay: stagger(40),
            duration: 180,
            ease: "inExpo",
          },
          "-=100"
        );
      }

      tl.add(
        overlay,
        {
          opacity: [1, 0],
          duration: 150,
          ease: "outQuad",
        },
        "-=50"
      );

      tl.play();
    }
  }, [isOpen]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-90 flex-col bg-[#0E0E0E]"
      style={{ display: "none", opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      {/* Header row: close button */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-border-dark/40">
        <span className="display-kicker text-sm text-text-muted tracking-[0.2em]">NAVIGATION</span>
        <button
          onClick={onClose}
          className="p-2 text-text-muted hover:text-text-primary transition-colors"
          aria-label="Close navigation"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <line x1="4" y1="4" x2="20" y2="20" />
            <line x1="20" y1="4" x2="4" y2="20" />
          </svg>
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex flex-1 flex-col justify-center">
        {navItems.map((item, i) => (
          <div
            key={item.href}
            ref={(el) => {
              itemWrapperRefs.current[i] = el;
            }}
            className="border-b border-brand/20"
            style={{ opacity: 0 }}
          >
            <TransitionLink
              href={item.href}
              onClick={onClose}
              className="group flex w-full items-baseline gap-4 px-6 py-5 text-text-primary hover:text-brand-bright transition-colors duration-150"
            >
              <span className="technical-label text-[10px] text-text-muted group-hover:text-brand-bright transition-colors shrink-0">
                {item.number}
              </span>
              <span
                className="display-kicker leading-none"
                style={{ fontSize: "clamp(2.8rem, 12vw, 7rem)" }}
              >
                {item.label}
              </span>
            </TransitionLink>
          </div>
        ))}
      </nav>

      {/* ORDER NOW CTA */}
      <div
        ref={ctaWrapperRef}
        className="px-6 pb-8 pt-6"
        style={{ opacity: 0 }}
      >
        <TransitionLink
          href="/shop"
          onClick={onClose}
          className="display-kicker block w-full bg-brand py-5 text-center text-lg tracking-[0.3em] text-text-primary hover:bg-brand-mid transition-colors"
        >
          ORDER NOW
        </TransitionLink>
      </div>
    </div>
  );
}
