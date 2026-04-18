 "use client";

import * as React from "react";

export function SiteTicker() {
  return (
    <div className="relative z-50 flex w-full overflow-hidden whitespace-nowrap bg-brand py-1.5 text-text-primary">
      <div className="flex animate-marquee display-kicker text-xs tracking-[0.2em] uppercase">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center shrink-0">
            <span className="mx-4">FRAME CLUB PAKISTAN</span>
            <span className="mx-4">✦</span>
            <span className="mx-4">MADE TO ORDER</span>
            <span className="mx-4">✦</span>
            <span className="mx-4">NATIONWIDE DELIVERY</span>
            <span className="mx-4">✦</span>
            <span className="mx-4">PER-FRAME PRICING</span>
            <span className="mx-4">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
