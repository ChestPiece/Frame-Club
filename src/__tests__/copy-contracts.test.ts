import { describe, expect, it } from "vitest";
import { COPY } from "@/lib/copy-constants";

describe("locked copy contracts", () => {
  it("matches hero sub-copy from CLAUDE.md", () => {
    expect(COPY.heroSub).toBe(
      "Custom diecast frames for the car obsessed. Nationwide delivery across Pakistan.",
    );
  });

  it("matches trust line from CLAUDE.md", () => {
    expect(COPY.trustLine).toBe(
      "Nationwide Delivery 🇵🇰 | Secure Payment | Handcrafted to Order",
    );
  });

  it("matches hero CTA copy from CLAUDE.md", () => {
    expect(COPY.heroCta).toBe("ORDER YOUR FRAME — Rs. 5,000");
  });

  it("matches final CTA heading from CLAUDE.md", () => {
    expect(COPY.finalCtaHeading).toBe("READY TO FRAME YOUR OBSESSION?");
  });
});
