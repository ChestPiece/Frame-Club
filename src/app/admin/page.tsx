import { listOrders, getAdminStats, listProductsForAdmin } from "@/lib/mock-services";
import type { ProductStatus } from "@/lib/types";

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M2.8 12s3.2-5.2 9.2-5.2 9.2 5.2 9.2 5.2-3.2 5.2-9.2 5.2-9.2-5.2-9.2-5.2Z" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="m4 16.5 8.8-8.8 3.5 3.5-8.8 8.8L4 20z" />
      <path d="m11.8 6.6 1.8-1.8a1.8 1.8 0 0 1 2.6 0l2.1 2.1a1.8 1.8 0 0 1 0 2.6l-1.8 1.8" />
    </svg>
  );
}

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
          <button
            type="button"
            disabled
            className="display-kicker border border-border-dark px-4 py-2 text-[10px] text-text-muted"
          >
            Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-245 text-left">
            <thead>
              <tr className="technical-label bg-bg-recessed text-[10px] text-text-muted">
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Car Model</th>
                <th className="px-6 py-3">Customization</th>
                <th className="px-6 py-3 text-center">Payment</th>
                <th className="px-6 py-3">Order Status</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={order.id}
                  className={`border-t border-border-dark/20 text-[11px] ${index % 2 === 0 ? "bg-bg-surface" : "bg-bg-base"}`}
                >
                  <td className="px-6 py-4 font-semibold text-text-primary">{order.orderNumber}</td>
                  <td className="px-6 py-4 text-text-muted">{order.customerName}</td>
                  <td className="px-6 py-4 text-text-muted">{order.productSlug}</td>
                  <td className="px-6 py-4 text-text-muted">{order.customization.background}</td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex border px-2 py-1 text-[9px] uppercase tracking-widest ${
                        order.paymentStatus === "paid"
                          ? "border-border-dark/40 bg-brand text-[#ffd5d2]"
                          : "border-border-dark bg-bg-recessed text-text-muted"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-muted">
                    <select
                      disabled
                      defaultValue={order.orderStatus}
                      className="w-full border border-border-dark/70 bg-bg-elevated px-2 py-1 text-[11px] text-text-muted"
                    >
                      <option value="pending">pending</option>
                      <option value="confirmed">confirmed</option>
                      <option value="in_production">in_production</option>
                      <option value="shipped">shipped</option>
                      <option value="delivered">delivered</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button type="button" className="text-text-muted transition-colors hover:text-text-primary" aria-label="View order">
                      <EyeIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-3">
        <article className="border border-border-dark bg-bg-surface lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border-dark bg-bg-recessed px-6 py-4">
            <h2 className="technical-label text-xs text-text-primary">Inventory Management</h2>
            <button type="button" disabled className="technical-label text-[10px] text-[#ffb3af]">
              + Add Frame
            </button>
          </div>

          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="technical-label text-[10px] text-text-muted">
                <th className="px-6 py-3">Car Model</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Orders</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-border-dark/20">
                  <td className="px-6 py-4 font-semibold">{product.name}</td>
                  <td className="px-6 py-4 text-text-muted">
                    <ProductStatusToggle status={product.status} />
                  </td>
                  <td className="px-6 py-4 text-text-muted">--</td>
                  <td className="px-6 py-4 text-text-muted">
                    <button type="button" className="transition-colors hover:text-text-primary" aria-label="Edit product">
                      <EditIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
