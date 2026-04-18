import { fail, ok } from "@/lib/http/api-envelope";
import { assertAdminSession } from "@/lib/auth/assert-admin-session";
import { getOrderById } from "@/lib/db/services";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const auth = await assertAdminSession();
  if (!auth.ok) {
    if (auth.error === "UNAUTHORIZED") {
      return fail("UNAUTHORIZED", "Authentication required.", 401);
    }
    if (auth.error === "ADMIN_NOT_CONFIGURED") {
      return fail("ADMIN_NOT_CONFIGURED", "Admin email is not configured.", 503);
    }
    return fail("FORBIDDEN", "Admin access required.", 403);
  }

  const { id } = await context.params;
  const order = await getOrderById(id);

  if (!order) {
    return fail("ORDER_NOT_FOUND", "No order found for this id.", 404);
  }

  return ok({ order });
}
