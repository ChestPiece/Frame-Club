import { listProductsForAdmin } from "@/lib/mock-services";
import type { ProductStatus } from "@/lib/types";

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

export default function AdminProductsPage() {
  const products = listProductsForAdmin();

  return (
    <section className="border border-border-dark bg-bg-surface">
      <div className="flex items-center justify-between border-b border-border-dark bg-bg-recessed px-6 py-4">
        <h1 className="display-kicker text-5xl leading-none">PRODUCTS</h1>
        <button
          type="button"
          disabled
          className="display-kicker border border-border-dark px-4 py-2 text-[10px] text-text-muted"
        >
          Add Product
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-215 text-left text-sm">
          <thead className="technical-label text-[10px] text-text-muted">
            <tr>
              <th className="px-6 py-3">Model</th>
              <th className="px-6 py-3">Brand</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Delivery</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product, index) => (
              <tr key={product.id} className={`border-t border-border-dark/20 ${index % 2 === 0 ? "bg-bg-surface" : "bg-bg-base"}`}>
                <td className="px-6 py-4 text-xs font-semibold text-text-primary">{product.name}</td>
                <td className="px-6 py-4 text-xs text-text-muted">{product.brand}</td>
                <td className="px-6 py-4 text-xs text-text-muted">Rs. {product.price.toLocaleString("en-PK")}</td>
                <td className="px-6 py-4 text-xs text-text-muted">{product.deliveryDays} days</td>
                <td className="px-6 py-4 text-xs uppercase tracking-[0.2em] text-text-muted">
                  <ProductStatusToggle status={product.status} />
                </td>
                <td className="px-6 py-4 text-text-muted">
                  <button type="button" className="transition-colors hover:text-text-primary" aria-label="Edit product">
                    <EditIcon />
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
