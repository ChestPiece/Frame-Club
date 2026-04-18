import { fail, ok } from "@/lib/http/api-envelope";
import { getConfiguredAdminEmail, isUserAdmin } from "@/lib/auth/admin";
import { getOrderById } from "@/lib/db/services";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return fail("UNAUTHORIZED", "Authentication required.", 401);
  }

  if (!getConfiguredAdminEmail()) {
    return fail("ADMIN_NOT_CONFIGURED", "Admin email is not configured.", 503);
  }

  if (!isUserAdmin(user.email)) {
    return fail("FORBIDDEN", "Admin access required.", 403);
  }

  const { id } = await context.params;
  const order = await getOrderById(id);

  if (!order) {
    return fail("ORDER_NOT_FOUND", "No order found for this id.", 404);
  }

  return ok({ order });
}
