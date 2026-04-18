import { fail, ok, parseJsonBody } from "@/lib/http/api-envelope";
import { createContactSubmission } from "@/lib/db/services";
import { isNonEmpty } from "@/lib/utils";

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
};

export async function POST(request: Request) {
  const payload = await parseJsonBody<ContactPayload>(request);

  if (!payload) {
    return fail("INVALID_JSON", "Request body must be valid JSON.", 400);
  }

  if (!isNonEmpty(payload.name) || !isNonEmpty(payload.email) || !isNonEmpty(payload.message)) {
    return fail("VALIDATION_ERROR", "name, email and message are required.", 422);
  }

  try {
    const submission = await createContactSubmission({
      name: payload.name,
      email: payload.email,
      message: payload.message,
    });

    return ok({ submission }, 201);
  } catch {
    return fail("INTERNAL_ERROR", "Could not save contact submission.", 500);
  }
}
