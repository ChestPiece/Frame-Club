"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CheckoutSummary } from "@/components/checkout/checkout-summary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Product } from "@/lib/db/types";

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
  initialValues?: Partial<CheckoutFormValues>;
};

const defaultState: CheckoutFormValues = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  customerAddress: "",
  customerCity: "",
};

export function CheckoutForm({ product, slug, background, notes, initialValues }: CheckoutFormProps) {
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
    defaultValues: { ...defaultState, ...initialValues },
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

      type OrderPayload = {
        success: boolean;
        data?: {
          payfastUrl?: string;
          payfastData?: Record<string, string>;
          order?: { id: string };
          orderAccessToken?: string;
        };
        error?: { message: string };
      };
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

      const { payfastUrl, payfastData, order, orderAccessToken } = orderData;

      if (!payfastUrl || !payfastData) {
        // If PayFast config is missing on backend, fall back to mock
        if (!order?.id) {
          setSubmitError("Order was created but confirmation details are missing.");
          return;
        }

        const orderUrl = orderAccessToken
          ? `/order/${order.id}?token=${encodeURIComponent(orderAccessToken)}`
          : `/order/${order.id}`;
        router.push(orderUrl);
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
    <div className="grid min-w-0 gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-12 xl:gap-16">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="min-w-0 space-y-9 border border-border bg-bg-surface p-6 sm:p-8 md:p-10 lg:p-12"
      >
        <div className="border-b border-border pb-6">
          <p className="technical-label text-[10px] text-text-muted">Customer Details</p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-muted">
            Complete your details to continue to secure PayFast checkout.
          </p>
        </div>

        {submitError ? <p className="text-sm text-error">{submitError}</p> : null}

        <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
          <div className="min-w-0">
            <Label htmlFor="customerName" className="mb-2.5">
              Full Name
            </Label>
            <Input id="customerName" {...register("customerName")} className="w-full" />
            {errors.customerName ? (
              <p className="mt-2 text-xs text-error">{errors.customerName.message}</p>
            ) : null}
          </div>

          <div className="min-w-0">
            <Label htmlFor="customerPhone" className="mb-2.5">
              Phone Number
            </Label>
            <Input id="customerPhone" {...register("customerPhone")} className="w-full" />
            {errors.customerPhone ? (
              <p className="mt-2 text-xs text-error">{errors.customerPhone.message}</p>
            ) : null}
          </div>

          <div className="min-w-0 md:col-span-2">
            <Label htmlFor="customerEmail" className="mb-2.5">
              Email
            </Label>
            <Input id="customerEmail" type="email" {...register("customerEmail")} className="w-full" />
            {errors.customerEmail ? (
              <p className="mt-2 text-xs text-error">{errors.customerEmail.message}</p>
            ) : null}
          </div>

          <div className="min-w-0 md:col-span-2">
            <Label htmlFor="customerAddress" className="mb-2.5">
              Delivery Address
            </Label>
            <Input id="customerAddress" {...register("customerAddress")} className="w-full" />
            {errors.customerAddress ? (
              <p className="mt-2 text-xs text-error">{errors.customerAddress.message}</p>
            ) : null}
          </div>

          <div className="min-w-0 md:col-span-2">
            <Label htmlFor="customerCity" className="mb-2.5">
              City
            </Label>
            <Input id="customerCity" {...register("customerCity")} className="w-full" />
            {errors.customerCity ? (
              <p className="mt-2 min-h-5 text-xs text-error">{errors.customerCity.message}</p>
            ) : (
              <p className="mt-2 min-h-5" aria-hidden />
            )}
          </div>
        </div>

        <div className="bg-bg-elevated px-5 py-6 sm:px-6 sm:py-7">
          <p className="technical-label text-[10px] text-text-muted">Delivery window</p>
          <p className="mt-3 text-sm leading-relaxed text-text-primary">
            {product
              ? `Estimated ${product.deliveryDays}–${product.deliveryDays + 3} working days after payment.`
              : "—"}
          </p>
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

      <CheckoutSummary product={product} background={background} notes={notes} />
    </div>
  );
}