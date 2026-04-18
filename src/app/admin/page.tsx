import { Edit2, Activity } from "lucide-react";

export const dynamic = "force-dynamic";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAdminStats, listOrders } from "@/lib/db/services";
import { getProducts as listProductsForAdmin } from "@/lib/shop/data";
import { ProductStatusToggle } from "@/components/admin/product-status-toggle";
import { AdminErrorFallback } from "@/components/admin/admin-error-fallback";
import { AdminStatsRow } from "@/components/admin/admin-stats-row";
import { LiveOrderPipeline } from "@/components/admin/live-order-pipeline";

export default async function AdminDashboardPage() {
  let stats: Awaited<ReturnType<typeof getAdminStats>>;
  let orders: Awaited<ReturnType<typeof listOrders>>;
  let products: Awaited<ReturnType<typeof listProductsForAdmin>>;

  try {
    [stats, orders, products] = await Promise.all([
      getAdminStats(),
      listOrders(),
      listProductsForAdmin(),
    ]);
    orders = orders.slice(0, 5);
    products = products.slice(0, 4);
  } catch {
    return <AdminErrorFallback message="Failed to load dashboard data." />;
  }

  const pipelinePct =
    stats.totalOrders > 0
      ? Math.min(100, Math.round((stats.inProduction / stats.totalOrders) * 100))
      : 0;

  return (
    <div className="space-y-10">
      <AdminStatsRow stats={stats} pipelinePct={pipelinePct} />

      <LiveOrderPipeline orders={orders} />

      <section className="grid gap-8 lg:grid-cols-3">
        <article className="border border-border bg-bg-surface lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border bg-bg-deep px-6 py-4">
            <h2 className="technical-label text-xs text-text-primary">Inventory Management</h2>
            <Button
              type="button"
              disabled
              variant="ghost"
              size="sm"
              className="technical-label border-transparent px-0 text-[10px] text-text-accent hover:bg-transparent"
            >
              + Add Frame
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Car Model</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="text-[11px] font-semibold">{product.name}</TableCell>
                  <TableCell className="text-[11px] text-text-muted">
                    <ProductStatusToggle productId={product.id} status={product.status} />
                  </TableCell>
                  <TableCell className="text-[11px] text-text-muted">--</TableCell>
                  <TableCell className="text-[11px] text-text-muted">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-text-muted hover:text-text-primary"
                      aria-label="Edit product"
                    >
                      <Edit2 className="h-4 w-4" strokeWidth={1.5} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </article>

        <article className="border border-brand-mid bg-brand p-8">
          <Activity className="mb-4 h-6 w-6 text-text-accent" strokeWidth={1.5} />
          <h3 className="technical-label text-xl leading-tight text-text-primary italic">
            Precision
            <br />
            Engineered
            <br />
            Metrics
          </h3>
          <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-text-accent">
            Every frame is made to order. Status updates flow from this dashboard.
          </p>
        </article>
      </section>
    </div>
  );
}
