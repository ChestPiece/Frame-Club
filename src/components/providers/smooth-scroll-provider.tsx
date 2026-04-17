"use client";

import * as React from "react";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "@/lib/animation/gsap-config";
import { useScrollTriggerEnvironment } from "@/components/providers/scroll-trigger-environment";
import { APP_REVEAL_DONE_EVENT } from "@/components/layout/app-reveal";
import {
  SCROLL_LAYOUT_STABILIZE_FRAME_COUNT,
  isScrollSmootherEnabled,
  logScrollLayoutDebug,
  scrollSmootherMatchMediaQuery,
} from "@/lib/animation/scroll-layout";
import { scheduleScrollTriggerRefresh } from "@/lib/animation/scroll-trigger-refresh";
import { waitForLayoutStable } from "@/lib/animation/wait-for-layout-stable";

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
  const resizeRefreshQueuedRef = React.useRef(false);

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

    const onAppRevealDone = () => {
      if (!appRevealDoneRef.current) {
        appRevealDoneRef.current = true;
        setScrollLayoutReady(false);
        queueMicrotask(apply);
        return;
      }
      scheduleScrollTriggerRefresh();
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

    const onResize = () => {
      if (resizeRefreshQueuedRef.current) return;
      resizeRefreshQueuedRef.current = true;
      requestAnimationFrame(() => {
        resizeRefreshQueuedRef.current = false;
        scheduleScrollTriggerRefresh();
      });
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [isMounted]);

  React.useEffect(() => {
    if (!isMounted || !contentRef.current) return;
    if (typeof ResizeObserver === "undefined") return;

    const contentEl = contentRef.current;
    const ro = new ResizeObserver(() => {
      if (resizeRefreshQueuedRef.current) return;
      resizeRefreshQueuedRef.current = true;
      requestAnimationFrame(() => {
        resizeRefreshQueuedRef.current = false;
        scheduleScrollTriggerRefresh();
      });
    });
    ro.observe(contentEl);

    return () => {
      ro.disconnect();
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
