import { listOrders } from "@/lib/mock-services";

const orderStatusOptions = ["pending", "confirmed", "in_production", "shipped", "delivered"];

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M2.8 12s3.2-5.2 9.2-5.2 9.2 5.2 9.2 5.2-3.2 5.2-9.2 5.2-9.2-5.2-9.2-5.2Z" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  );
}

export default function AdminOrdersPage() {
  const orders = listOrders();

  return (
    <section className="border border-border-dark bg-bg-surface">
      <div className="flex items-center justify-between border-b border-border-dark bg-bg-recessed px-6 py-4">
        <h1 className="display-kicker text-5xl leading-none">ORDERS</h1>
        <p className="technical-label text-[10px] text-text-muted">Newest First</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-270 text-left text-sm">
          <thead className="technical-label text-[10px] text-text-muted">
            <tr>
              <th className="px-6 py-3">Order</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">City</th>
              <th className="px-6 py-3">Model</th>
              <th className="px-6 py-3">Customization</th>
              <th className="px-6 py-3">Payment</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Created</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, index) => (
              <tr
                key={order.id}
                className={`border-t border-border-dark/20 align-top ${index % 2 === 0 ? "bg-bg-surface" : "bg-bg-base"}`}
              >
                <td className="px-6 py-4 text-xs font-semibold text-text-primary">{order.orderNumber}</td>
                <td className="px-6 py-4 text-xs text-text-muted">
                  <p>{order.customerName}</p>
                  <p>{order.customerEmail}</p>
                  <p>{order.customerPhone}</p>
                </td>
                <td className="px-6 py-4 text-xs text-text-muted">{order.customerCity}</td>
                <td className="px-6 py-4 text-xs text-text-muted">{order.productSlug}</td>
                <td className="px-6 py-4 text-xs text-text-muted">
                  <p>Background: {order.customization.background}</p>
                  <p>Notes: {order.customization.notes || "None"}</p>
                </td>
                <td className="px-6 py-4 text-xs text-text-muted">
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

                <td className="px-6 py-4 text-xs text-text-muted">
                  <select
                    disabled
                    defaultValue={order.orderStatus}
                    className="w-full border border-border-dark/70 bg-bg-elevated px-2 py-1 text-[11px] text-text-muted"
                  >
                    {orderStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-[10px] text-text-muted">Inline updates enabled in next phase</p>
                </td>
                <td className="px-6 py-4 text-xs text-text-muted">{new Date(order.createdAt).toLocaleString()}</td>
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
  );
}
