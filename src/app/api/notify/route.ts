import { fail, ok } from "@/lib/api-envelope";
import { createNotifySubscription } from "@/lib/mock-services";

type NotifyPayload = {
  email?: string;
  productSlug?: string;
};

function isNonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as NotifyPayload | null;

  if (!payload) {
    return fail("INVALID_JSON", "Request body must be valid JSON.", 400);
  }

  if (!isNonEmpty(payload.email) || !isNonEmpty(payload.productSlug)) {
    return fail("VALIDATION_ERROR", "email and productSlug are required.", 422);
  }

  const subscription = createNotifySubscription({
    email: payload.email,
    productSlug: payload.productSlug,
  });

  return ok({ subscription }, 201);
}
