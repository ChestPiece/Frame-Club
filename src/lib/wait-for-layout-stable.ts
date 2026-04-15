/**
 * Resolves after fonts are ready (if supported), bounded `window` "load" wait when still loading,
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
      const onLoad = () => {
        clearTimeout(timeoutId);
        resolve();
      };
      const timeoutId = window.setTimeout(() => {
        window.removeEventListener("load", onLoad);
        resolve();
      }, 200);
      window.addEventListener("load", onLoad, { once: true });
    });
  }
}
