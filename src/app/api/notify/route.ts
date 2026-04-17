import { fail, ok } from "@/lib/http/api-envelope";
import { createNotifySubscription } from "@/lib/db/services";
import { isNonEmpty } from "@/lib/utils";

type NotifyPayload = {
  email?: string;
  productSlug?: string;
};

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as NotifyPayload | null;

  if (!payload) {
    return fail("INVALID_JSON", "Request body must be valid JSON.", 400);
  }

  if (!isNonEmpty(payload.email) || !isNonEmpty(payload.productSlug)) {
    return fail("VALIDATION_ERROR", "email and productSlug are required.", 422);
  }

  const subscription = await createNotifySubscription({
    email: payload.email,
    productSlug: payload.productSlug,
  });

  return ok({ subscription }, 201);
}
