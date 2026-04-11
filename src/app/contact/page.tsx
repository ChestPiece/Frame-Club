import Link from "next/link";
import { ContactForm } from "./contact-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";

type ContactPageProps = {
  searchParams: Promise<{ intent?: string; product?: string }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const intentIsNotify = params.intent === "notify";

  return (
    <>
      <SiteHeader />
      <main className="pb-24">
        <section className="border-b border-border-dark bg-bg-surface py-14">
          <div className="frame-container grid gap-8 lg:grid-cols-[1.25fr_1fr]">
            <article className="space-y-8 border border-border-dark bg-bg-base p-8 md:p-10">
              <p className="technical-label text-[10px] text-text-muted">Contact</p>
              <h1 className="display-kicker text-6xl leading-none md:text-8xl">TALK TO FRAME CLUB</h1>
              <p className="max-w-xl text-sm leading-relaxed text-text-muted">
                For quick coordination, WhatsApp is the fastest channel. You can also submit details for callback and production updates.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <article className="border border-border-dark/60 bg-bg-recessed p-5">
                  <p className="technical-label text-[10px] text-text-muted">Primary Channel</p>
                  <p className="display-kicker mt-3 text-2xl">WhatsApp</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-text-muted">Fastest response flow</p>
                </article>

                <article className="border border-border-dark/60 bg-bg-recessed p-5">
                  <p className="technical-label text-[10px] text-text-muted">Instagram</p>
                  <p className="display-kicker mt-3 text-2xl">@frameclub__</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-text-muted">Legacy DM channel</p>
                </article>
              </div>

              <Button
                render={<Link href="https://wa.me/923001234567" />}
                variant="brand"
                size="lg"
                className="display-kicker px-7 text-sm"
              >
                OPEN WHATSAPP
              </Button>
            </article>

            <article className="space-y-4 border border-border-dark bg-bg-recessed p-8 md:p-10">
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
      </main>
      <SiteFooter />
    </>
  );
}
