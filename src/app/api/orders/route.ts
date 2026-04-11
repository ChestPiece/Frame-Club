import { fail, ok } from "@/lib/api-envelope";
import { createOrder } from "@/lib/mock-services";

type OrderPayload = {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  customerCity?: string;
  productSlug?: string;
  background?: string;
  notes?: string;
};

function isNonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as OrderPayload | null;

  if (!payload) {
    return fail("INVALID_JSON", "Request body must be valid JSON.", 400);
  }

  if (
    !isNonEmpty(payload.customerName) ||
    !isNonEmpty(payload.customerEmail) ||
    !isNonEmpty(payload.customerPhone) ||
    !isNonEmpty(payload.customerAddress) ||
    !isNonEmpty(payload.customerCity) ||
    !isNonEmpty(payload.productSlug) ||
    !isNonEmpty(payload.background)
  ) {
    return fail("VALIDATION_ERROR", "Missing required order fields.", 422);
  }

  const result = createOrder({
    customerName: payload.customerName,
    customerEmail: payload.customerEmail,
    customerPhone: payload.customerPhone,
    customerAddress: payload.customerAddress,
    customerCity: payload.customerCity,
    productSlug: payload.productSlug,
    background: payload.background,
    notes: payload.notes ?? "",
  });

  if ("error" in result && result.error) {
    return fail(result.error, "The selected product could not be found.", 404);
  }

  return ok(
    {
      order: result.data,
    },
    201
  );
}
