"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
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
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (shouldSubmit && formRef.current) {
      formRef.current.submit();
    }
  }, [shouldSubmit]);

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

      type OrderPayload = { success: boolean; data?: { payfastUrl?: string; payfastData?: Record<string, string>; order?: { id: string } }; error?: { message: string } };
      const payload = (await response.json().catch(() => null)) as OrderPayload | null;

      if (!response.ok || !payload || !payload.success) {
        const message =
          payload && !payload.success
            ? payload.error?.message
            : "Unable to create order at the moment.";
        setSubmitError(message || "Error processing order.");
        return;
      }

      const orderData = payload.data;
      if (!orderData) {
        setSubmitError("Order data is missing from the server response.");
        return;
      }

      const { payfastUrl, payfastData, order } = orderData;

      if (!payfastUrl || !payfastData) {
        // If PayFast config is missing on backend, fall back to mock
        if (!order?.id) {
          setSubmitError("Order was created but confirmation details are missing.");
          return;
        }

        router.push(`/order/${order.id}`);
        return;
      }

      // Auto-submit PayFast form — useEffect watches shouldSubmit and submits once formRef is ready
      setPayfastData({ url: payfastUrl, data: payfastData });
      setShouldSubmit(true);

    } catch {
      setSubmitError("Network error while creating order.");
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 border border-border-dark bg-bg-surface p-4 md:p-8 lg:p-10"
      >
        <div className="border-b border-border-dark pb-5">
          <p className="technical-label text-[10px] text-text-muted">Customer Details</p>
          <p className="mt-2 text-sm text-text-muted">
            Complete your details to continue to secure PayFast checkout.
          </p>
        </div>

        {submitError ? <p className="text-sm text-[#f1a39d]">{submitError}</p> : null}

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Label htmlFor="customerName">Full Name</Label>
            <Input id="customerName" {...register("customerName")} className="mt-2" />
            {errors.customerName ? (
              <p className="mt-2 text-xs text-[#f1a39d]">{errors.customerName.message}</p>
            ) : null}
          </div>

          <div>
            <Label htmlFor="customerPhone">Phone Number</Label>
            <Input id="customerPhone" {...register("customerPhone")} className="mt-2" />
            {errors.customerPhone ? (
              <p className="mt-2 text-xs text-[#f1a39d]">{errors.customerPhone.message}</p>
            ) : null}
          </div>
        </div>

        <div>
          <Label htmlFor="customerEmail">Email</Label>
          <Input id="customerEmail" type="email" {...register("customerEmail")} className="mt-2" />
          {errors.customerEmail ? (
            <p className="mt-2 text-xs text-[#f1a39d]">{errors.customerEmail.message}</p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="customerAddress">Delivery Address</Label>
          <Input id="customerAddress" {...register("customerAddress")} className="mt-2" />
          {errors.customerAddress ? (
            <p className="mt-2 text-xs text-[#f1a39d]">{errors.customerAddress.message}</p>
          ) : null}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Label htmlFor="customerCity">City</Label>
            <Input id="customerCity" {...register("customerCity")} className="mt-2" />
            {errors.customerCity ? (
              <p className="mt-2 text-xs text-[#f1a39d]">{errors.customerCity.message}</p>
            ) : null}
          </div>

          <div className="rounded-none border border-border-dark bg-bg-recessed p-4">
            <p className="technical-label text-[10px] text-text-muted">Delivery Window</p>
            <p className="mt-2 text-sm text-text-primary">
              {product ? `${product.deliveryDays}-${product.deliveryDays + 3} working days` : "--"}
            </p>
          </div>
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

      <aside className="space-y-6 border border-border-dark bg-bg-recessed p-4 md:p-8">
        <div className="border-b border-border-dark pb-5">
          <p className="technical-label text-[10px] text-text-muted">Cart Summary</p>
          <p className="mt-2 display-kicker text-2xl leading-none sm:text-4xl">
            {product?.name ?? "No frame selected"}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-text-muted">
            {product?.brand ?? "Select from collection"}
          </p>
        </div>

        <div className="space-y-3 border border-border-dark/60 bg-bg-surface p-5 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-text-muted">Product</span>
            <span className="text-text-primary">
              Rs. {product ? product.price.toLocaleString("en-PK") : "0"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-muted">Shipping</span>
            <span className="text-text-primary">Included</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-muted">Background</span>
            <span className="text-text-primary">{background}</span>
          </div>
        </div>

        <div className="space-y-3 border border-border-dark/50 bg-bg-surface p-5 text-sm text-text-muted">
          <p className="technical-label text-[10px]">Order Notes</p>
          <p>{notes || "No notes provided."}</p>
        </div>

        <div className="border-t border-border-dark/70 pt-4">
          <p className="technical-label text-[10px] text-text-muted">Total</p>
          <p className="mt-2 text-3xl text-text-primary">
            Rs. {product ? product.price.toLocaleString("en-PK") : "0"}
          </p>
        </div>

        <div className="border border-border-dark/60 bg-bg-surface p-4">
          <p className="technical-label text-[10px] text-text-muted">Payment Method</p>
          <p className="mt-2 text-sm text-text-primary">PayFast (secure checkout)</p>
        </div>

        <p className="text-[10px] uppercase tracking-[0.16em] text-text-muted">
          Nationwide delivery Pakistan | Secure payment | Handcrafted to order
        </p>
      </aside>
    </div>
  );
}