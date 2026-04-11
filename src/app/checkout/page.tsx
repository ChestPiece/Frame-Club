import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getProductBySlug } from "@/lib/mock-data";
import { CheckoutForm } from "./checkout-form";

type CheckoutPageProps = {
  searchParams: Promise<{
    slug?: string;
    background?: string;
    notes?: string;
  }>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;
  const slug = params.slug ?? "";
  const background = params.background ?? "carbon-grid";
  const notes = params.notes ?? "";
  const product = getProductBySlug(slug);

  return (
    <>
      <SiteHeader />
      <main className="pb-24">
        <section className="border-b border-border-dark bg-bg-surface py-14">
          <div className="frame-container">
            <p className="technical-label text-[10px] text-text-muted">Checkout</p>
            <h1 className="display-kicker mt-4 text-6xl leading-none md:text-8xl">COMPLETE YOUR ORDER</h1>
            <p className="mt-4 max-w-2xl text-sm text-text-muted">
              One product. One price. Rs. 5,000 paid via PayFast in production.
            </p>
            <p className="mt-3 text-[10px] uppercase tracking-[0.16em] text-[#f5c4c1]">No COD. Full upfront payment only.</p>
          </div>
        </section>

        <section className="frame-container py-14">
          <CheckoutForm product={product} slug={slug} background={background} notes={notes} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
