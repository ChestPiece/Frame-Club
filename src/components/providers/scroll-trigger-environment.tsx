"use client";

import * as React from "react";

type ScrollTriggerEnvironmentValue = {
  /** True after post-reveal smooth layout init: ScrollSmoother (or native path) plus layout-stable wait; use with `appShellVisible` for `animationsReady`. */
  scrollLayoutReady: boolean;
  /** True after AppReveal finishes (or reduced-motion immediate path). */
  appShellVisible: boolean;
  /** Safe to create ScrollTriggers that depend on smooth scroll + visible app shell. */
  animationsReady: boolean;
  setScrollLayoutReady: (value: boolean) => void;
  setAppShellVisible: (value: boolean) => void;
};

const ScrollTriggerEnvironmentContext = React.createContext<ScrollTriggerEnvironmentValue | null>(null);

export function ScrollTriggerEnvironmentProvider({ children }: { children: React.ReactNode }) {
  const [scrollLayoutReady, setScrollLayoutReadyState] = React.useState(false);
  const [appShellVisible, setAppShellVisibleState] = React.useState(false);

  const setScrollLayoutReady = React.useCallback((value: boolean) => {
    setScrollLayoutReadyState(value);
  }, []);

  const setAppShellVisible = React.useCallback((value: boolean) => {
    setAppShellVisibleState(value);
  }, []);

  const animationsReady = scrollLayoutReady && appShellVisible;

  const value = React.useMemo(
    () => ({
      scrollLayoutReady,
      appShellVisible,
      animationsReady,
      setScrollLayoutReady,
      setAppShellVisible,
    }),
    [scrollLayoutReady, appShellVisible, animationsReady, setScrollLayoutReady, setAppShellVisible],
  );

  return (
    <ScrollTriggerEnvironmentContext.Provider value={value}>{children}</ScrollTriggerEnvironmentContext.Provider>
  );
}

export function useScrollTriggerEnvironment() {
  const ctx = React.useContext(ScrollTriggerEnvironmentContext);
  if (!ctx) {
    throw new Error("useScrollTriggerEnvironment must be used within ScrollTriggerEnvironmentProvider");
  }
  return ctx;
}

/** Use for ScrollTrigger / useGSAP setup: true only when smooth layout and AppReveal have settled. */
export function useScrollTriggerReady() {
  return useScrollTriggerEnvironment().animationsReady;
}
