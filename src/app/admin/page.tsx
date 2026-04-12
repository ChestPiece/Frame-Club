import { Edit2, Eye, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAdminStats, listOrders } from "@/lib/services";
import { getProducts as listProductsForAdmin } from "@/lib/data";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { ProductStatusToggle } from "@/components/admin/product-status-toggle";
import { ExportCsvButton } from "@/components/admin/export-csv-button";

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
    return (
      <div className="flex items-center justify-center py-32">
        <div className="border border-border-dark bg-bg-surface p-10 text-center">
          <p className="display-kicker text-2xl text-text-primary">Failed to load dashboard data.</p>
          <p className="mt-3 text-sm text-text-muted">Check your Supabase connection and refresh the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section className="grid gap-0 md:grid-cols-2 lg:grid-cols-4">
        <article className="border border-border-dark bg-bg-surface p-8">
          <div className="flex items-start justify-between">
            <p className="technical-label text-[10px] text-text-muted">Total Orders</p>
            <span className="text-[10px] text-green-500">+12%</span>
          </div>
          <p className="mt-4 text-4xl font-bold">{stats.totalOrders}</p>
        </article>

        <article className="border border-border-dark border-l-0 bg-bg-surface p-8">
          <div className="flex items-start justify-between">
            <p className="technical-label text-[10px] text-text-muted">Pending Orders</p>
            <span className="text-[10px] text-brand-mid">-3%</span>
          </div>
          <p className="mt-4 text-4xl font-bold">{stats.pendingOrders}</p>
        </article>

        <article className="border border-border-dark border-l-0 bg-bg-surface p-8">
          <div className="flex items-start justify-between">
            <p className="technical-label text-[10px] text-text-muted">Revenue This Month</p>
            <span className="text-[10px] text-green-500">+8%</span>
          </div>
          <p className="mt-4 text-3xl font-bold">Rs. {stats.revenue.toLocaleString("en-PK")}</p>
        </article>

        <article className="border border-border-dark border-l-0 bg-bg-surface p-8">
          <div className="flex items-start justify-between">
            <p className="technical-label text-[10px] text-text-muted">Frames In Production</p>
          </div>
          <p className="mt-4 text-4xl font-bold">{stats.inProduction}</p>
          <div className="mt-3 h-1 w-full bg-bg-recessed">
            <div className="h-full bg-[#ffb3af]" style={{ width: "45%" }} />
          </div>
        </article>
      </section>

      <section className="border border-border-dark bg-bg-surface">
        <div className="flex items-center justify-between border-b border-border-dark bg-bg-recessed px-6 py-4">
          <h2 className="technical-label text-xs text-text-primary">Live Order Pipeline</h2>
          <ExportCsvButton orders={orders} />
        </div>

        <Table className="min-w-245">
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Car Model</TableHead>
              <TableHead>Customization</TableHead>
              <TableHead className="text-center">Payment</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.map((order, index) => (
              <TableRow key={order.id} className={`text-[11px] ${index % 2 === 0 ? "bg-bg-surface" : "bg-bg-base"}`}>
                <TableCell className="font-semibold text-text-primary">{order.orderNumber}</TableCell>
                <TableCell className="text-text-muted">{order.customerName}</TableCell>
                <TableCell className="text-text-muted">{order.productSlug}</TableCell>
                <TableCell className="text-text-muted">{order.customization.background}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={order.paymentStatus === "paid" ? "paid" : "pending"}
                    className="px-2 py-1 text-[9px] tracking-widest"
                  >
                    {order.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-text-muted">
                  <OrderStatusSelect
                    orderId={order.id}
                    currentStatus={order.orderStatus}
                    customerEmail={order.customerEmail}
                    orderNumber={order.orderNumber}
                    productSlug={order.productSlug}
                  />
                </TableCell>
                <TableCell className="text-text-muted">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-text-muted hover:text-text-primary"
                    aria-label="View order"
                  >
                    <Eye className="h-4 w-4" strokeWidth={1.5} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section className="grid gap-8 lg:grid-cols-3">
        <article className="border border-border-dark bg-bg-surface lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border-dark bg-bg-recessed px-6 py-4">
            <h2 className="technical-label text-xs text-text-primary">Inventory Management</h2>
            <Button
              type="button"
              disabled
              variant="ghost"
              size="sm"
              className="technical-label border-transparent px-0 text-[10px] text-[#ffb3af] hover:bg-transparent"
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
          <Activity className="mb-4 h-6 w-6 text-[#ffb3af]" strokeWidth={1.5} />
          <h3 className="technical-label text-xl leading-tight text-text-primary italic">
            Precision
            <br />
            Engineered
            <br />
            Metrics
          </h3>
          <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-[#f3bbb7]">
            System performance is optimal. All production modules reporting green.
          </p>

          <p className="mt-12 text-5xl font-bold text-text-primary">99.8%</p>
        </article>
      </section>
    </div>
  );
}
