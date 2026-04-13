"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import { useScrollTriggerReady } from "@/components/providers/scroll-trigger-environment";
import { StatusBadge } from "@/components/shared/status-badge";
import { AnimatedCTALink } from "@/components/shared/animated-cta-link";
import { EmptyState } from "@/components/shared/empty-state";
import type { Product } from "@/lib/types";


type FeaturedCollectionSectionProps = {
  products: Product[];
};

export function FeaturedCollectionSection({ products }: FeaturedCollectionSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLElement[]>([]);
  const scrollTriggerReady = useScrollTriggerReady();

  const setCardRef = (el: HTMLElement | null, index: number) => {
    if (el) cardRefs.current[index] = el;
  };

  useGSAP(
    () => {
      if (!scrollTriggerReady || cardRefs.current.length === 0) return;

      gsap.fromTo(
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
    },
    { scope: sectionRef, dependencies: [scrollTriggerReady, products] },
  );

  return (
    <div ref={sectionRef}>
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
        <h2 className="display-kicker text-5xl md:text-7xl">THE COLLECTION</h2>
        <p className="max-w-xl text-sm text-text-muted">
          Every frame is made to order. No two are exactly alike.
        </p>
      </div>

      {products.length === 0 ? (
        <EmptyState
          label="THE COLLECTION"
          title="COMING SOON"
          description="New frames are being added. Follow us on Instagram for updates."
          cta={{ label: "VISIT INSTAGRAM", href: "https://instagram.com/frameclub__" }}
        />
      ) : (
        <div ref={gridRef} className="grid gap-12 md:grid-cols-3">
          {products.map((product, index) => (
            <article
              key={product.id}
              ref={(el) => setCardRef(el, index)}
              className="group bg-[#0F0F0F] border border-[#494542]"
              style={{ opacity: 0 }}
            >
              <div
                suppressHydrationWarning
                className="relative aspect-square w-full overflow-hidden bg-[#0E0E0E]"
              >
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain p-4 md:p-6 grayscale transition-all duration-500 group-hover:grayscale-0"
                />
              </div>

              <div className="p-8">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <h3 className="display-kicker text-3xl leading-none">{product.name}</h3>
                  <span className="technical-label text-[10px] text-[#ffb3af]">
                    Rs. {product.price.toLocaleString("en-PK")}
                  </span>
                </div>

                <p className="mb-6 text-xs uppercase tracking-[0.2em] text-text-muted">
                  {product.brand}
                </p>
                <div className="mb-6">
                  <StatusBadge status={product.status} />
                </div>

                <AnimatedCTALink
                  href={`/shop/${product.slug}`}
                  className="w-full border border-[#494542] py-4 text-center display-kicker tracking-widest"
                >
                  VIEW SPECS
                </AnimatedCTALink>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
