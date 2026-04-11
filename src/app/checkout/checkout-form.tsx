"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Product } from "@/lib/types";

const checkoutSchema = z.object({
  customerName: z.string().trim().min(1, "Full name is required."),
  customerEmail: z.string().trim().email("Enter a valid email."),
  customerPhone: z.string().trim().min(1, "Phone number is required."),
  customerAddress: z.string().trim().min(1, "Delivery address is required."),
  customerCity: z.string().trim().min(1, "City is required."),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

type CheckoutFormProps = {
  product: Product | undefined;
  slug: string;
  background: string;
  notes: string;
};

const defaultState: CheckoutFormValues = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  customerAddress: "",
  customerCity: "",
};

export function CheckoutForm({ product, slug, background, notes }: CheckoutFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [payfastData, setPayfastData] = useState<{ url: string; data: Record<string, string> } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: defaultState,
    mode: "onSubmit",
  });

  async function onSubmit(values: CheckoutFormValues) {
    setSubmitError(null);

    if (!product) {
      setSubmitError("Select a frame from the collection first.");
      return;
    }

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: values.customerName,
          customerEmail: values.customerEmail,
          customerPhone: values.customerPhone,
          customerAddress: values.customerAddress,
          customerCity: values.customerCity,
          productSlug: slug || product.slug,
          background,
          notes,
        }),
      });

      const payload = (await response.json().catch(() => null)) as any;

      if (!response.ok || !payload || !payload.success) {
        const message =
          payload && !payload.success
            ? payload.error?.message
            : "Unable to create order at the moment.";
        setSubmitError(message || "Error processing order.");
        return;
      }

      const { payfastUrl, payfastData } = payload.data;
      
      if (!payfastUrl || !payfastData) {
        // If PayFast config is missing on backend, fall back to mock
        router.push(`/order/${payload.data.order.id}`);
        return;
      }

      // Auto-submit PayFast form
      setPayfastData({ url: payfastUrl, data: payfastData });
      
      // We need a slight delay to allow React to render the hidden form before submitting it
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.submit();
        }
      }, 100);

    } catch {
      setSubmitError("Network error while creating order.");
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 border border-border-dark bg-bg-surface p-8 md:p-10"
      >
        {submitError ? <p className="text-sm text-[#f1a39d]">{submitError}</p> : null}

        <div>
          <Label htmlFor="customerName">Full Name</Label>
          <Input id="customerName" {...register("customerName")} className="mt-2" />
          {errors.customerName ? (
            <p className="mt-2 text-xs text-[#f1a39d]">{errors.customerName.message}</p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="customerEmail">Email</Label>
          <Input id="customerEmail" type="email" {...register("customerEmail")} className="mt-2" />
          {errors.customerEmail ? (
            <p className="mt-2 text-xs text-[#f1a39d]">{errors.customerEmail.message}</p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="customerPhone">Phone Number</Label>
          <Input id="customerPhone" {...register("customerPhone")} className="mt-2" />
          {errors.customerPhone ? (
            <p className="mt-2 text-xs text-[#f1a39d]">{errors.customerPhone.message}</p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="customerAddress">Delivery Address</Label>
          <Input id="customerAddress" {...register("customerAddress")} className="mt-2" />
          {errors.customerAddress ? (
            <p className="mt-2 text-xs text-[#f1a39d]">{errors.customerAddress.message}</p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="customerCity">City</Label>
          <Input id="customerCity" {...register("customerCity")} className="mt-2" />
          {errors.customerCity ? (
            <p className="mt-2 text-xs text-[#f1a39d]">{errors.customerCity.message}</p>
          ) : null}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !!payfastData}
          variant="brand"
          size="lg"
          className="display-kicker w-full"
        >
          {isSubmitting || payfastData ? "Processing Payment..." : "Proceed to Payment"}
        </Button>
      </form>
      
      {/* Hidden PayFast Form */}
      {payfastData && (
        <form ref={formRef} action={payfastData.url} method="POST" className="hidden">
          {Object.entries(payfastData.data).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
        </form>
      )}

      <aside className="space-y-4 border border-border-dark bg-bg-recessed p-8">
        <p className="technical-label text-[10px] text-text-muted">Order Summary</p>
        <p className="display-kicker text-5xl leading-none">{product?.name ?? "No frame selected"}</p>

        <div className="space-y-2 border border-border-dark/50 bg-bg-surface p-5 text-sm text-text-muted">
          <p>Background: {background}</p>
          <p>Notes: {notes || "None"}</p>
        </div>

        <div className="border-t border-border-dark/70 pt-4">
          <p className="technical-label text-[10px] text-text-muted">Total</p>
          <p className="mt-2 text-2xl text-text-primary">Rs. {product ? product.price.toLocaleString("en-PK") : "0"}</p>
        </div>

        <p className="text-[10px] uppercase tracking-[0.16em] text-text-muted">
          Nationwide delivery Pakistan | Secure payment | Handcrafted to order
        </p>
      </aside>
    </div>
  );
}