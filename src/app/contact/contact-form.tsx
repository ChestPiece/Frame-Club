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
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      {!intentIsNotify ? (
        <div>
          <Input placeholder="FULL NAME" {...register("name")} />
          {errors.name ? <p className="mt-2 text-xs text-[#f1a39d]">{errors.name.message}</p> : null}
        </div>
      ) : null}

      <div>
        <Input placeholder="EMAIL" type="email" {...register("email")} />
        {errors.email ? <p className="mt-2 text-xs text-[#f1a39d]">{errors.email.message}</p> : null}
      </div>

      {!intentIsNotify ? (
        <div>
          <Textarea placeholder="MESSAGE" rows={4} {...register("message")} />
          {errors.message ? <p className="mt-2 text-xs text-[#f1a39d]">{errors.message.message}</p> : null}
        </div>
      ) : null}

      <Button
        type="submit"
        disabled={isSubmitting || status === "loading"}
        variant="brand"
        className="display-kicker w-full"
      >
        {status === "loading" ? "Submitting" : intentIsNotify ? "Notify Me" : "Send Message"}
      </Button>

      {status === "success" ? <p className="text-sm text-[#9bf0ba]">{message}</p> : null}
      {status === "error" ? <p className="text-sm text-[#f1a39d]">{message}</p> : null}
    </form>
  );
}
