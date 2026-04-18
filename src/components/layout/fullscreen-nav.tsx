"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/animation/gsap-config";
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
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  React.useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useGSAP(
    () => {
      const overlay = overlayRef.current;
      if (!overlay) return;

      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const validItems = itemWrapperRefs.current.filter(Boolean) as HTMLDivElement[];

      if (isOpen) {
        overlay.style.display = "flex";

        if (prefersReduced) {
          gsap.set(overlay, { opacity: 1 });
          validItems.forEach((el) => {
            gsap.set(el, { opacity: 1 });
          });
          if (ctaWrapperRef.current) gsap.set(ctaWrapperRef.current, { opacity: 1 });
          return;
        }

        const tl = gsap.timeline();
        tl.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "power2.out" });

        if (validItems.length > 0) {
          tl.fromTo(
            validItems,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: "expo.out", stagger: 0.08 },
            "-=0.05",
          );
        }

        if (ctaWrapperRef.current) {
          tl.fromTo(
            ctaWrapperRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.4, ease: "expo.out" },
            "-=0.3",
          );
        }

        return;
      }

      if (prefersReduced) {
        gsap.set(overlay, { opacity: 0 });
        overlay.style.display = "none";
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          overlay.style.display = "none";
        },
      });

      if (ctaWrapperRef.current) {
        tl.to(ctaWrapperRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.18,
          ease: "expo.in",
        });
      }

      if (validItems.length > 0) {
        tl.to(
          [...validItems].reverse(),
          { opacity: 0, y: 30, duration: 0.18, ease: "expo.in", stagger: 0.04 },
          "-=0.1",
        );
      }

      tl.to(overlay, { opacity: 0, duration: 0.15, ease: "power2.out" }, "-=0.05");
    },
    { scope: overlayRef, dependencies: [isOpen], revertOnUpdate: true },
  );

  const overlay = (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-90 flex flex-col bg-bg-deep"
      style={{ display: "none", opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      <div className="flex items-center justify-between px-6 py-6 border-b border-border/40">
        <span className="display-kicker text-sm text-text-muted tracking-[0.2em]">
          NAVIGATION
        </span>
        <button
          onClick={onClose}
          data-button-motion="true"
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

      <div
        ref={ctaWrapperRef}
        className="px-6 pb-8 pt-6"
        style={{ opacity: 0 }}
      >
        <TransitionLink
          href="/shop"
          onClick={onClose}
          data-button-motion="true"
          className="display-kicker block w-full bg-brand py-5 text-center text-lg tracking-[0.3em] text-text-primary hover:bg-brand-mid transition-colors"
        >
          ORDER NOW
        </TransitionLink>
      </div>
    </div>
  );

  if (!mounted || typeof document === "undefined") return null;
  return createPortal(overlay, document.body);
}
