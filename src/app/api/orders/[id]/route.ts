import { fail, ok } from "@/lib/api-envelope";
import { getOrderById } from "@/lib/mock-services";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const order = getOrderById(id);

  if (!order) {
    return fail("ORDER_NOT_FOUND", "No order found for this id.", 404);
  }

  return ok({ order });
}
