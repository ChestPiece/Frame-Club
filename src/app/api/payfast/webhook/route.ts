import { fail, ok } from "@/lib/api-envelope";
import { applyWebhook } from "@/lib/mock-services";
import type { PaymentStatus } from "@/lib/types";

type WebhookPayload = {
  orderId?: string;
  paymentStatus?: PaymentStatus;
};

function isPaymentStatus(value: unknown): value is PaymentStatus {
  return value === "pending" || value === "paid" || value === "failed";
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as WebhookPayload | null;

  if (!payload) {
    return fail("INVALID_JSON", "Request body must be valid JSON.", 400);
  }

  if (typeof payload.orderId !== "string" || payload.orderId.trim().length === 0) {
    return fail("VALIDATION_ERROR", "orderId is required.", 422);
  }

  const paymentStatus: PaymentStatus = isPaymentStatus(payload.paymentStatus)
    ? payload.paymentStatus
    : "paid";

  const result = applyWebhook({
    orderId: payload.orderId,
    paymentStatus,
  });

  if ("error" in result) {
    return fail("ORDER_NOT_FOUND", "Could not match order for webhook update.", 404);
  }

  return ok({ order: result.data });
}
