import { Edit2 } from "lucide-react";

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
import { getProducts as listProductsForAdmin } from "@/lib/data";
import { ProductStatusToggle } from "@/components/admin/product-status-toggle";

export default async function AdminProductsPage() {
  const products = await listProductsForAdmin();

  return (
    <section className="border border-border bg-bg-surface">
      <div className="flex items-center justify-between border-b border-border bg-bg-deep px-6 py-4">
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
                <ProductStatusToggle productId={product.id} status={product.status} />
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
