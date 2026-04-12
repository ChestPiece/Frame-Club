import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { COPY } from "@/lib/copy-constants";
import { getProducts } from "@/lib/data";
import { HeroEntrance } from "@/components/home/hero-entrance";
import { FeaturedCollectionSection } from "@/components/home/featured-collection-section";
import { SocialProofSection } from "@/components/home/social-proof-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { WhatIsThisSection } from "@/components/home/what-is-this-section";
import { CustomisationSection } from "@/components/home/customisation-section";
import { FinalCTASection } from "@/components/home/final-cta-section";
import Image from "next/image";

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
      <SiteHeader />

      <main className="pb-0">
        {/* 1. Hero Section */}
        <section className="relative overflow-hidden bg-[#030303] min-h-screen flex items-center pt-20 texture-overlay">
          <div className="pointer-events-none absolute -left-48 -bottom-48 h-[800px] w-[800px] bg-[radial-gradient(circle_at_bottom_left,rgba(56,3,6,0.4),transparent_60%)]" />
          <HeroEntrance className="frame-container relative z-10 grid items-center gap-14 md:grid-cols-2">
            <div className="space-y-6">
              <div className="flex flex-col gap-4">
                <div data-hero-animate="accent-line" className="h-px bg-brand w-24" />
                <p
                  data-hero-animate="label"
                  className="technical-label text-[11px] text-text-muted"
                >
                  Frame Club Pakistan
                </p>
              </div>
              <h1
                data-hero-animate="headline"
                style={{ opacity: 0 }}
                className="display-kicker display-fluid leading-[0.9] w-full max-w-none -ml-4 md:-ml-8"
              >
                YOUR FAVOURITE <span className="text-[#ffb3af]">CAR.</span>
                <br />
                FRAMED. <span className="text-[#8e130c]">FOREVER.</span>
              </h1>
              <p
                data-hero-animate="subcopy"
                style={{ opacity: 0 }}
                className="max-w-xl text-base leading-relaxed text-text-muted md:text-lg"
              >
                {COPY.heroSub}
              </p>
              <Button
                data-hero-animate="cta"
                render={<Link href="/shop" />}
                variant="brand"
                className="display-kicker h-auto w-full md:w-auto gap-3 px-8 md:px-10 py-5 text-xl"
              >
                {COPY.heroCta} <ArrowRight className="h-5 w-5" />
              </Button>
            </div>

            <div data-hero-animate="image-plate" className="relative mt-8 md:mt-0">
              <div className="border border-border-dark/40 bg-[#0E0E0E] p-7 shadow-[0_0_100px_rgba(56,3,6,0.15)] aspect-4/5 relative overflow-hidden before:absolute before:bottom-0 before:right-0 before:w-16 before:h-16 before:bg-brand before:z-30 before:[clip-path:polygon(100%_0,100%_100%,0_100%)]">
                <Image
                  src={
                    featuredProducts[0]?.images[0] ??
                    "https://images.pexels.com/photos/2036544/pexels-photo-2036544.jpeg"
                  }
                  alt={featuredProducts[0]?.name ?? "Featured frame"}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover grayscale mix-blend-luminosity brightness-75 transition-all duration-700 hover:grayscale-0 hover:mix-blend-normal"
                />
                <div className="absolute bottom-6 left-6 z-40 bg-[#1A1614] p-3 technical-label text-[10px] uppercase tracking-[0.15em] border-l-2 border-brand">
                  Model 01: The Silver Legend
                </div>
              </div>
            </div>
          </HeroEntrance>
        </section>

        {/* 2. What Is This */}
        <section className="bg-[#0F0F0F] py-24 md:py-32">
          <WhatIsThisSection />
        </section>

        {/* 3. How It Works */}
        <section className="bg-[#030303] py-24 md:py-32">
          <div className="frame-container">
            <HowItWorksSection />
          </div>
        </section>

        {/* 4. Featured Collection */}
        <section className="bg-[#0F0F0F] py-24 md:py-32">
          <div className="frame-container">
            <FeaturedCollectionSection products={featuredProducts} />
          </div>
        </section>

        {/* 5. Customisation */}
        <section className="bg-[#030303] border-y border-border-dark/20 py-24 md:py-32">
          <div className="frame-container">
            <CustomisationSection />
          </div>
        </section>

        {/* 6. Social Proof */}
        <section className="bg-[#0F0F0F] py-24 md:py-32">
          <div className="frame-container">
            <SocialProofSection testimonials={testimonials} />
          </div>
        </section>

        {/* 7. Final CTA */}
        <section className="bg-linear-to-r from-[#380306] to-[#8E130C] py-24 text-center texture-overlay">
          <FinalCTASection />
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
