import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Layers,
  CarFront,
  FileText,
  Car,
  SlidersHorizontal,
  Truck,
} from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { COPY } from "@/lib/copy-constants";
import { getProducts } from "@/lib/data";

export default async function Home() {
  const featuredProducts = (await getProducts()).slice(0, 3);
  const steps = [
    "Step 1 — Pick Your Car",
    "Step 2 — Customise It",
    "Step 3 — We Build & Ship",
  ];
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

  return (
    <>
      <SiteHeader />

      <main className="pb-0">
        {/* 1. Hero Section */}
        <section className="relative overflow-hidden bg-[#030303] min-h-screen flex items-center pt-20 texture-overlay">
          <div className="pointer-events-none absolute -left-48 -bottom-48 h-[800px] w-[800px] bg-[radial-gradient(circle_at_bottom_left,rgba(56,3,6,0.4),transparent_60%)]" />
          <div className="frame-container relative z-10 grid items-center gap-14 md:grid-cols-2">
            <div className="space-y-6">
              <div className="flex flex-col gap-4">
                <div className="h-px bg-brand w-24" />
                <p className="technical-label text-[11px] text-text-muted">
                  Frame Club Pakistan
                </p>
              </div>
              <h1 className="display-kicker display-fluid leading-[0.9] w-full max-w-none -ml-4 md:-ml-8">
                YOUR FAVOURITE <span className="text-[#ffb3af]">CAR.</span>
                <br />
                FRAMED. <span className="text-[#8e130c]">FOREVER.</span>
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-text-muted md:text-lg">
                {COPY.heroSub}
              </p>
              <Button
                render={<Link href="/shop" />}
                variant="brand"
                className="display-kicker h-auto w-full md:w-auto gap-3 px-8 md:px-10 py-5 text-xl"
              >
                {COPY.heroCta} <ArrowRight className="h-5 w-5" />
              </Button>
            </div>

            <div className="relative mt-8 md:mt-0">
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
          </div>
        </section>

        {/* 2. What Is This */}
        <section className="bg-[#0F0F0F] py-24 md:py-32">
          <div className="frame-container grid gap-16 md:grid-cols-[1fr_1.5fr]">
            <div className="md:sticky md:top-32 md:self-start">
              <h2 className="display-kicker text-5xl leading-none md:text-7xl">
                NOT A POSTER.
                <br />
                NOT A TOY.
                <br />
                <span className="text-[#ffb3af]">SOMETHING BETTER.</span>
              </h2>
            </div>

            <div className="space-y-12 text-text-muted">
              <div className="space-y-6 text-lg leading-relaxed">
                <p>
                  Every frame is built to order around your selected car and
                  your chosen background design. No warehouse stock, no random
                  variants, and no shortcuts.
                </p>
                <p>
                  Each unit is sourced, assembled, and finished by hand. The
                  website captures your request, then production starts.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8 pt-4">
                <article className="flex items-start gap-6">
                  <span className="display-kicker text-4xl text-brand">01</span>
                  <div>
                    <h3 className="display-kicker text-2xl mb-2 text-text-primary">
                      ARCHIVAL PROTECTION
                    </h3>
                    <p className="text-sm leading-relaxed text-text-muted">
                      Museum-style framing, archival mounting, and clean
                      typography built for long-term display.
                    </p>
                  </div>
                </article>
                <article className="flex items-start gap-6">
                  <span className="display-kicker text-4xl text-brand">02</span>
                  <div>
                    <h3 className="display-kicker text-2xl mb-2 text-text-primary">
                      HANDCRAFTED PROCESS
                    </h3>
                    <p className="text-sm leading-relaxed text-text-muted">
                      Built manually for each order, from model sourcing to
                      final sealing and shipping prep.
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* 3. How It Works */}
        <section className="bg-[#030303] py-24 md:py-32">
          <div className="frame-container">
            <div className="mb-14 flex flex-wrap items-end justify-between gap-4">
              <h2 className="display-kicker text-5xl leading-tight md:text-7xl">
                THREE STEPS. ONE FRAME. DELIVERED TO YOUR DOOR.
              </h2>
              <p className="technical-label text-[10px] text-text-muted uppercase tracking-[0.3em]">
                Three Steps to Perfection
              </p>
            </div>
            <div className="grid gap-0 md:grid-cols-3">
              {steps.map((step, index) => (
                <article
                  key={step}
                  className={`relative min-h-[280px] md:min-h-0 md:aspect-square overflow-hidden border border-border-dark/30 p-8 md:p-10 flex flex-col justify-end group ${
                    index === 1 ? "bg-bg-elevated border-t-2 border-t-brand" : "bg-[#1A1614]"
                  }`}
                >
                  <div className="absolute -top-6 -left-2 text-[160px] md:text-[200px] leading-none opacity-[0.03] display-kicker text-text-primary select-none pointer-events-none">
                    0{index + 1}
                  </div>
                  <div className="relative z-10 mt-auto">
                    <h3 className="display-kicker mb-4 text-3xl leading-none">
                      {step.split("—")[1]?.trim() || step}
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed">
                      {index === 0
                        ? "Select from available models or request your preferred car."
                        : index === 1
                          ? "Choose your background style and share notes for the build."
                          : "We source, build, and ship your frame nationwide across Pakistan."}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Featured Collection */}
        <section className="bg-[#0F0F0F] py-24 md:py-32">
          <div className="frame-container">
            <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
              <h2 className="display-kicker text-5xl md:text-7xl">
                THE COLLECTION
              </h2>
              <p className="max-w-xl text-sm text-text-muted">
                Every frame is made to order. No two are exactly alike.
              </p>
            </div>

            <div className="grid gap-12 md:grid-cols-3">
              {featuredProducts.map((product) => (
                <article
                  key={product.id}
                  className="group bg-[#0F0F0F] border border-[#494542]"
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
                      className="object-cover grayscale scale-110 transition-all duration-500 group-hover:scale-100 group-hover:grayscale-0"
                    />
                  </div>

                  <div className="p-8">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <h3 className="display-kicker text-3xl leading-none">
                        {product.name}
                      </h3>
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

                    <Link
                      href={`/shop/${product.slug}`}
                      className="block w-full border border-[#494542] py-4 text-center display-kicker tracking-widest hover:bg-[#F5F5F5] hover:text-[#030303] transition-all"
                    >
                      VIEW SPECS
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Customisation */}
        <section className="bg-[#030303] border-y border-border-dark/20 py-24 md:py-32">
          <div className="frame-container">
            <h2 className="display-kicker text-center display-fluid mb-20 flex flex-col items-center leading-none">
              <span>BUILT AROUND YOUR</span>
              <span className="text-brand w-full">OBSESSION.</span>
            </h2>

            <div className="grid border border-border-dark/40 md:grid-cols-3">
              <article className="border-b md:border-b-0 md:border-r border-border-dark/40 p-6 md:p-12">
                <h4 className="display-kicker flex items-center gap-3 text-2xl mb-6">
                  <Layers
                    className="h-6 w-6 text-[#ffb3af]"
                    strokeWidth={1.5}
                  />
                  BACKGROUND DESIGN
                </h4>
                <ul className="space-y-4 technical-label text-sm uppercase tracking-[0.16em] text-[#888888]">
                  <li><span className="text-brand mr-2">●</span>Carbon Grid</li>
                  <li><span className="text-brand mr-2">●</span>Race Topography</li>
                  <li><span className="text-brand mr-2">●</span>Solid Monolith Tone</li>
                  <li><span className="text-brand mr-2">●</span>Custom Print Direction</li>
                </ul>
              </article>

              <article className="border-b md:border-b-0 md:border-r border-border-dark/40 bg-brand/10 p-6 md:p-12">
                <h4 className="display-kicker flex items-center gap-3 text-2xl mb-6">
                  <CarFront
                    className="h-6 w-6 text-[#ffb3af]"
                    strokeWidth={1.5}
                  />
                  CAR MODEL
                </h4>
                <ul className="space-y-4 technical-label text-sm uppercase tracking-[0.16em] text-[#888888]">
                  <li><span className="text-brand mr-2">●</span>1:64 Scale Focus</li>
                  <li><span className="text-brand mr-2">●</span>Hot Wheels / Matchbox</li>
                  <li><span className="text-brand mr-2">●</span>Tomica Premium</li>
                  <li><span className="text-brand mr-2">●</span>Send Your Own Model</li>
                </ul>
              </article>

              <article className="p-6 md:p-12">
                <h4 className="display-kicker flex items-center gap-3 text-2xl mb-6">
                  <FileText
                    className="h-6 w-6 text-[#ffb3af]"
                    strokeWidth={1.5}
                  />
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
        </section>

        {/* 6. Social Proof */}
        <section className="bg-[#0F0F0F] py-24 md:py-32">
          <div className="frame-container">
            <h2 className="display-kicker text-5xl leading-none md:text-7xl mb-16">
              50+ FRAMES DELIVERED.
              <br />
              <span className="text-[#ffb3af]">ZERO COMPLAINTS.</span>
            </h2>

            <div className="grid gap-8 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <article
                  key={testimonial.quote}
                  className="border-l-4 border-brand bg-[#1A1614] p-10 flex flex-col gap-8 relative overflow-hidden"
                >
                  <div className="absolute -top-8 left-2 text-[200px] leading-none opacity-5 display-kicker text-text-primary select-none pointer-events-none">
                    &ldquo;
                  </div>

                  <p className="text-lg italic font-light text-text-primary relative z-10">
                    "{testimonial.quote}"
                  </p>
                  <p className="technical-label mt-auto text-[11px] text-text-muted uppercase tracking-widest relative z-10">
                    — {testimonial.author.split(',')[0]} <span className="text-brand mx-1">●</span> {testimonial.author.split(',')[1]}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Final CTA */}
        <section className="bg-linear-to-r from-[#380306] to-[#8E130C] py-24 text-center texture-overlay">
          <div className="frame-container relative z-10">
            <h2 className="display-kicker text-5xl md:text-8xl mb-10 tracking-tighter">
              {COPY.finalCtaHeading}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm text-[#f7dcda] mb-10">
              Rs. 5,000. Fully customised. Delivered nationwide. Takes 2 minutes
              to order.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-[#810c0c] text-[#030303] display-kicker text-2xl tracking-[0.2em] w-full md:w-auto px-8 md:px-16 py-4 md:py-6 hover:bg-[#f5f5f5] hover:text-[#030303] transition-all"
            >
              ORDER NOW
            </Link>

            <p className="mt-12 text-[10px] uppercase tracking-[0.3em] text-[#f1c0bc] display-kicker">
              NATIONWIDE DELIVERY · SECURE PAYMENT · HANDCRAFTED TO ORDER
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
