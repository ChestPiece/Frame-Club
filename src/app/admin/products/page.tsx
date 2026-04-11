import { Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listProductsForAdmin } from "@/lib/mock-services";
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

export default function AdminProductsPage() {
  const products = listProductsForAdmin();

  return (
    <section className="border border-border-dark bg-bg-surface">
      <div className="flex items-center justify-between border-b border-border-dark bg-bg-recessed px-6 py-4">
        <h1 className="display-kicker text-5xl leading-none">PRODUCTS</h1>
        <Button
          type="button"
          disabled
          variant="outline"
          size="sm"
          className="display-kicker text-[10px] text-text-muted"
        >
          Add Product
        </Button>
      </div>

      <Table className="min-w-215">
        <TableHeader>
          <TableRow>
            <TableHead>Model</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Delivery</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((product, index) => (
            <TableRow key={product.id} className={index % 2 === 0 ? "bg-bg-surface" : "bg-bg-base"}>
              <TableCell className="text-xs font-semibold text-text-primary">{product.name}</TableCell>
              <TableCell className="text-xs text-text-muted">{product.brand}</TableCell>
              <TableCell className="text-xs text-text-muted">Rs. {product.price.toLocaleString("en-PK")}</TableCell>
              <TableCell className="text-xs text-text-muted">{product.deliveryDays} days</TableCell>
              <TableCell className="text-xs uppercase tracking-[0.2em] text-text-muted">
                <ProductStatusToggle status={product.status} />
              </TableCell>
              <TableCell className="text-text-muted">
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
    </section>
  );
}
