import React from "react";
import { vi } from "vitest";

vi.mock("@/components/providers/scroll-trigger-environment", () => ({
  ScrollTriggerEnvironmentProvider: ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
  useScrollTriggerEnvironment: () => ({
    scrollLayoutReady: true,
    appShellVisible: true,
    animationsReady: true,
    setScrollLayoutReady: vi.fn(),
    setAppShellVisible: vi.fn(),
  }),
  useScrollTriggerReady: () => true,
}));

Object.defineProperty(window, "matchMedia", {
  writable: true,
  configurable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
