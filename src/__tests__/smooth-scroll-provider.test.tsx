import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { SCROLL_SMOOTHER_MIN_WIDTH_PX } from "@/lib/animation/scroll-layout";
import { APP_REVEAL_DONE_EVENT } from "@/components/layout/app-reveal";

vi.unmock("@/components/providers/scroll-trigger-environment");

const createMock = vi.fn();
const getMock = vi.fn(() => null);

vi.mock("gsap/ScrollSmoother", () => ({
  ScrollSmoother: {
    get: () => getMock(),
    create: (...args: unknown[]) => createMock(...args),
  },
}));

const refreshMock = vi.fn();

vi.mock("@/lib/animation/gsap-config", () => ({
  gsap: {},
  ScrollTrigger: {
    refresh: (...args: unknown[]) => refreshMock(...args),
  },
}));

describe("SmoothScrollProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getMock.mockReturnValue(null);
    delete (window as Window & { __frameClubAppRevealDone?: boolean }).__frameClubAppRevealDone;
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation((query: string) => ({
        matches: String(query).includes(String(SCROLL_SMOOTHER_MIN_WIDTH_PX)),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    );
  });

  it("renders #smooth-wrapper and #smooth-content around children", async () => {
    const { ScrollTriggerEnvironmentProvider } = await import(
      "@/components/providers/scroll-trigger-environment"
    );
    const { SmoothScrollProvider } = await import("@/components/providers/smooth-scroll-provider");

    render(
      <ScrollTriggerEnvironmentProvider>
        <SmoothScrollProvider>
          <main data-testid="page-main">Body</main>
        </SmoothScrollProvider>
      </ScrollTriggerEnvironmentProvider>,
    );

    const wrapper = document.getElementById("smooth-wrapper");
    const content = document.getElementById("smooth-content");
    expect(wrapper).toBeTruthy();
    expect(content).toBeTruthy();
    expect(content?.querySelector('[data-testid="page-main"]')).toBeInTheDocument();
  });

  it("does not call ScrollSmoother.create until APP_REVEAL_DONE_EVENT", async () => {
    const { ScrollTriggerEnvironmentProvider } = await import(
      "@/components/providers/scroll-trigger-environment"
    );
    const { SmoothScrollProvider } = await import("@/components/providers/smooth-scroll-provider");

    render(
      <ScrollTriggerEnvironmentProvider>
        <SmoothScrollProvider>
          <span>child</span>
        </SmoothScrollProvider>
      </ScrollTriggerEnvironmentProvider>,
    );

    await waitFor(() => {
      expect(document.getElementById("smooth-wrapper")).toBeTruthy();
    });

    expect(createMock).not.toHaveBeenCalled();

    window.dispatchEvent(new Event(APP_REVEAL_DONE_EVENT));

    await waitFor(() => {
      expect(createMock).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(refreshMock.mock.calls.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("calls ScrollSmoother.create on desktop mq when reveal flag was already set (sync race)", async () => {
    (window as Window & { __frameClubAppRevealDone?: boolean }).__frameClubAppRevealDone = true;

    const { ScrollTriggerEnvironmentProvider } = await import(
      "@/components/providers/scroll-trigger-environment"
    );
    const { SmoothScrollProvider } = await import("@/components/providers/smooth-scroll-provider");

    render(
      <ScrollTriggerEnvironmentProvider>
        <SmoothScrollProvider>
          <span>child</span>
        </SmoothScrollProvider>
      </ScrollTriggerEnvironmentProvider>,
    );

    await waitFor(() => {
      expect(createMock).toHaveBeenCalled();
    });
  });

  it("still calls refresh when ScrollSmoother.create throws after reveal", async () => {
    createMock.mockImplementationOnce(() => {
      throw new Error("create failed");
    });

    const { ScrollTriggerEnvironmentProvider } = await import(
      "@/components/providers/scroll-trigger-environment"
    );
    const { SmoothScrollProvider } = await import("@/components/providers/smooth-scroll-provider");

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ScrollTriggerEnvironmentProvider>
        <SmoothScrollProvider>
          <span>child</span>
        </SmoothScrollProvider>
      </ScrollTriggerEnvironmentProvider>,
    );

    window.dispatchEvent(new Event(APP_REVEAL_DONE_EVENT));

    await waitFor(() => {
      expect(refreshMock).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});
