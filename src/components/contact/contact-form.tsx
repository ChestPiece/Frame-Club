"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ContactFormProps = {
  intentIsNotify: boolean;
  productSlug?: string;
};

type FormState = {
  name: string;
  email: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  message: "",
};

function createFormSchema(intentIsNotify: boolean) {
  return z
    .object({
      name: z.string().trim(),
      email: z.string().trim().email("Enter a valid email."),
      message: z.string().trim(),
    })
    .superRefine((values, ctx) => {
      if (!intentIsNotify && values.name.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["name"],
          message: "Full name is required.",
        });
      }

      if (!intentIsNotify && values.message.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["message"],
          message: "Message is required.",
        });
      }
    });
}

export function ContactForm({ intentIsNotify, productSlug }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const schema = useMemo(() => createFormSchema(intentIsNotify), [intentIsNotify]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormState>({
    resolver: zodResolver(schema),
    defaultValues: initialState,
    mode: "onSubmit",
  });

  async function onSubmit(values: FormState) {
    setStatus("loading");
    setMessage("");

    try {
      const endpoint = intentIsNotify ? "/api/notify" : "/api/contact";
      const payload = intentIsNotify
        ? {
            email: values.email,
            productSlug: productSlug ?? "unknown-product",
          }
        : {
            name: values.name,
            email: values.email,
            message: values.message,
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const body = (await response.json().catch(() => null)) as
        | {
            success: false;
            error: {
              message: string;
            };
          }
        | null;

      if (!response.ok) {
        setStatus("error");
        setMessage(body?.error.message ?? "Request failed. Please try again.");
        return;
      }

      setStatus("success");
      setMessage(intentIsNotify ? "You will be notified when this model is available." : "Message received. We will contact you soon.");
      reset(initialState);
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <form className="space-y-6 sm:space-y-7" onSubmit={handleSubmit(onSubmit)}>
      {!intentIsNotify ? (
        <div className="space-y-2">
          <label htmlFor="contact-name" className="technical-label block text-[10px] text-text-muted">
            Full Name
          </label>
          <Input
            id="contact-name"
            placeholder="Enter your full name"
            className="min-touch-target w-full border-border/70 bg-bg-surface text-text-primary placeholder:text-text-muted/75 tracking-[0.04em] transition-colors duration-200 focus-visible:border-brand/80 focus-visible:ring-2 focus-visible:ring-brand/30"
            {...register("name")}
          />
          {errors.name ? <p className="mt-2 text-xs text-error">{errors.name.message}</p> : null}
        </div>
      ) : null}

      <div className="space-y-2">
        <label htmlFor="contact-email" className="technical-label block text-[10px] text-text-muted">
          Email
        </label>
        <Input
          id="contact-email"
          placeholder="name@email.com"
          type="email"
          className="min-touch-target w-full border-border/70 bg-bg-surface text-text-primary placeholder:text-text-muted/75 tracking-[0.04em] transition-colors duration-200 focus-visible:border-brand/80 focus-visible:ring-2 focus-visible:ring-brand/30"
          {...register("email")}
        />
        {errors.email ? <p className="mt-2 text-xs text-error">{errors.email.message}</p> : null}
      </div>

      {!intentIsNotify ? (
        <div className="space-y-2">
          <label htmlFor="contact-message" className="technical-label block text-[10px] text-text-muted">
            Message
          </label>
          <Textarea
            id="contact-message"
            placeholder="Tell us what you need"
            rows={5}
            className="w-full border-border/70 bg-bg-surface text-text-primary placeholder:text-text-muted/75 tracking-[0.04em] transition-colors duration-200 focus-visible:border-brand/80 focus-visible:ring-2 focus-visible:ring-brand/30"
            {...register("message")}
          />
          {errors.message ? <p className="mt-2 text-xs text-error">{errors.message.message}</p> : null}
        </div>
      ) : null}

      <Button
        type="submit"
        disabled={isSubmitting || status === "loading"}
        variant="brand"
        className="display-kicker min-touch-target w-full py-4 text-sm sm:text-base"
      >
        {status === "loading" ? "Submitting" : intentIsNotify ? "Notify Me" : "Send Message"}
      </Button>

      {status === "success" ? (
        <p role="status" aria-live="polite" className="text-sm text-success">
          {message}
        </p>
      ) : null}
      {status === "error" ? (
        <p role="alert" className="text-sm text-error">
          {message}
        </p>
      ) : null}
    </form>
  );
}
