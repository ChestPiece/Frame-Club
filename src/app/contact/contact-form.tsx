"use client";

import { FormEvent, useState } from "react";

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

export function ContactForm({ intentIsNotify, productSlug }: ContactFormProps) {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  function updateField(field: keyof FormState, value: string) {
    setFormState((previous) => ({ ...previous, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const endpoint = intentIsNotify ? "/api/notify" : "/api/contact";
      const payload = intentIsNotify
        ? {
            email: formState.email,
            productSlug: productSlug ?? "unknown-product",
          }
        : {
            name: formState.name,
            email: formState.email,
            message: formState.message,
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
      setFormState(initialState);
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      {!intentIsNotify ? (
        <input
          required
          value={formState.name}
          onChange={(event) => updateField("name", event.target.value)}
          placeholder="FULL NAME"
          className="machined-field"
        />
      ) : null}

      <input
        required
        value={formState.email}
        onChange={(event) => updateField("email", event.target.value)}
        placeholder="EMAIL"
        type="email"
        className="machined-field"
      />

      {!intentIsNotify ? (
        <textarea
          required
          value={formState.message}
          onChange={(event) => updateField("message", event.target.value)}
          placeholder="MESSAGE"
          rows={4}
          className="machined-field resize-none"
        />
      ) : null}

      <button
        type="submit"
        disabled={status === "loading"}
        className="display-kicker w-full border border-brand bg-brand px-4 py-3 text-xs text-text-primary transition-colors hover:bg-brand-mid disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "loading" ? "Submitting" : intentIsNotify ? "Notify Me" : "Send Message"}
      </button>

      {status === "success" ? <p className="text-sm text-[#9bf0ba]">{message}</p> : null}
      {status === "error" ? <p className="text-sm text-[#f1a39d]">{message}</p> : null}
    </form>
  );
}
