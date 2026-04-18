import type { Product } from "@/lib/db/types";
import { formatPkr } from "@/lib/utils";

type CheckoutSummaryProps = {
  product: Product | undefined;
  background: string;
  notes: string;
};

export function CheckoutSummary({ product, background, notes }: CheckoutSummaryProps) {
  return (
    <aside className="min-w-0 space-y-9 border border-border bg-bg-deep p-6 sm:p-8 md:p-10">
      <div className="border-b border-border pb-6">
        <p className="technical-label text-[10px] text-text-muted">Cart Summary</p>
        <p className="mt-3 display-kicker text-2xl leading-none sm:text-4xl">
          {product?.name ?? "No frame selected"}
        </p>
        <p className="mt-4 text-xs uppercase tracking-[0.2em] text-text-muted">
          {product?.brand ?? "Select from collection"}
        </p>
      </div>

      <div className="space-y-4 border border-border/60 bg-bg-surface p-6 text-sm">
        <div className="flex items-baseline justify-between gap-4 py-1">
          <span className="text-text-muted">Product</span>
          <span className="shrink-0 text-text-primary">{product ? formatPkr(product.price) : "—"}</span>
        </div>
        <div className="flex items-baseline justify-between gap-4 py-1">
          <span className="text-text-muted">Shipping</span>
          <span className="shrink-0 text-text-primary">Included</span>
        </div>
        <div className="flex items-baseline justify-between gap-4 py-1">
          <span className="text-text-muted">Background</span>
          <span className="min-w-0 shrink text-right text-text-primary">{background}</span>
        </div>
      </div>

      <div className="space-y-3 border border-border/50 bg-bg-surface p-6 text-sm text-text-muted">
        <p className="technical-label text-[10px]">Order Notes</p>
        <p className="leading-relaxed">{notes || "No notes provided."}</p>
      </div>

      <div className="border-t border-border/70 pt-6">
        <p className="technical-label text-[10px] text-text-muted">Total</p>
        <p className="mt-3 text-3xl text-text-primary">{product ? formatPkr(product.price) : "—"}</p>
      </div>

      <div className="border border-border/60 bg-bg-surface p-5 sm:p-6">
        <p className="technical-label text-[10px] text-text-muted">Payment Method</p>
        <p className="mt-3 text-sm text-text-primary">PayFast (secure checkout)</p>
      </div>

      <p className="text-[10px] uppercase leading-relaxed tracking-[0.16em] text-text-muted">
        Nationwide delivery Pakistan | Secure payment | Handcrafted to order
      </p>
    </aside>
  );
}
