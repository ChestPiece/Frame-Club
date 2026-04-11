import { Edit2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAdminStats, listOrders, listProductsForAdmin } from "@/lib/mock-services";
import type { ProductStatus } from "@/lib/types";

function ProductStatusToggle({ status }: { status: ProductStatus }) {
  const isAvailable = status === "available";
  const isPreorder = status === "preorder";
  const label = isAvailable ? "Available" : isPreorder ? "Pre-Order" : "Unavailable";

  return (
    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em]">
      <span className="relative block h-4 w-8 border border-border-dark bg-bg-recessed">
        <span
          className={`absolute top-0 h-full w-4 ${
            isAvailable ? "right-0 bg-[#ffb3af]" : isPreorder ? "left-1/2 -translate-x-1/2 bg-[#ffb3af]" : "left-0 bg-[#544342]"
          }`}
        />
      </span>
      <span className={isAvailable ? "text-text-primary" : "text-text-muted"}>{label}</span>
    </div>
  );
}

export default function AdminDashboardPage() {
  const stats = getAdminStats();
  const orders = listOrders().slice(0, 5);
  const products = listProductsForAdmin().slice(0, 4);

  return (
    <div className="space-y-10">
      <section className="grid gap-0 md:grid-cols-2 lg:grid-cols-4">
        <article className="border border-border-dark bg-bg-surface p-8">
          <p className="technical-label text-[10px] text-text-muted">Total Orders</p>
          <p className="mt-4 text-4xl font-bold">{stats.totalOrders}</p>
        </article>

        <article className="border border-border-dark border-l-0 bg-bg-surface p-8">
          <p className="technical-label text-[10px] text-text-muted">Pending Orders</p>
          <p className="mt-4 text-4xl font-bold">{stats.pendingOrders}</p>
        </article>

        <article className="border border-border-dark border-l-0 bg-bg-surface p-8">
          <p className="technical-label text-[10px] text-text-muted">Revenue This Month</p>
          <p className="mt-4 text-3xl font-bold">Rs. {stats.revenue.toLocaleString("en-PK")}</p>
        </article>

        <article className="border border-border-dark border-l-0 bg-bg-surface p-8">
          <p className="technical-label text-[10px] text-text-muted">Frames In Production</p>
          <p className="mt-4 text-4xl font-bold">{stats.inProduction}</p>
        </article>
      </section>

      <section className="border border-border-dark bg-bg-surface">
        <div className="flex items-center justify-between border-b border-border-dark bg-bg-recessed px-6 py-4">
          <h2 className="technical-label text-xs text-text-primary">Live Order Pipeline</h2>
          <Button
            type="button"
            disabled
            variant="outline"
            size="sm"
            className="display-kicker text-[10px] text-text-muted"
          >
            Export CSV
          </Button>
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
                  <Select disabled defaultValue={order.orderStatus}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">pending</SelectItem>
                      <SelectItem value="confirmed">confirmed</SelectItem>
                      <SelectItem value="in_production">in_production</SelectItem>
                      <SelectItem value="shipped">shipped</SelectItem>
                      <SelectItem value="delivered">delivered</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <ProductStatusToggle status={product.status} />
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
          <h3 className="technical-label text-xl leading-tight text-text-primary">
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
