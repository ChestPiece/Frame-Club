import { fail, ok } from "@/lib/api-envelope";
import { getOrderById } from "@/lib/services";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const order = await getOrderById(id);

  if (!order) {
    return fail("ORDER_NOT_FOUND", "No order found for this id.", 404);
  }

  return ok({ order });
}
