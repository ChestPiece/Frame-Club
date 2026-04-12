import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { getProductBySlug } from "@/lib/data";
import { getOrderById } from "@/lib/services";

type OrderConfirmationProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderConfirmationPage({ params }: OrderConfirmationProps) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const product = await getProductBySlug(order.productSlug);

  return (
    <>
      <SiteHeader />
      <main className="pb-24 pt-14">
        <section className="frame-container">
          <article className="mx-auto max-w-4xl border border-border-dark bg-bg-surface p-8 md:p-12">
            <p className="technical-label text-[10px] text-text-muted">Order Confirmation</p>
            <h1 className="display-kicker mt-4 text-4xl leading-none sm:text-5xl md:text-8xl">ORDER RECEIVED</h1>

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
                <span className="text-text-muted">Payment status:</span> {order.paymentStatus}{process.env.PAYFAST_SANDBOX === "true" ? " (sandbox)" : ""}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                render={<Link href="/shop" />}
                variant="brand"
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
