import { fail, ok } from "@/lib/api-envelope";
import { createContactSubmission } from "@/lib/services";

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
};

function isNonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as ContactPayload | null;

  if (!payload) {
    return fail("INVALID_JSON", "Request body must be valid JSON.", 400);
  }

  if (!isNonEmpty(payload.name) || !isNonEmpty(payload.email) || !isNonEmpty(payload.message)) {
    return fail("VALIDATION_ERROR", "name, email and message are required.", 422);
  }

  const submission = await createContactSubmission({
    name: payload.name,
    email: payload.email,
    message: payload.message,
  });

  return ok({ submission }, 201);
}
