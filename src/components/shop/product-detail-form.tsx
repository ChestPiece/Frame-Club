"use client";

import Link from "next/link";
import { Clock3, Package, ShieldCheck } from "lucide-react";
import { TransitionLink } from "@/components/layout/page-transition";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { WHATSAPP_LINK } from "@/lib/content/copy-constants";
import { formatPkr } from "@/lib/utils";
import type { Product } from "@/lib/db/types";

const backgroundPatterns: Record<string, string | undefined> = {
  "carbon-grid": "repeating-linear-gradient(45deg, rgba(245,245,245,0.14) 0 1px, transparent 1px 4px)",
  "race-line": "linear-gradient(135deg, transparent 44%, rgba(245,245,245,0.18) 45%, transparent 46%)",
  atlas: "repeating-linear-gradient(90deg, rgba(245,245,245,0.14) 0 1px, transparent 1px 6px)",
  monolith: undefined,
};

type ProductDetailFormProps = {
  product: Product;
};

export function ProductDetailForm({ product }: ProductDetailFormProps) {
  const primaryCta = product.status === "preorder" ? "Pre-Order Now" : "Order Now";
  const preorderCopy = `Estimated delivery ${product.deliveryDays}-${product.deliveryDays + 3} working days`;

  return (
    <section className="lg:col-span-4">
      <div className="mb-8 border-b border-border/20 pb-6">
        <p className="technical-label text-[10px] text-text-muted">{product.brand}</p>
        <h1 className="display-kicker mt-3 text-4xl leading-none sm:text-5xl md:text-8xl">{product.name}</h1>
        <p className="mt-2 text-xs uppercase tracking-[0.22em] text-text-muted">Model Years: {product.years}</p>
        <div className="mt-4 flex items-center gap-4">
          <StatusBadge status={product.status} />
          <p className="text-3xl font-bold text-text-primary">{formatPkr(product.price)}</p>
        </div>
      </div>

      <form action="/checkout" className="space-y-7">
        <Input type="hidden" name="slug" value={product.slug} className="hidden" />

        <div>
          <Label className="technical-label mb-2 block text-[10px] text-text-muted">Background design</Label>
          <RadioGroup name="background" defaultValue={product.backgrounds[0]?.value} className="mt-3 flex flex-wrap gap-3">
            {product.backgrounds.map((background) => (
              <RadioGroupItem
                key={background.value}
                value={background.value}
                className="h-12 w-12 border border-border/40 p-0 data-checked:border-brand min-touch-target"
                style={{
                  backgroundColor: background.swatch,
                  backgroundImage: backgroundPatterns[background.value],
                }}
                title={background.label}
                aria-label={background.label}
              />
            ))}
          </RadioGroup>
        </div>

        <div>
          <Label className="technical-label mb-1 block text-[10px] text-text-muted" htmlFor="notes">
            Special Instructions
          </Label>
          <Textarea
            id="notes"
            name="notes"
            rows={4}
            placeholder="Add custom text or delivery notes..."
            className="mt-3 resize-none"
          />
        </div>

        <div className="space-y-3">
          {product.status === "unavailable" ? (
            <Button
              render={<TransitionLink href={`/contact?intent=notify&product=${product.slug}`} />}
              variant="muted"
              className="display-kicker w-full justify-center py-5 text-xl"
            >
              Notify Me
            </Button>
          ) : (
            <Button type="submit" variant="brand" className="display-kicker w-full py-6 text-2xl min-touch-target">
              {primaryCta} — {formatPkr(product.price)}
            </Button>
          )}

          {product.status === "preorder" ? (
            <p className="text-center text-[10px] uppercase tracking-[0.16em] text-text-accent">{preorderCopy}</p>
          ) : null}

          {product.status === "unavailable" ? (
            <p className="text-center text-[10px] uppercase tracking-[0.16em] text-text-muted">
              This model is currently unavailable. Use notify to capture interest.
            </p>
          ) : null}

          <Button render={<Link href={WHATSAPP_LINK} />} variant="outline" size="lg" className="display-kicker w-full text-lg">
            Ask a Question on WhatsApp
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 border-t border-border/20 pt-6 text-[10px] uppercase tracking-[0.12em] text-text-muted sm:grid-cols-3 sm:gap-3">
          <div className="flex items-start justify-center gap-2.5 text-balance min-inline-safe sm:items-center">
            <Package className="mt-0.5 shrink-0 sm:mt-0" size={14} strokeWidth={1.5} aria-hidden />
            <span>Nationwide Delivery</span>
          </div>
          <div className="flex items-start justify-center gap-2.5 text-balance min-inline-safe sm:items-center">
            <Clock3 className="mt-0.5 shrink-0 sm:mt-0" size={14} strokeWidth={1.5} aria-hidden />
            <span>7-10 Days</span>
          </div>
          <div className="flex items-start justify-center gap-2.5 text-balance min-inline-safe sm:items-center">
            <ShieldCheck className="mt-0.5 shrink-0 sm:mt-0" size={14} strokeWidth={1.5} aria-hidden />
            <span>Secure Payment</span>
          </div>
        </div>
      </form>
    </section>
  );
}
