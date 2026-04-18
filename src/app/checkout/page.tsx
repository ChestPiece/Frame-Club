import { SiteFooter } from "@/components/layout/site-footer";
import { getProductBySlug } from "@/lib/shop/data";
import { verifyOrderAccessToken } from "@/lib/payment/order-access-token";
import { getOrderById } from "@/lib/db/services";
import { CheckoutForm } from "@/components/checkout/checkout-form";

type CheckoutPageProps = {
  searchParams: Promise<{
    slug?: string;
    background?: string;
    notes?: string;
    orderId?: string;
    token?: string;
  }>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;

  let retryOrder = null;
  if (
    params.orderId &&
    params.token &&
    verifyOrderAccessToken(params.orderId, params.token)
  ) {
    const order = await getOrderById(params.orderId);
    if (order?.paymentStatus === "failed") {
      retryOrder = order;
    }
  }
  const slug = params.slug ?? retryOrder?.productSlug ?? "";
  const background = params.background ?? retryOrder?.customization.background ?? "carbon-grid";
  const notes = params.notes ?? retryOrder?.customization.notes ?? "";
  const product = await getProductBySlug(slug);

  return (
    <>
      <main id="main-content" className="pb-24">
        <section className="border-b border-border bg-bg-surface py-14">
          <div className="frame-container">
            <p className="technical-label text-[10px] text-text-muted">Checkout</p>
            <h1 className="display-kicker mt-4 text-4xl leading-none sm:text-5xl md:text-8xl">COMPLETE YOUR ORDER</h1>
            <p className="mt-4 max-w-2xl text-sm text-text-muted">
              Confirm your frame details, complete shipping information, and proceed to PayFast.
            </p>
            <p className="mt-3 text-[10px] uppercase tracking-[0.16em] text-text-accent">No COD. Full upfront payment only.</p>
          </div>
        </section>

        <section className="frame-container py-14">
          <CheckoutForm
            product={product}
            slug={slug}
            background={background}
            notes={notes}
            initialValues={{
              customerName: retryOrder?.customerName,
              customerEmail: retryOrder?.customerEmail,
              customerPhone: retryOrder?.customerPhone,
              customerAddress: retryOrder?.customerAddress,
              customerCity: retryOrder?.customerCity,
            }}
          />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
