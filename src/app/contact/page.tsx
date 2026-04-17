import Link from "next/link";
import { ContactForm } from "@/components/contact/contact-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { ContactAnimations } from "@/components/contact/contact-animations";
import { PageScrollAnimations } from "@/components/shared/page-scroll-animations";
import { Button } from "@/components/ui/button";
import { WHATSAPP_LINK } from "@/lib/content/copy-constants";

type ContactPageProps = {
  searchParams: Promise<{ intent?: string; product?: string }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const intentIsNotify = params.intent === "notify";
  const pageTitle = intentIsNotify ? "GET NOTIFIED" : "GENERAL CONTACT";
  const pageSubtitle = intentIsNotify
    ? `You requested updates for ${params.product ?? "an unavailable model"}. Submit your email and we will notify you as soon as it returns.`
    : "Leave your details and we will reach out with production guidance and next steps.";

  return (
    <>
      <main id="main-content" className="min-h-dvh pt-30 pb-0">
        <PageScrollAnimations config="contact">
          <ContactAnimations />
          <section
            data-animate-page="contact"
            className="bg-bg-recessed py-14 sm:py-18 lg:py-24"
          >
            <div className="frame-container mx-auto w-full max-w-2xl">
              <div className="border-t border-brand bg-bg-surface px-6 py-8 sm:px-10 sm:py-10">
                <p data-contact-kicker className="technical-label text-[10px] text-text-muted">
                  Contact
                </p>
                <h1
                  data-contact-heading
                  className="display-kicker mt-5 text-5xl leading-none sm:text-6xl md:text-7xl"
                >
                  {pageTitle}
                </h1>
                <p data-animate-item className="mt-6 max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base">
                  {pageSubtitle}
                </p>

                <div data-animate-item className="mt-10 border border-border/60 bg-bg-elevated px-5 py-6 sm:px-8 sm:py-8">
                  <ContactForm intentIsNotify={intentIsNotify} productSlug={params.product} />
                </div>

                <div data-animate-item className="mt-6 border-t border-border/40 pt-5">
                  <p className="technical-label text-[10px] text-text-muted">Need urgent support?</p>
                  <Button
                    render={<Link href={WHATSAPP_LINK} />}
                    variant="outline"
                    size="sm"
                    className="display-kicker min-touch-target mt-3 w-full border-border/70 px-6 text-xs text-text-primary hover:border-brand/70 sm:w-auto"
                  >
                    OPEN WHATSAPP
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </PageScrollAnimations>
      </main>
      <SiteFooter />
    </>
  );
}
