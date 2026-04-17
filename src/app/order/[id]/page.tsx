import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { getProductBySlug } from "@/lib/shop/data";
import { verifyOrderAccessToken } from "@/lib/payment/order-access-token";
import { getOrderById } from "@/lib/db/services";

type OrderConfirmationProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
};

export default async function OrderConfirmationPage({ params, searchParams }: OrderConfirmationProps) {
  const { id } = await params;
  const { token } = await searchParams;

  if (!verifyOrderAccessToken(id, token)) {
    notFound();
  }

  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const product = await getProductBySlug(order.productSlug);
  const isPaymentFailed = order.paymentStatus === "failed";
  const retryHref = `/checkout?orderId=${id}`;

  return (
    <>
      <main id="main-content" className="pb-24 pt-14">
        <section className="frame-container">
          <article className="mx-auto max-w-4xl border border-border bg-bg-surface p-8 md:p-12">
            <p className="technical-label text-[10px] text-text-muted">Order Confirmation</p>
            <h1 className="display-kicker mt-4 text-4xl leading-none sm:text-5xl md:text-8xl">
              {isPaymentFailed ? "PAYMENT ISSUE" : "ORDER CONFIRMED"}
            </h1>

            <p className="mt-6 max-w-2xl text-sm text-text-muted">
              {isPaymentFailed
                ? "Your payment could not be processed. Please try again or contact us."
                : "Thank you for your order. We've received your payment and your custom frame is now in the queue. You'll receive an email confirmation shortly."}
            </p>

            {isPaymentFailed ? (
              <div className="mt-8 inline-flex border border-brand-mid bg-brand px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-text-accent">
                Payment Failed
              </div>
            ) : (
              <div className="mt-8 inline-flex border border-status-success-border bg-status-success-bg px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-text-success">
                Payment Pipeline: Captured
              </div>
            )}

            <div className="mt-6 grid gap-3 border border-border/60 bg-bg-deep p-7 text-sm">
              <p>
                <span className="text-text-muted">Order ID:</span> {id}
              </p>
              <p>
                <span className="text-text-muted">Order Number:</span> {order.orderNumber}
              </p>
              <p>
                <span className="text-text-muted">Customer:</span> {order.customerName}
              </p>
              <p>
                <span className="text-text-muted">City:</span> {order.customerCity}
              </p>
              <p>
                <span className="text-text-muted">Frame:</span> {product?.name || "Not selected"}
              </p>
              <p>
                <span className="text-text-muted">Background:</span> {order.customization.background}
              </p>
              <p>
                <span className="text-text-muted">Notes:</span> {order.customization.notes || "None"}
              </p>
              <p>
                <span className="text-text-muted">Payment status:</span> {order.paymentStatus}{process.env.PAYFAST_SANDBOX === "true" ? " (sandbox)" : ""}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {isPaymentFailed ? (
                <Button render={<Link href={retryHref} />} variant="brand" className="display-kicker">
                  TRY AGAIN
                </Button>
              ) : null}
              <Button
                render={<Link href="/shop" />}
                variant={isPaymentFailed ? "outline" : "brand"}
                className="display-kicker"
              >
                ORDER ANOTHER FRAME
              </Button>
              <Button
                render={<Link href="/" />}
                variant="outline"
                className="display-kicker"
              >
                BACK TO HOME
              </Button>
            </div>
          </article>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
