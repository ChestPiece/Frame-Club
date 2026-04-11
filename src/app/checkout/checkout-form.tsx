"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";

type CheckoutFormState = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
};

type CheckoutFormProps = {
  product: Product | undefined;
  slug: string;
  background: string;
  notes: string;
};

const defaultState: CheckoutFormState = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  customerAddress: "",
  customerCity: "",
};

export function CheckoutForm({ product, slug, background, notes }: CheckoutFormProps) {
  const router = useRouter();
  const [formState, setFormState] = useState<CheckoutFormState>(defaultState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField(field: keyof CheckoutFormState, value: string) {
    setFormState((previous) => ({ ...previous, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!product) {
      setError("Select a frame from the collection first.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: formState.customerName,
          customerEmail: formState.customerEmail,
          customerPhone: formState.customerPhone,
          customerAddress: formState.customerAddress,
          customerCity: formState.customerCity,
          productSlug: slug || product.slug,
          background,
          notes,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | {
            success: true;
            data: {
              order: {
                id: string;
              };
            };
          }
        | {
            success: false;
            error: {
              message: string;
            };
          }
        | null;

      if (!response.ok || !payload || !payload.success) {
        const message =
          payload && !payload.success
            ? payload.error.message
            : "Unable to create order at the moment.";
        setError(message);
        setIsSubmitting(false);
        return;
      }

      router.push(`/order/${payload.data.order.id}`);
    } catch {
      setError("Network error while creating order.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr]">
      <form onSubmit={handleSubmit} className="space-y-6 border border-border-dark bg-bg-surface p-8 md:p-10">
        {error ? <p className="text-sm text-[#f1a39d]">{error}</p> : null}

        <label className="technical-label block text-[10px] text-text-muted">
          Full Name
          <input
            required
            value={formState.customerName}
            onChange={(event) => updateField("customerName", event.target.value)}
            className="machined-field mt-2"
          />
        </label>

        <label className="technical-label block text-[10px] text-text-muted">
          Email
          <input
            required
            type="email"
            value={formState.customerEmail}
            onChange={(event) => updateField("customerEmail", event.target.value)}
            className="machined-field mt-2"
          />
        </label>

        <label className="technical-label block text-[10px] text-text-muted">
          Phone Number
          <input
            required
            value={formState.customerPhone}
            onChange={(event) => updateField("customerPhone", event.target.value)}
            className="machined-field mt-2"
          />
        </label>

        <label className="technical-label block text-[10px] text-text-muted">
          Delivery Address
          <input
            required
            value={formState.customerAddress}
            onChange={(event) => updateField("customerAddress", event.target.value)}
            className="machined-field mt-2"
          />
        </label>

        <label className="technical-label block text-[10px] text-text-muted">
          City
          <input
            required
            value={formState.customerCity}
            onChange={(event) => updateField("customerCity", event.target.value)}
            className="machined-field mt-2"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="display-kicker w-full border border-brand bg-brand px-5 py-4 text-sm text-text-primary transition-colors hover:bg-brand-mid disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Processing" : "Proceed to Payment"}
        </button>

        <p className="text-xs text-text-muted">
          This is a frontend-only mock flow. Real PayFast and order API integration comes next.
        </p>
      </form>

      <aside className="space-y-4 border border-border-dark bg-bg-recessed p-8">
        <p className="technical-label text-[10px] text-text-muted">Order Summary</p>
        <p className="display-kicker text-5xl leading-none">{product?.name ?? "No frame selected"}</p>

        <div className="space-y-2 border border-border-dark/50 bg-bg-surface p-5 text-sm text-text-muted">
          <p>Background: {background}</p>
          <p>Notes: {notes || "None"}</p>
        </div>

        <div className="border-t border-border-dark/70 pt-4">
          <p className="technical-label text-[10px] text-text-muted">Total</p>
          <p className="mt-2 text-2xl text-text-primary">Rs. {product?.price.toLocaleString("en-PK") ?? "0"}</p>
        </div>

        <p className="text-[10px] uppercase tracking-[0.16em] text-text-muted">
          Nationwide delivery Pakistan | Secure payment | Handcrafted to order
        </p>
      </aside>
    </div>
  );
}
