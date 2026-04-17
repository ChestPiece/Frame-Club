import { TransitionLink } from "@/components/layout/page-transition";
import { SiteFooter } from "@/components/layout/site-footer";
import { AboutAnimations } from "@/components/about/about-animations";
import { PageScrollAnimations } from "@/components/shared/page-scroll-animations";

export default function AboutPage() {
  return (
    <>
      <main id="main-content" className="pb-24 pt-30">
        <PageScrollAnimations config="about">
          <AboutAnimations />
          <section className="border-t border-border/20" />
          <section
            data-animate-page="about"
            className="relative overflow-hidden border-b border-border bg-bg-surface py-28 sm:py-36"
          >
            <div className="pointer-events-none absolute -right-28 top-0 h-80 w-80 bg-[radial-gradient(circle_at_top_right,rgba(53,4,7,0.35),transparent_70%)]" />

            <div className="frame-container relative max-w-6xl md:grid md:grid-cols-2 md:gap-10">
              <div className="min-inline-safe">
                <p
                  data-about-kicker
                  className="technical-label text-[10px] text-text-muted"
                >
                  About Frame Club
                </p>
                <svg
                  aria-hidden="true"
                  data-drawsvg-about-kicker
                  className="mt-3 mb-4 h-px w-32 max-w-full block text-brand"
                  viewBox="0 0 128 1"
                  preserveAspectRatio="none"
                >
                  <line
                    x1="0"
                    y1="0.5"
                    x2="128"
                    y2="0.5"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                </svg>
                <h2
                  data-about-heading
                  className="display-kicker mt-4 text-4xl leading-none sm:text-5xl md:text-7xl"
                >
                  WHERE SPEED MEETS ART
                </h2>
              </div>
              <div className="min-inline-safe">
                <p
                  data-animate-item
                  className="mt-8 md:mt-0 text-base leading-relaxed text-text-muted"
                >
                  Frame Club started through Instagram DMs and has already
                  delivered over 50 made-to-order frames across Pakistan. Each
                  customer chooses a car model and a background design, then
                  production starts manually.
                </p>
                <p className="mt-8 text-2xl leading-snug text-text-muted">
                  Started in Instagram DMs. 50+ frames later, we built this.
                </p>
              </div>
            </div>
          </section>
          <section className="bg-bg-deep py-20 sm:py-24">
            <div className="frame-container">
              <p className="technical-label mb-10 text-[10px] text-text-muted sm:mb-12">
                The Journey
              </p>
              <div className="relative">
                <svg
                  aria-hidden="true"
                  data-drawsvg-timeline
                  className="pointer-events-none absolute left-0 top-5 hidden h-px w-full md:block"
                  viewBox="0 0 1000 1"
                  preserveAspectRatio="none"
                >
                  <line
                    x1="0"
                    y1="0.5"
                    x2="1000"
                    y2="0.5"
                    stroke="var(--brand)"
                    strokeWidth="1"
                  />
                </svg>
                <div className="grid gap-10 md:grid-cols-3 md:gap-10">
                  <article
                    data-timeline-node="1"
                    className="relative border-l border-border/20 pl-6 md:border-l-0 md:pl-0"
                  >
                    <div
                      className="mb-6 hidden h-2.5 w-2.5 bg-brand md:mb-8 md:block"
                      aria-hidden
                    />
                    <p className="technical-label text-[10px] text-text-muted">
                      1 / Phase 01
                    </p>
                    <p
                      data-timeline-heading
                      className="display-kicker mt-4 text-5xl sm:text-6xl leading-none"
                    >
                      DM ERA
                    </p>
                    <p
                      data-animate-item
                      className="mt-4 py-2 text-sm text-text-muted"
                    >
                      Orders were captured manually through Instagram messages
                      and tracked one by one.
                    </p>
                  </article>

                  <article
                    data-timeline-node="2"
                    className="relative border-l border-border/20 pl-6 md:border-l-0 md:pl-0"
                  >
                    <div
                      className="mb-6 hidden h-2.5 w-2.5 bg-brand md:mb-8 md:block"
                      aria-hidden
                    />
                    <p className="technical-label text-[10px] text-text-muted">
                      2 / Phase 02
                    </p>
                    <p
                      data-timeline-heading
                      className="display-kicker mt-4 text-5xl sm:text-6xl leading-none"
                    >
                      WORKSHOP FLOW
                    </p>
                    <p
                      data-animate-item
                      className="mt-4 py-2 text-sm text-text-muted"
                    >
                      Every frame is sourced, assembled, and finished by a
                      single production workflow.
                    </p>
                  </article>

                  <article
                    data-timeline-node="3"
                    className="relative border-l border-border/20 pl-6 md:border-l-0 md:pl-0"
                  >
                    <div
                      className="mb-6 hidden h-2.5 w-2.5 bg-brand md:mb-8 md:block"
                      aria-hidden
                    />
                    <p className="technical-label text-[10px] text-text-muted">
                      3 / Phase 03
                    </p>
                    <p
                      data-timeline-heading
                      className="display-kicker mt-4 text-5xl sm:text-6xl leading-none"
                    >
                      DIGITAL STOREFRONT
                    </p>
                    <p
                      data-animate-item
                      className="mt-4 py-2 text-sm text-text-muted"
                    >
                      This site now captures demand cleanly while preserving a
                      handcrafted fulfillment process.
                    </p>
                  </article>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-bg-recessed py-24">
            <div className="frame-container text-center">
              <h2 className="display-kicker display-massive-fluid leading-none">
                WHERE SPEED MEETS ART
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-text-muted">
                Built for people who collect stories as seriously as they
                collect cars.
              </p>
              <TransitionLink
                href="/shop"
                className="display-kicker min-touch-target mt-10 inline-flex items-center justify-center border border-brand bg-brand px-8 py-4 text-sm tracking-[0.18em] text-text-primary transition-colors hover:bg-brand-mid"
              >
                ORDER NOW
              </TransitionLink>
            </div>
          </section>
        </PageScrollAnimations>
      </main>
      <SiteFooter />
    </>
  );
}
