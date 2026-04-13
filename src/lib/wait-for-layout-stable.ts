/**
 * Resolves after fonts are ready (if supported), `window` "load" when still loading,
 * and N animation frames — so ScrollTrigger measures match final layout (e.g. maximized viewport).
 */

export async function waitForLayoutStable(frameCount: number): Promise<void> {
  for (let i = 0; i < frameCount; i++) {
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  }

  const fontsReady = document.fonts?.ready;
  if (fontsReady && typeof fontsReady.then === "function") {
    try {
      await fontsReady;
    } catch {
      /* ignore */
    }
  }

  if (document.readyState !== "complete") {
    await new Promise<void>((resolve) => {
      window.addEventListener("load", () => resolve(), { once: true });
    });
  }
}
