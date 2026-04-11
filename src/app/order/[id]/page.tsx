import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getProductBySlug } from "@/lib/mock-data";
import { getOrderById } from "@/lib/mock-services";

type OrderConfirmationProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderConfirmationPage({ params }: OrderConfirmationProps) {
  const { id } = await params;
  const order = getOrderById(id);

  if (!order) {
    notFound();
  }

  const product = getProductBySlug(order.productSlug);

  return (
    <>
      <SiteHeader />
      <main className="pb-24 pt-14">
        <section className="frame-container">
          <article className="mx-auto max-w-4xl border border-border-dark bg-bg-surface p-8 md:p-12">
            <p className="technical-label text-[10px] text-text-muted">Order Confirmation</p>
            <h1 className="display-kicker mt-4 text-6xl leading-none md:text-8xl">ORDER RECEIVED</h1>

            <p className="mt-6 max-w-2xl text-sm text-text-muted">
              Your request has been captured. This frontend phase simulates payment confirmation and order storage.
            </p>

            <div className="mt-8 inline-flex border border-[#2e6f4f] bg-[#173628] px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-[#9bf0ba]">
              Payment Pipeline: Captured
            </div>

            <div className="mt-6 grid gap-3 border border-border-dark/60 bg-bg-recessed p-7 text-sm">
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
                <span className="text-text-muted">Payment status:</span> {order.paymentStatus} (mocked)
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="display-kicker border border-brand bg-brand px-6 py-3 text-xs transition-colors hover:bg-brand-mid"
              >
                ORDER ANOTHER FRAME
              </Link>
              <Link
                href="/"
                className="display-kicker border border-border-dark px-6 py-3 text-xs transition-colors hover:bg-bg-elevated"
              >
                BACK TO HOME
              </Link>
            </div>
          </article>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
