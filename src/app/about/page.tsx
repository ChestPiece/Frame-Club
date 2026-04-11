import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="pb-24">
        <section className="relative overflow-hidden border-b border-border-dark bg-bg-surface py-20">
          <div className="pointer-events-none absolute -right-28 top-0 h-80 w-80 bg-[radial-gradient(circle_at_top_right,rgba(56,3,6,0.35),transparent_70%)]" />

          <div className="frame-container relative max-w-6xl">
            <p className="technical-label text-[10px] text-text-muted">About Frame Club</p>
            <h1 className="display-kicker mt-4 text-6xl leading-none md:text-8xl">WHERE SPEED MEETS ART</h1>
            <p className="mt-8 max-w-3xl text-base leading-relaxed text-text-muted">
              Frame Club started through Instagram DMs and has already delivered over 50 made-to-order frames across Pakistan. Each customer chooses a car model and a background design, then production starts manually.
            </p>
          </div>
        </section>

        <section className="border-b border-border-dark/40 bg-bg-base py-16">
          <div className="frame-container grid gap-6 md:grid-cols-3">
            <article className="border border-border-dark bg-bg-recessed p-8">
              <p className="display-kicker text-3xl">One Product</p>
              <p className="mt-3 text-sm text-text-muted">Custom diecast frame, made to order.</p>
            </article>

            <article className="border border-border-dark bg-bg-recessed p-8">
              <p className="display-kicker text-3xl">One Price</p>
              <p className="mt-3 text-sm text-text-muted">Rs. 5,000 with full custom setup.</p>
            </article>

            <article className="border border-border-dark bg-bg-recessed p-8">
              <p className="display-kicker text-3xl">Nationwide</p>
              <p className="mt-3 text-sm text-text-muted">Handcrafted and shipped across Pakistan.</p>
            </article>
          </div>
        </section>

        <section className="bg-bg-recessed py-16">
          <div className="frame-container grid gap-8 md:grid-cols-3">
            <article className="border border-border-dark/50 bg-bg-surface p-7">
              <p className="technical-label text-[10px] text-text-muted">Phase 01</p>
              <p className="display-kicker mt-4 text-3xl leading-none">DM ERA</p>
              <p className="mt-4 text-sm text-text-muted">Orders were captured manually through Instagram messages and tracked one by one.</p>
            </article>

            <article className="border border-border-dark/50 bg-bg-surface p-7">
              <p className="technical-label text-[10px] text-text-muted">Phase 02</p>
              <p className="display-kicker mt-4 text-3xl leading-none">WORKSHOP FLOW</p>
              <p className="mt-4 text-sm text-text-muted">Every frame is sourced, assembled, and finished by a single production workflow.</p>
            </article>

            <article className="border border-border-dark/50 bg-bg-surface p-7">
              <p className="technical-label text-[10px] text-text-muted">Phase 03</p>
              <p className="display-kicker mt-4 text-3xl leading-none">DIGITAL STOREFRONT</p>
              <p className="mt-4 text-sm text-text-muted">This site now captures demand cleanly while preserving a handcrafted fulfillment process.</p>
            </article>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
