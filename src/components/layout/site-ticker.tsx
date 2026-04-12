import React from "react";

export function SiteTicker() {
  return (
    <div className="flex overflow-hidden bg-brand text-text-primary whitespace-nowrap py-1.5 border-b border-border-dark relative z-50 w-full">
      <div className="flex animate-marquee display-kicker text-xs tracking-[0.2em] uppercase">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center shrink-0">
            <span className="mx-4">FRAME CLUB PAKISTAN</span>
            <span className="mx-4">✦</span>
            <span className="mx-4">MADE TO ORDER</span>
            <span className="mx-4">✦</span>
            <span className="mx-4">NATIONWIDE DELIVERY</span>
            <span className="mx-4">✦</span>
            <span className="mx-4">RS. 5,000</span>
            <span className="mx-4">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
