"use client";

import Image from "next/image";
import Link from "next/link";
import { LayoutGrid, LayoutList } from "lucide-react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import { Flip } from "gsap/Flip";
import { useScrollTriggerReady } from "@/components/providers/scroll-trigger-environment";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

type FeaturedCollectionSectionProps = {
  products: Product[];
};

export function FeaturedCollectionSection({ products }: FeaturedCollectionSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLElement[]>([]);
  const flipStateRef = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const scrollTriggerReady = useScrollTriggerReady();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const setCardRef = useCallback((el: HTMLElement | null, index: number) => {
    if (el) cardRefs.current[index] = el;
  }, []);

  const handleViewToggle = useCallback(
    (newMode: "grid" | "list") => {
      if (newMode === viewMode || !gridRef.current || cardRefs.current.length === 0) return;
      if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setViewMode(newMode);
        return;
      }
      flipStateRef.current = Flip.getState(cardRefs.current);
      setViewMode(newMode);
    },
    [viewMode],
  );

  useGSAP(
    () => {
      if (!scrollTriggerReady || cardRefs.current.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(cardRefs.current.filter(Boolean), {
          y: 0,
          opacity: 1,
          clipPath: "none",
          clearProps: "all",
        });
        return () => {};
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tween = gsap.fromTo(
          cardRefs.current,
          { y: 80, opacity: 0, clipPath: "inset(100% 0% 0% 0%)" },
          {
            y: 0,
            opacity: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.1,
            ease: "power4.out",
            stagger: 0.15,
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 75%",
              once: true,
            },
          },
        );
        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [scrollTriggerReady, products] },
  );

  useLayoutEffect(() => {
    if (!flipStateRef.current || cardRefs.current.length === 0) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      flipStateRef.current = null;
      return;
    }
    Flip.from(flipStateRef.current, {
      duration: 0.5,
      ease: "power2.inOut",
      stagger: 0.04,
      absolute: true,
      onComplete: () => {
        flipStateRef.current = null;
      },
    });
  }, [viewMode]);

  return (
    <div ref={sectionRef}>
      <div className="mb-8 md:mb-10 flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="space-y-2 min-w-0">
          <h2 className="display-kicker text-3xl sm:text-4xl md:text-5xl">THE COLLECTION</h2>
          <p className="max-w-xl text-sm sm:text-base text-text-muted leading-relaxed">
            Every frame is made to order. No two are exactly alike.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="icon"
            aria-label="Grid view"
            className={cn("border border-border", viewMode === "grid" && "border-brand-mid")}
            onClick={() => handleViewToggle("grid")}
          >
            <LayoutGrid className="h-4 w-4" strokeWidth={1.5} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="List view"
            className={cn("border border-border", viewMode === "list" && "border-brand-mid")}
            onClick={() => handleViewToggle("list")}
          >
            <LayoutList className="h-4 w-4" strokeWidth={1.5} />
          </Button>
        </div>
      </div>

      {products.length === 0 ? (
        <EmptyState
          label="THE COLLECTION"
          title="COMING SOON"
          description="New frames are being added. Follow us on Instagram for updates."
          cta={{ label: "VISIT INSTAGRAM", href: "https://instagram.com/frameclub__" }}
        />
      ) : (
        <div
          ref={gridRef}
          className={cn("grid gap-6 sm:gap-8", viewMode === "grid" ? "md:grid-cols-3" : "md:grid-cols-1")}
        >
          {products.map((product, index) => (
            <Card
              key={product.id}
              ref={(el) => setCardRef(el, index)}
              data-motion-reveal
              className="group bg-bg-deep overflow-hidden border border-border/20 min-w-0"
              style={{ opacity: 0 }}
            >
              <div
                suppressHydrationWarning
                className="relative aspect-square w-full overflow-hidden bg-bg-deep"
              >
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain p-4 md:p-6 grayscale transition-all duration-500 group-hover:grayscale-0"
                />
              </div>

              <CardContent className="p-5 sm:p-6">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3 gap-y-2">
                  <h3 className="display-kicker text-lg sm:text-xl leading-none min-w-0 wrap-break-word">{product.name}</h3>
                  <span className="technical-label text-xs text-brand-bright shrink-0">
                    Rs. {product.price.toLocaleString("en-PK")}
                  </span>
                </div>

                <p className="mb-6 text-xs uppercase tracking-[0.16em] sm:tracking-[0.2em] text-text-muted">
                  {product.brand}
                </p>
                <div className="mb-6">
                  <StatusBadge status={product.status} />
                </div>

                <ProductCardCTA href={`/shop/${product.slug}`}>VIEW SPECS</ProductCardCTA>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCardCTA({ href, children }: { href: string; children: string }) {
  const fillRef = useRef<HTMLSpanElement>(null);

  const handleEnter = useCallback(() => {
    if (!fillRef.current) return;
    gsap.killTweensOf(fillRef.current);
    gsap.to(fillRef.current, { scaleX: 1, duration: 0.28, ease: "expo.out" });
  }, []);

  const handleLeave = useCallback(() => {
    if (!fillRef.current) return;
    gsap.killTweensOf(fillRef.current);
    gsap.to(fillRef.current, { scaleX: 0, duration: 0.22, ease: "expo.in" });
  }, []);

  return (
    <Button
      render={<Link href={href} />}
      variant="outline"
      className="relative w-full overflow-hidden border border-border py-4 text-center display-kicker tracking-widest focus-visible:ring-2 focus-visible:ring-brand-mid focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
    >
      <span
        ref={fillRef}
        aria-hidden="true"
        className="absolute inset-0 bg-text-primary pointer-events-none"
        style={{ transform: "scaleX(0)", transformOrigin: "0% 50%" }}
      />
      <span className="relative z-10 mix-blend-difference">{children}</span>
    </Button>
  );
}
