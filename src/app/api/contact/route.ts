import { fail, ok } from "@/lib/http/api-envelope";
import { createContactSubmission } from "@/lib/db/services";
import { isNonEmpty } from "@/lib/utils";

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
};

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
