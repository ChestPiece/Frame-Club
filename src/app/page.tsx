import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { TransitionLink } from "@/components/layout/page-transition";
import { HomeAnimations } from "@/components/home/home-animations";
import { WhatIsThisSection } from "@/components/home/what-is-this-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { FeaturedCollectionSection } from "@/components/home/featured-collection-section";
import { CustomisationSection } from "@/components/home/customisation-section";
import { SocialProofSection } from "@/components/home/social-proof-section";
import { FinalCTASection } from "@/components/home/final-cta-section";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { COPY } from "@/lib/content/copy-constants";
import { DIECAST_PRODUCT_IMAGES } from "@/lib/shop/diecast-assets";
import { getProducts } from "@/lib/shop/data";

export default async function Home() {
  const featuredProducts = (await getProducts()).slice(0, 3);
  const featuredLabel =
    featuredProducts[0]?.name != null && featuredProducts[0].name.length > 0
      ? `FEATURED: ${featuredProducts[0].name.toUpperCase()}`
      : "FEATURED BUILD";

  return (
    <>
      <main id="main-content" className="pb-0">
        <HomeAnimations>
          <section
            id="hero-section"
            data-animate-section="hero"
            className="relative overflow-hidden bg-bg-deep texture-overlay"
          >
            <div
              className="pointer-events-none absolute -left-48 -bottom-48 h-[60vw] w-[60vw] md:h-[800px] md:w-[800px]"
              style={{
                background:
                  "radial-gradient(circle at bottom left, color-mix(in srgb, var(--brand) 38%, transparent), transparent 60%)",
              }}
            />
            <div id="hero-pin-target" className="h-dvh flex items-center">
              <div className="frame-container relative z-10 grid items-center gap-10 md:grid-cols-2">
                <div className="space-y-6">
                  <div className="flex flex-col gap-4">
                    <div data-animate="hero-accent" className="h-px bg-brand w-24" />
                    <p data-animate="hero-label" className="technical-label text-xs sm:text-[11px] text-text-muted tracking-[0.14em] sm:tracking-[0.2em]">
                      Frame Club Pakistan
                    </p>
                  </div>
                  <h1 data-animate="hero-heading" className="display-kicker display-fluid leading-[0.9] w-full max-w-none">
                    YOUR FAVOURITE <span className="text-brand-bright">CAR.</span>
                    <br />
                    FRAMED. <span className="text-brand-mid">FOREVER.</span>
                  </h1>
                  <div data-hero-pin="subcopy-group" className="space-y-6">
                    <p className="max-w-xl text-sm leading-relaxed text-text-muted md:text-base">
                      {COPY.heroSub}
                    </p>
                    <Button
                      render={<TransitionLink href="/shop" />}
                      variant="brand"
                      className="display-kicker h-auto w-full md:w-auto gap-3 px-8 md:px-10 py-5 text-xl"
                    >
                      {COPY.heroCta} <ArrowRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="relative mt-8 md:mt-0" data-hero-pin="image">
                  <div className="border border-border/40 bg-bg-deep p-5 aspect-4/5 relative overflow-hidden before:absolute before:bottom-0 before:right-0 before:w-10 before:h-10 before:bg-brand before:z-30 before:[clip-path:polygon(100%_0,100%_100%,0_100%)]">
                    <Image
                      src={featuredProducts[0]?.images[0] ?? DIECAST_PRODUCT_IMAGES[0]}
                      alt={featuredProducts[0]?.name ?? "Featured frame"}
                      fill
                      preload
                      fetchPriority="high"
                      loading="eager"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain p-4 md:p-6 grayscale mix-blend-luminosity brightness-75 transition-all duration-700 hover:grayscale-0 hover:mix-blend-normal"
                    />
                    <div className="absolute bottom-4 left-4 right-4 z-40 bg-bg-surface p-3 technical-label text-xs uppercase tracking-[0.12em] sm:tracking-[0.15em] text-text-primary border-l-2 border-brand max-w-full truncate">
                      {featuredLabel}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <svg
              aria-hidden="true"
              data-hero-svg-accent
              className="absolute bottom-0 left-0 w-full h-px pointer-events-none"
              viewBox="0 0 1440 1"
              preserveAspectRatio="none"
            >
              <line x1="0" y1="0.5" x2="1440" y2="0.5" stroke="var(--brand)" strokeWidth="1" />
            </svg>
          </section>

          <section data-animate-section="not-a-poster" className="bg-bg-surface py-16 md:py-24 lg:py-28">
            <WhatIsThisSection />
          </section>
          <div className="frame-container overflow-hidden" aria-hidden="true">
            <svg data-drawsvg-divider viewBox="0 0 1280 2" className="w-full h-px" preserveAspectRatio="none">
              <line x1="0" y1="1" x2="1280" y2="1" stroke="var(--brand)" strokeWidth="1" />
            </svg>
          </div>

          <section data-animate-section="three-steps" className="bg-bg-deep py-16 md:py-24 lg:py-28">
            <div className="frame-container">
              <HowItWorksSection />
            </div>
          </section>
          <div className="frame-container">
            <Separator className="bg-border/20" />
          </div>

          <section id="collection-section" data-animate-section="collection" className="bg-bg-surface py-16 md:py-24 lg:py-28">
            <div className="frame-container">
              <FeaturedCollectionSection products={featuredProducts} />
            </div>
          </section>
          <div className="frame-container">
            <Separator className="bg-border/20" />
          </div>

          <section data-animate-section="customisation" className="bg-bg-deep py-16 md:py-24 lg:py-28">
            <div className="frame-container">
              <CustomisationSection />
            </div>
          </section>
          <div className="frame-container">
            <Separator className="bg-border/20" />
          </div>

          <section data-animate-section="social-proof" className="bg-bg-surface py-16 md:py-24 lg:py-28">
            <div className="frame-container">
              <SocialProofSection />
            </div>
          </section>
          <div className="frame-container">
            <Separator className="bg-border/20" />
          </div>

          <section data-animate-section="final-cta" className="bg-bg-deep py-16 md:py-24 lg:py-28 text-center texture-overlay">
            <FinalCTASection />
          </section>
        </HomeAnimations>
      </main>

      <SiteFooter />
    </>
  );
}
