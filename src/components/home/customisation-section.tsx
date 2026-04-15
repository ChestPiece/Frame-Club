"use client";

import { useRef, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import { Layers, CarFront, FileText } from "lucide-react";
import { gsap } from "@/lib/gsap-config";
import { useScrollTriggerReady } from "@/components/providers/scroll-trigger-environment";
import { Card, CardContent } from "@/components/ui/card";

export function CustomisationSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const obsessionRef = useRef<HTMLSpanElement>(null);
  const articleRefs = useRef<HTMLElement[]>([]);
  const scrollTriggerReady = useScrollTriggerReady();

  const setArticleRef = useCallback((el: HTMLElement | null, index: number) => {
    if (el) articleRefs.current[index] = el;
  }, []);

  useGSAP(
    () => {
      if (!scrollTriggerReady) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        if (headlineRef.current) {
          gsap.set(headlineRef.current, { clearProps: "letterSpacing" });
        }
        if (obsessionRef.current) {
          obsessionRef.current.style.color = "var(--brand-bright)";
        }
        gsap.set(articleRefs.current.filter(Boolean), { opacity: 1, y: 0, clearProps: "all" });
        return () => {};
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const inner = gsap.matchMedia();
        inner.add("(min-width: 768px)", () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
              end: "center center",
              scrub: 2,
            },
          });

          tl.to(headlineRef.current, { letterSpacing: "0.22em", ease: "none", duration: 1 }, 0).to(
            obsessionRef.current,
            { color: "var(--brand-bright)", ease: "none", duration: 1 },
            0,
          );

          return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
          };
        });

        let articleTween: gsap.core.Tween | null = null;
        if (articleRefs.current.length > 0) {
          articleTween = gsap.fromTo(
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

        return () => {
          inner.revert();
          articleTween?.scrollTrigger?.kill();
          articleTween?.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [scrollTriggerReady] },
  );

  return (
    <div ref={sectionRef}>
      <h2
        ref={headlineRef}
        className="display-kicker text-center display-fluid mb-10 md:mb-14 flex flex-col items-center leading-none px-1"
      >
        <span>BUILT AROUND YOUR</span>
        <span ref={obsessionRef} className="w-full text-brand">
          OBSESSION.
        </span>
      </h2>

      <div className="relative">
        <svg
          aria-hidden="true"
          data-drawsvg-corners
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <polyline points="0,12 0,0 12,0" fill="none" stroke="var(--brand)" strokeWidth="0.5" />
          <polyline points="88,0 100,0 100,12" fill="none" stroke="var(--brand)" strokeWidth="0.5" />
          <polyline points="0,88 0,100 12,100" fill="none" stroke="var(--brand)" strokeWidth="0.5" />
          <polyline points="88,100 100,100 100,88" fill="none" stroke="var(--brand)" strokeWidth="0.5" />
        </svg>
        <div className="grid border border-border/40 md:grid-cols-3">
          <Card
            ref={(el) => setArticleRef(el, 0)}
            data-motion-reveal
            className="border-b md:border-b-0 md:border-r border-border/40"
            style={{ opacity: 0 }}
          >
            <CardContent className="p-6 md:p-8">
              <h4 className="display-kicker flex items-center gap-3 text-xl sm:text-2xl mb-6">
                <Layers className="h-6 w-6 shrink-0 text-brand-bright" strokeWidth={1.5} />
                BACKGROUND DESIGN
              </h4>
              <ul className="space-y-4 technical-label text-sm uppercase tracking-[0.12em] sm:tracking-[0.16em] text-text-muted">
                <li>
                  <span className="text-brand mr-2">●</span>Carbon Grid
                </li>
                <li>
                  <span className="text-brand mr-2">●</span>Race Topography
                </li>
                <li>
                  <span className="text-brand mr-2">●</span>Solid Monolith Tone
                </li>
                <li>
                  <span className="text-brand mr-2">●</span>Custom Print Direction
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card
            ref={(el) => setArticleRef(el, 1)}
            data-motion-reveal
            className="border-b md:border-b-0 md:border-r border-border/40 bg-brand/10"
            style={{ opacity: 0 }}
          >
            <CardContent className="p-6 md:p-8">
              <h4 className="display-kicker flex items-center gap-3 text-xl sm:text-2xl mb-6">
                <CarFront className="h-6 w-6 shrink-0 text-brand-bright" strokeWidth={1.5} />
                CAR MODEL
              </h4>
              <ul className="space-y-4 technical-label text-sm uppercase tracking-[0.12em] sm:tracking-[0.16em] text-text-muted">
                <li>
                  <span className="text-brand mr-2">●</span>1:64 Scale Focus
                </li>
                <li>
                  <span className="text-brand mr-2">●</span>Hot Wheels / Matchbox
                </li>
                <li>
                  <span className="text-brand mr-2">●</span>Tomica Premium
                </li>
                <li>
                  <span className="text-brand mr-2">●</span>Send Your Own Model
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card ref={(el) => setArticleRef(el, 2)} data-motion-reveal className="border-0" style={{ opacity: 0 }}>
            <CardContent className="p-6 md:p-8">
              <h4 className="display-kicker flex items-center gap-3 text-xl sm:text-2xl mb-6">
                <FileText className="h-6 w-6 shrink-0 text-brand-bright" strokeWidth={1.5} />
                PRINTED SPECS
              </h4>
              <ul className="space-y-4 technical-label text-sm uppercase tracking-[0.12em] sm:tracking-[0.16em] text-text-muted">
                <li>
                  <span className="text-brand mr-2">●</span>Performance Data
                </li>
                <li>
                  <span className="text-brand mr-2">●</span>Production History
                </li>
                <li>
                  <span className="text-brand mr-2">●</span>Owner Tags
                </li>
                <li>
                  <span className="text-brand mr-2">●</span>Edition Numbering
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
