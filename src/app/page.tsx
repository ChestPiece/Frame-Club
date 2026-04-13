import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { HomeAnimations } from "@/components/home/home-animations";
import { WhatIsThisSection } from "@/components/home/what-is-this-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { FeaturedCollectionSection } from "@/components/home/featured-collection-section";
import { CustomisationSection } from "@/components/home/customisation-section";
import { SocialProofSection } from "@/components/home/social-proof-section";
import { FinalCTASection } from "@/components/home/final-cta-section";
import { Button } from "@/components/ui/button";
import { COPY } from "@/lib/copy-constants";
import { DIECAST_PRODUCT_IMAGES } from "@/lib/diecast-assets";
import { getProducts } from "@/lib/data";

const testimonials = [
  {
    quote:
      "The quality of the frame exceeded my expectations. It looks like something you would find in a luxury car dealership lounge.",
    author: "Ahmed R., Lahore",
  },
  {
    quote:
      "Finally a way to display my R34 collection properly. Packing was bulletproof for shipping to Karachi.",
    author: "Hamza K., Karachi",
  },
  {
    quote:
      "The custom technical data sheet background is a game changer. Every car guy needs one of these.",
    author: "Zaid S., Islamabad",
  },
];

export default async function Home() {
  const featuredProducts = (await getProducts()).slice(0, 3);

  return (
    <>
      <main id="main-content" className="pb-0 pt-30">
        <HomeAnimations>
          <section data-animate-section="hero" className="relative overflow-hidden bg-[#030303] min-h-dvh flex items-center pt-20 texture-overlay">
            <div className="pointer-events-none absolute -left-48 -bottom-48 h-[60vw] w-[60vw] md:h-[800px] md:w-[800px] bg-[radial-gradient(circle_at_bottom_left,rgba(56,3,6,0.4),transparent_60%)]" />
            <div className="frame-container relative z-10 grid items-center gap-14 md:grid-cols-2">
              <div className="space-y-6">
                <div className="flex flex-col gap-4">
                  <div data-animate="hero-accent" className="h-px bg-brand w-24" />
                  <p data-animate="hero-label" className="technical-label text-[11px] text-text-muted">
                    Frame Club Pakistan
                  </p>
                </div>
                <h1 data-animate="hero-heading" className="display-kicker display-fluid leading-[0.9] w-full max-w-none">
                  YOUR FAVOURITE <span className="text-[#ffb3af]">CAR.</span>
                  <br />
                  FRAMED. <span className="text-[#8e130c]">FOREVER.</span>
                </h1>
                <p data-animate="hero-subcopy" className="max-w-xl text-base leading-relaxed text-text-muted md:text-lg">
                  {COPY.heroSub}
                </p>
                <Button
                  render={<Link href="/shop" />}
                  variant="brand"
                  className="display-kicker h-auto w-full md:w-auto gap-3 px-8 md:px-10 py-5 text-xl"
                  data-animate="hero-cta"
                >
                  {COPY.heroCta} <ArrowRight className="h-5 w-5" />
                </Button>
              </div>

              <div className="relative mt-8 md:mt-0" data-speed="0.8">
                <div data-animate="hero-image" className="border border-border-dark/40 bg-[#0E0E0E] p-7 shadow-[0_0_100px_rgba(56,3,6,0.15)] aspect-4/5 relative overflow-hidden before:absolute before:bottom-0 before:right-0 before:w-16 before:h-16 before:bg-brand before:z-30 before:[clip-path:polygon(100%_0,100%_100%,0_100%)]">
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
                  <div className="absolute bottom-6 left-6 z-40 bg-[#1A1614] p-3 technical-label text-[10px] uppercase tracking-[0.15em] border-l-2 border-brand">
                    Model 01: The Silver Legend
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section data-animate-section="not-a-poster" className="bg-[#0F0F0F] py-24 md:py-32">
            <WhatIsThisSection />
          </section>

          <section data-animate-section="three-steps" className="bg-[#030303] py-24 md:py-32">
            <div className="frame-container">
              <HowItWorksSection />
            </div>
          </section>

          <section id="collection-section" data-animate-section="collection" className="bg-[#0F0F0F] py-24 md:py-32">
            <div className="frame-container">
              <FeaturedCollectionSection products={featuredProducts} />
            </div>
          </section>

          <section data-animate-section="customisation" className="bg-[#030303] py-24 md:py-32">
            <div className="frame-container">
              <CustomisationSection />
            </div>
          </section>

          <section data-animate-section="social-proof" className="bg-[#0F0F0F] py-24 md:py-32">
            <div className="frame-container">
              <SocialProofSection testimonials={testimonials} />
            </div>
          </section>

          <section data-animate-section="final-cta" className="bg-bg-recessed py-24 text-center texture-overlay">
            <FinalCTASection />
          </section>
        </HomeAnimations>
      </main>

      <SiteFooter />
    </>
  );
}
