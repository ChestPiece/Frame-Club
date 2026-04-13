import Link from "next/link";
import { ContactForm } from "./contact-form";
import { SiteFooter } from "@/components/layout/site-footer";
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
      <main id="main-content" className="pb-24 pt-30">
        <PageScrollAnimations config="contact">
        <section data-animate-page="contact" className="border-b border-border-dark bg-bg-surface py-14">
          <div className="frame-container grid gap-8 md:grid-cols-2 lg:grid-cols-[1.25fr_1fr]">
            <article data-animate-item className="space-y-8 border border-border-dark bg-bg-base p-8 md:p-10">
              <p className="technical-label text-[10px] text-text-muted">Contact</p>
              <h1 className="display-kicker text-4xl leading-none sm:text-5xl md:text-7xl">TALK TO FRAME CLUB</h1>
              <p className="max-w-xl text-sm leading-relaxed text-text-muted">
                For quick coordination, WhatsApp is the fastest channel. You can also submit details for callback and production updates.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <article data-animate-item className="border border-border-dark/60 bg-bg-recessed p-5">
                  <p className="technical-label text-[10px] text-text-muted">Primary Channel</p>
                  <p className="display-kicker mt-3 text-2xl">WhatsApp</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-text-muted">Fastest response flow</p>
                </article>

                <article data-animate-item className="border border-border-dark/60 bg-bg-recessed p-5">
                  <p className="technical-label text-[10px] text-text-muted">Instagram</p>
                  <p className="display-kicker mt-3 text-2xl">@frameclub__</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-text-muted">Legacy DM channel</p>
                </article>
              </div>

              <Button
                render={<Link href={WHATSAPP_LINK} />}
                variant="brand"
                size="lg"
                className="display-kicker px-7 text-sm"
              >
                OPEN WHATSAPP
              </Button>
            </article>

            <article data-animate-item className="space-y-4 border border-border-dark bg-bg-recessed p-8 md:p-10">
              <p className="technical-label text-[10px] text-text-muted">
                {intentIsNotify ? "Notify Request" : "General Contact"}
              </p>
              <p className="text-sm text-text-muted">
                {intentIsNotify
                  ? `You requested a notification for ${params.product ?? "an unavailable model"}.`
                  : "Leave your email and we will reach out."}
              </p>
              <ContactForm intentIsNotify={intentIsNotify} productSlug={params.product} />
            </article>
          </div>
        </section>
        </PageScrollAnimations>
      </main>
      <SiteFooter />
    </>
  );
}
