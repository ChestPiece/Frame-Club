import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { getProducts } from "@/lib/mock-data";

export default function Home() {
  const featuredProducts = getProducts().slice(0, 3);
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
      quote: "Finally a way to display my R34 collection properly. Packing was bulletproof for shipping to Karachi.",
      author: "Hamza K., Karachi",
    },
    {
      quote: "The custom technical data sheet background is a game changer. Every car guy needs one of these.",
      author: "Zaid S., Islamabad",
    },
  ];

  return (
    <>
      <SiteHeader />

      <main className="pb-20">
        <section className="relative overflow-hidden border-b border-border-dark bg-bg-base py-24 md:py-32">
          <div className="pointer-events-none absolute -left-32 -bottom-44 h-136 w-136 bg-[radial-gradient(circle_at_bottom_left,rgba(56,3,6,0.35),transparent_68%)]" />
          <div className="frame-container relative grid items-center gap-14 md:grid-cols-2">
            <div className="space-y-6">
              <p className="technical-label text-[11px] text-text-muted">Frame Club Pakistan</p>
              <h1 className="display-kicker text-6xl leading-[0.9] md:text-9xl">
                YOUR FAVOURITE <span className="text-[#ffb3af]">CAR.</span>
                <br />
                FRAMED. <span className="text-brand-mid">FOREVER.</span>
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-text-muted md:text-lg">
                Custom diecast frames for the car obsessed. Nationwide delivery across Pakistan.
              </p>
              <Link
                href="/shop"
                className="display-kicker inline-flex border border-brand bg-brand px-8 py-4 text-sm text-text-primary transition-colors hover:bg-brand-mid"
              >
                Order Your Frame — Rs. 5,000
              </Link>
            </div>

            <div className="border border-border-dark/40 bg-bg-recessed p-7 shadow-[0_0_80px_rgba(56,3,6,0.12)]">
              <img
                src={featuredProducts[0]?.images[0]}
                alt={featuredProducts[0]?.name ?? "Featured frame"}
                className="aspect-4/5 w-full object-cover grayscale brightness-90 transition duration-700 hover:grayscale-0"
              />
              <p className="technical-label mt-4 border-l-2 border-brand pl-3 text-[10px] text-text-muted">
                Model 01: The Silver Legend
              </p>
            </div>
          </div>
        </section>

        <section className="bg-bg-surface py-24 md:py-32">
          <div className="frame-container grid gap-16 md:grid-cols-2">
            <h2 className="display-kicker text-5xl leading-none md:sticky md:top-28 md:text-7xl">
              NOT A POSTER.
              <br />
              NOT A TOY.
              <br />
              SOMETHING BETTER.
            </h2>
            <div className="space-y-8 text-text-muted">
              <p>
                Every frame is built to order around your selected car and your chosen background design. No warehouse stock, no random variants, and no shortcuts.
              </p>
              <p>
                Each unit is sourced, assembled, and finished by hand. The website captures your request, then production starts.
              </p>

              <div className="space-y-5 pt-2">
                <article className="flex gap-4">
                  <span className="display-kicker text-3xl text-brand">01</span>
                  <p className="text-sm leading-relaxed text-text-muted">Museum-style framing, archival mounting, and clean typography built for long-term display.</p>
                </article>
                <article className="flex gap-4">
                  <span className="display-kicker text-3xl text-brand">02</span>
                  <p className="text-sm leading-relaxed text-text-muted">Built manually for each order, from model sourcing to final sealing and shipping prep.</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-bg-recessed py-24 md:py-32">
          <div className="frame-container">
            <div className="mb-14 flex flex-wrap items-end justify-between gap-4">
              <h2 className="display-kicker text-5xl leading-tight md:text-7xl">
                THREE STEPS. ONE FRAME. DELIVERED TO YOUR DOOR.
              </h2>
              <p className="technical-label text-[10px] text-text-muted">Three Steps to Perfection</p>
            </div>
            <div className="grid gap-0 md:grid-cols-3">
              {steps.map((step, index) => (
                <article key={step} className="aspect-square border border-border-dark/30 bg-bg-surface p-10">
                  <p className="display-kicker text-4xl text-brand">0{index + 1}</p>
                  <p className="display-kicker mt-8 text-4xl leading-none">{step}</p>
                  <p className="mt-5 text-sm text-text-muted">
                    {index === 0
                      ? "Select from available models or request your preferred car." 
                      : index === 1
                        ? "Choose your background style and share notes for the build." 
                        : "We source, build, and ship your frame nationwide across Pakistan."}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border-dark/40 bg-bg-surface py-24 md:py-32">
          <div className="frame-container">
            <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
              <h2 className="display-kicker text-5xl md:text-7xl">THE COLLECTION</h2>
              <p className="max-w-xl text-sm text-text-muted">
                Every frame is made to order. No two are exactly alike.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {featuredProducts.map((product) => (
                <article key={product.id} className="group border border-border-dark bg-bg-recessed">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="aspect-square w-full object-cover grayscale transition-all duration-700 group-hover:scale-[1.02] group-hover:grayscale-0"
                  />

                  <div className="space-y-4 p-8">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="display-kicker text-3xl leading-none">{product.name}</h3>
                      <p className="technical-label text-[10px] text-[#ffb3af]">Rs. {product.price.toLocaleString("en-PK")}</p>
                    </div>

                    <p className="text-xs uppercase tracking-[0.2em] text-text-muted">{product.brand}</p>
                    <StatusBadge status={product.status} />

                    <Link
                      href={`/shop/${product.slug}`}
                      className="display-kicker inline-flex w-full justify-center border border-border-dark px-4 py-3 text-xs transition-colors hover:bg-bg-elevated"
                    >
                      VIEW SPECS
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-bg-base py-24 md:py-32">
          <div className="frame-container">
            <h2 className="display-kicker text-center text-5xl md:text-8xl">BUILT AROUND YOUR OBSESSION.</h2>

            <div className="mt-14 grid border border-border-dark/40 md:grid-cols-3">
              <article className="border-r border-border-dark/40 p-10">
                <p className="display-kicker text-3xl">BACKGROUND DESIGN</p>
                <ul className="mt-6 space-y-3 text-xs uppercase tracking-[0.16em] text-text-muted">
                  <li>Carbon Grid</li>
                  <li>Race Topography</li>
                  <li>Solid Monolith Tone</li>
                  <li>Custom Print Direction</li>
                </ul>
              </article>

              <article className="border-r border-border-dark/40 bg-bg-surface p-10">
                <p className="display-kicker text-3xl">CAR MODEL</p>
                <ul className="mt-6 space-y-3 text-xs uppercase tracking-[0.16em] text-text-muted">
                  <li>1:64 Scale Focus</li>
                  <li>Hot Wheels / Matchbox</li>
                  <li>Tomica Premium</li>
                  <li>Send Your Own Model</li>
                </ul>
              </article>

              <article className="p-10">
                <p className="display-kicker text-3xl">PRINTED SPECS</p>
                <ul className="mt-6 space-y-3 text-xs uppercase tracking-[0.16em] text-text-muted">
                  <li>Performance Data</li>
                  <li>Production History</li>
                  <li>Owner Tags</li>
                  <li>Edition Numbering</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="bg-bg-surface py-24 md:py-32">
          <div className="frame-container">
            <h2 className="display-kicker text-5xl leading-none md:text-7xl">
              50+ FRAMES DELIVERED.
              <br />
              ZERO COMPLAINTS.
            </h2>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <article key={testimonial.quote} className="border-l-2 border-brand bg-bg-recessed p-8">
                  <div className="mb-5 flex gap-1 text-[#ffb3af]" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span key={index} className="text-sm leading-none">
                        &#9733;
                      </span>
                    ))}
                  </div>

                  <p className="italic text-text-primary">"{testimonial.quote}"</p>
                  <p className="technical-label mt-5 text-[10px] text-text-muted">{testimonial.author}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border-dark/40 bg-linear-to-r from-brand to-brand-mid py-20 text-center md:py-24">
          <div className="frame-container">
            <h2 className="display-kicker text-5xl leading-none md:text-8xl">READY TO FRAME YOUR OBSESSION?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm text-[#f7dcda]">
              Rs. 5,000. Fully customised. Delivered nationwide. Takes 2 minutes to order.
            </p>
            <Link
              href="/shop"
              className="display-kicker mt-8 inline-flex border border-[#f5f5f5] bg-[#f5f5f5] px-10 py-4 text-sm text-[#141313] transition-colors hover:bg-[#141313] hover:text-[#f5f5f5]"
            >
              ORDER NOW
            </Link>

            <p className="mt-6 text-[10px] uppercase tracking-[0.18em] text-[#f1c0bc]">
              Nationwide Delivery Pakistan | Secure Payment | Handcrafted to Order
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
