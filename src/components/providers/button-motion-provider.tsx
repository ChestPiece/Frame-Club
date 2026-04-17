"use client";

import * as React from "react";
import { gsap } from "@/lib/animation/gsap-config";
import {
  BUTTON_FILL_SELECTOR,
  BUTTON_FILL_TWEENS,
  BUTTON_MOTION_LEVEL_ATTR,
  BUTTON_MOTION_SELECTOR,
  BUTTON_MOTION_TWEENS,
  type ButtonMotionLevel,
  prefersReducedMotion,
} from "@/lib/animation/button-motion";

type ButtonMotionProviderProps = {
  children: React.ReactNode;
};

function getMotionTarget(eventTarget: EventTarget | null): HTMLElement | null {
  if (!(eventTarget instanceof Element)) return null;
  const target = eventTarget.closest<HTMLElement>(BUTTON_MOTION_SELECTOR);
  if (!target) return null;
  if (target.getAttribute("aria-disabled") === "true") return null;
  if (target instanceof HTMLButtonElement && target.disabled) return null;
  return target;
}

function animateButton(button: HTMLElement, mode: "rest" | "hover" | "press") {
  const level = (button.getAttribute(BUTTON_MOTION_LEVEL_ATTR) ?? "default") as ButtonMotionLevel;
  const tweenSet = BUTTON_MOTION_TWEENS[level] ?? BUTTON_MOTION_TWEENS.default;
  gsap.killTweensOf(button);
  gsap.to(button, tweenSet[mode]);
}

function animateFill(button: HTMLElement, show: boolean) {
  const fill = button.querySelector<HTMLElement>(BUTTON_FILL_SELECTOR);
  if (!fill) return;
  gsap.killTweensOf(fill);
  gsap.to(fill, show ? BUTTON_FILL_TWEENS.fillIn : BUTTON_FILL_TWEENS.fillOut);
}

export function ButtonMotionProvider({ children }: ButtonMotionProviderProps) {
  React.useEffect(() => {
    if (prefersReducedMotion()) return;

    const onPointerEnter = (event: Event) => {
      const button = getMotionTarget(event.target);
      if (!button) return;
      animateButton(button, "hover");
      animateFill(button, true);
    };

    const onPointerLeave = (event: Event) => {
      const button = getMotionTarget(event.target);
      if (!button) return;
      animateButton(button, "rest");
      animateFill(button, false);
    };

    const onFocusIn = (event: FocusEvent) => {
      const button = getMotionTarget(event.target);
      if (!button) return;
      animateButton(button, "hover");
      animateFill(button, true);
    };

    const onFocusOut = (event: FocusEvent) => {
      const button = getMotionTarget(event.target);
      if (!button) return;
      animateButton(button, "rest");
      animateFill(button, false);
    };

    const onPointerDown = (event: PointerEvent) => {
      const button = getMotionTarget(event.target);
      if (!button) return;
      animateButton(button, "press");
    };

    const onPointerRelease = (event: PointerEvent) => {
      const button = getMotionTarget(event.target);
      if (!button) return;
      animateButton(button, "hover");
    };

    document.addEventListener("pointerenter", onPointerEnter, true);
    document.addEventListener("pointerleave", onPointerLeave, true);
    document.addEventListener("focusin", onFocusIn, true);
    document.addEventListener("focusout", onFocusOut, true);
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("pointerup", onPointerRelease, true);
    document.addEventListener("pointercancel", onPointerRelease, true);

    return () => {
      document.removeEventListener("pointerenter", onPointerEnter, true);
      document.removeEventListener("pointerleave", onPointerLeave, true);
      document.removeEventListener("focusin", onFocusIn, true);
      document.removeEventListener("focusout", onFocusOut, true);
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("pointerup", onPointerRelease, true);
      document.removeEventListener("pointercancel", onPointerRelease, true);
    };
  }, []);

  return <>{children}</>;
}
