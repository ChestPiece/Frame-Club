"use client";

import * as React from "react";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "@/lib/gsap-config";
import { useScrollTriggerEnvironment } from "@/components/providers/scroll-trigger-environment";
import { APP_REVEAL_DONE_EVENT } from "@/components/layout/app-reveal";
import {
  SCROLL_LAYOUT_STABILIZE_FRAME_COUNT,
  SCROLL_REFRESH_DEBOUNCE_MS,
  isScrollSmootherEnabled,
  logScrollLayoutDebug,
  scrollSmootherMatchMediaQuery,
} from "@/lib/scroll-layout";
import { waitForLayoutStable } from "@/lib/wait-for-layout-stable";

type SmoothScrollProviderProps = {
  children: React.ReactNode;
};

function safeRefresh() {
  try {
    ScrollTrigger.refresh();
  } catch {
    /* noop */
  }
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = React.useState(false);
  const { setScrollLayoutReady } = useScrollTriggerEnvironment();
  const layoutReadyGenerationRef = React.useRef(0);
  const appRevealDoneRef = React.useRef(false);
  const pendingMqChangeRef = React.useRef(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (!isMounted) return;
    if (!wrapperRef.current || !contentRef.current) return;

    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    const mq = window.matchMedia(scrollSmootherMatchMediaQuery);

    const apply = () => {
      pendingMqChangeRef.current = false;
      const generation = ++layoutReadyGenerationRef.current;
      ScrollSmoother.get()?.kill();
      wrapper.removeAttribute("data-smooth");

      try {
        if (mq.matches && isScrollSmootherEnabled()) {
          wrapper.setAttribute("data-smooth", "active");
          // ScrollSmoother registers scrollerProxy(wrapper) and ScrollTrigger.defaults({ scroller: wrapper });
          // Triggers created after create() use the wrapper (see GSAP ScrollSmoother + ScrollTrigger docs).
          ScrollSmoother.create({
            wrapper,
            content,
            smooth: 1.2,
            effects: false,
            smoothTouch: 0.1,
          });
        }
      } catch (error) {
        console.error("[SmoothScrollProvider] ScrollSmoother.create failed:", error);
      } finally {
        requestAnimationFrame(() => {
          try {
            safeRefresh();
            logScrollLayoutDebug("post-create rAF");
          } catch {
            /* noop */
          }

          void (async () => {
            try {
              await waitForLayoutStable(SCROLL_LAYOUT_STABILIZE_FRAME_COUNT);
            } catch {
              /* noop */
            }
            if (generation !== layoutReadyGenerationRef.current) return;
            safeRefresh();
            logScrollLayoutDebug("post-layout-stable");
            setScrollLayoutReady(true);
          })();
        });
      }
    };

    let revealDebounceTimer: ReturnType<typeof setTimeout>;

    const onAppRevealDone = () => {
      if (!appRevealDoneRef.current) {
        appRevealDoneRef.current = true;
        setScrollLayoutReady(false);
        queueMicrotask(apply);
        return;
      }
      clearTimeout(revealDebounceTimer);
      revealDebounceTimer = setTimeout(() => safeRefresh(), SCROLL_REFRESH_DEBOUNCE_MS);
    };

    const onMqChange = () => {
      if (!appRevealDoneRef.current) {
        pendingMqChangeRef.current = true;
        return;
      }
      setScrollLayoutReady(false);
      queueMicrotask(apply);
    };

    setScrollLayoutReady(false);
    window.addEventListener(APP_REVEAL_DONE_EVENT, onAppRevealDone);
    mq.addEventListener("change", onMqChange);

    if (typeof window !== "undefined" && window.__frameClubAppRevealDone) {
      onAppRevealDone();
    }

    return () => {
      layoutReadyGenerationRef.current += 1;
      clearTimeout(revealDebounceTimer);
      window.removeEventListener(APP_REVEAL_DONE_EVENT, onAppRevealDone);
      mq.removeEventListener("change", onMqChange);
      ScrollSmoother.get()?.kill();
      wrapper.removeAttribute("data-smooth");
      setScrollLayoutReady(false);
      appRevealDoneRef.current = false;
      pendingMqChangeRef.current = false;
    };
  }, [isMounted, setScrollLayoutReady]);

  React.useEffect(() => {
    if (!isMounted) return;

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => safeRefresh(), SCROLL_REFRESH_DEBOUNCE_MS);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
    };
  }, [isMounted]);

  React.useEffect(() => {
    if (!isMounted || !contentRef.current) return;
    if (typeof ResizeObserver === "undefined") return;

    const contentEl = contentRef.current;
    let roTimer: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(roTimer);
      roTimer = setTimeout(() => safeRefresh(), SCROLL_REFRESH_DEBOUNCE_MS);
    });
    ro.observe(contentEl);

    return () => {
      ro.disconnect();
      clearTimeout(roTimer);
    };
  }, [isMounted]);

  return (
    <div ref={wrapperRef} id="smooth-wrapper">
      <div ref={contentRef} id="smooth-content">
        {children}
      </div>
    </div>
  );
}
