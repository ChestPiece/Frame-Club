"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Layers, CarFront, FileText } from "lucide-react";
import { gsap } from "@/lib/gsap-config";
import { useScrollTriggerReady } from "@/components/providers/scroll-trigger-environment";


export function CustomisationSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const obsessionRef = useRef<HTMLSpanElement>(null);
  const articleRefs = useRef<HTMLElement[]>([]);
  const scrollTriggerReady = useScrollTriggerReady();

  const setArticleRef = (el: HTMLElement | null, index: number) => {
    if (el) articleRefs.current[index] = el;
  };

  useGSAP(
    () => {
      if (!scrollTriggerReady) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "center center",
            scrub: 2,
          },
        });

        tl.to(
          headlineRef.current,
          { letterSpacing: "0.22em", ease: "none", duration: 1 },
          0,
        ).to(
          obsessionRef.current,
          { color: "#C0392B", ease: "none", duration: 1 },
          0,
        );

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      if (articleRefs.current.length > 0) {
        gsap.fromTo(
          articleRefs.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              once: true,
            },
          },
        );
      }

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [scrollTriggerReady] },
  );

  return (
    <div ref={sectionRef}>
      <h2
        ref={headlineRef}
        className="display-kicker text-center display-fluid mb-20 flex flex-col items-center leading-none"
      >
        <span>BUILT AROUND YOUR</span>
        <span ref={obsessionRef} className="w-full" style={{ color: "#380306" }}>
          OBSESSION.
        </span>
      </h2>

      <div className="grid border border-border-dark/40 md:grid-cols-3">
        <article
          ref={(el) => setArticleRef(el, 0)}
          className="border-b md:border-b-0 md:border-r border-border-dark/40 p-6 md:p-12"
          style={{ opacity: 0 }}
        >
          <h4 className="display-kicker flex items-center gap-3 text-2xl mb-6">
            <Layers className="h-6 w-6 text-[#ffb3af]" strokeWidth={1.5} />
            BACKGROUND DESIGN
          </h4>
          <ul className="space-y-4 technical-label text-sm uppercase tracking-[0.16em] text-[#888888]">
            <li><span className="text-brand mr-2">●</span>Carbon Grid</li>
            <li><span className="text-brand mr-2">●</span>Race Topography</li>
            <li><span className="text-brand mr-2">●</span>Solid Monolith Tone</li>
            <li><span className="text-brand mr-2">●</span>Custom Print Direction</li>
          </ul>
        </article>

        <article
          ref={(el) => setArticleRef(el, 1)}
          className="border-b md:border-b-0 md:border-r border-border-dark/40 bg-brand/10 p-6 md:p-12"
          style={{ opacity: 0 }}
        >
          <h4 className="display-kicker flex items-center gap-3 text-2xl mb-6">
            <CarFront className="h-6 w-6 text-[#ffb3af]" strokeWidth={1.5} />
            CAR MODEL
          </h4>
          <ul className="space-y-4 technical-label text-sm uppercase tracking-[0.16em] text-[#888888]">
            <li><span className="text-brand mr-2">●</span>1:64 Scale Focus</li>
            <li><span className="text-brand mr-2">●</span>Hot Wheels / Matchbox</li>
            <li><span className="text-brand mr-2">●</span>Tomica Premium</li>
            <li><span className="text-brand mr-2">●</span>Send Your Own Model</li>
          </ul>
        </article>

        <article
          ref={(el) => setArticleRef(el, 2)}
          className="p-6 md:p-12"
          style={{ opacity: 0 }}
        >
          <h4 className="display-kicker flex items-center gap-3 text-2xl mb-6">
            <FileText className="h-6 w-6 text-[#ffb3af]" strokeWidth={1.5} />
            PRINTED SPECS
          </h4>
          <ul className="space-y-4 technical-label text-sm uppercase tracking-[0.16em] text-[#888888]">
            <li><span className="text-brand mr-2">●</span>Performance Data</li>
            <li><span className="text-brand mr-2">●</span>Production History</li>
            <li><span className="text-brand mr-2">●</span>Owner Tags</li>
            <li><span className="text-brand mr-2">●</span>Edition Numbering</li>
          </ul>
        </article>
      </div>
    </div>
  );
}
