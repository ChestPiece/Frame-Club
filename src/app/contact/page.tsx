import Link from "next/link";
import { ContactForm } from "./contact-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { ContactAnimations } from "@/components/contact/contact-animations";
import { PageScrollAnimations } from "@/components/shared/page-scroll-animations";
import { Button } from "@/components/ui/button";
import { WHATSAPP_LINK } from "@/lib/copy-constants";

type ContactPageProps = {
  searchParams: Promise<{ intent?: string; product?: string }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const intentIsNotify = params.intent === "notify";

  return (
    <>
      <main id="main-content" className="min-h-dvh pt-30 pb-0">
        <PageScrollAnimations config="contact">
          <ContactAnimations />
          <section
            data-animate-page="contact"
            className="relative grid min-h-[calc(100dvh-var(--header-height,5rem))] md:grid-cols-2"
          >
            <div
              className="pointer-events-none absolute inset-y-0 left-1/2 z-10 hidden -translate-x-1/2 md:block"
              aria-hidden="true"
            >
              <svg
                data-drawsvg-contact-divider
                className="h-full w-px text-brand"
                viewBox="0 0 1 1000"
                preserveAspectRatio="none"
              >
                <line x1="0.5" y1="0" x2="0.5" y2="1000" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>

            <div className="flex flex-col justify-between border-b border-border bg-bg-deep p-6 sm:p-10 md:border-b-0 md:border-r md:p-14">
              <div>
                <p data-contact-kicker className="technical-label text-[10px] text-text-muted">
                  Contact
                </p>
                <h1
                  data-contact-heading
                  className="display-kicker mt-6 text-5xl leading-none sm:text-6xl md:text-7xl lg:text-8xl"
                >
                  TALK TO
                  <br />
                  FRAME CLUB
                </h1>
                <p data-animate-item className="mt-8 max-w-sm text-sm leading-relaxed text-text-muted">
                  For quick coordination, WhatsApp is the fastest channel. You can also submit details for
                  callback and production updates.
                </p>
              </div>
              <div className="mt-12 space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <article className="border border-border/60 bg-bg-elevated p-5">
                    <p data-channel-label className="technical-label text-[10px] text-text-muted">
                      Primary Channel
                    </p>
                    <p className="display-kicker mt-3 text-2xl">WhatsApp</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.16em] text-text-muted">
                      Fastest response flow
                    </p>
                  </article>
                  <article className="border border-border/60 bg-bg-elevated p-5">
                    <p data-channel-label className="technical-label text-[10px] text-text-muted">
                      Instagram
                    </p>
                    <p className="display-kicker mt-3 text-2xl">@frameclub__</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.16em] text-text-muted">
                      Legacy DM channel
                    </p>
                  </article>
                </div>
                <Button
                  render={<Link href={WHATSAPP_LINK} />}
                  variant="brand"
                  size="lg"
                  className="display-kicker w-full px-7 text-sm sm:w-auto sm:self-start"
                >
                  OPEN WHATSAPP
                </Button>
              </div>
            </div>

            <div
              data-animate-item
              className="flex flex-col justify-center bg-bg-surface p-6 sm:p-10 md:p-14"
            >
              <p className="technical-label mb-4 text-[10px] text-text-muted">
                {intentIsNotify ? "Notify Request" : "General Contact"}
              </p>
              <p className="mb-8 text-sm text-text-muted">
                {intentIsNotify
                  ? `You requested a notification for ${params.product ?? "an unavailable model"}.`
                  : "Leave your email and we will reach out."}
              </p>
              <ContactForm intentIsNotify={intentIsNotify} productSlug={params.product} />
            </div>
          </section>
        </PageScrollAnimations>
      </main>
      <SiteFooter />
    </>
  );
}
