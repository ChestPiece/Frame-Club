import { Eye } from "lucide-react";
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
import { listOrders } from "@/lib/mock-services";

const orderStatusOptions = ["pending", "confirmed", "in_production", "shipped", "delivered"];

export default function AdminOrdersPage() {
  const orders = listOrders();

  return (
    <section className="border border-border-dark bg-bg-surface">
      <div className="flex items-center justify-between border-b border-border-dark bg-bg-recessed px-6 py-4">
        <h1 className="display-kicker text-5xl leading-none">ORDERS</h1>
        <p className="technical-label text-[10px] text-text-muted">Newest First</p>
      </div>

      <Table className="min-w-270">
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Customization</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.map((order, index) => (
            <TableRow key={order.id} className={index % 2 === 0 ? "bg-bg-surface" : "bg-bg-base"}>
              <TableCell className="text-xs font-semibold text-text-primary">{order.orderNumber}</TableCell>
              <TableCell className="text-xs text-text-muted">
                <p>{order.customerName}</p>
                <p>{order.customerEmail}</p>
                <p>{order.customerPhone}</p>
              </TableCell>
              <TableCell className="text-xs text-text-muted">{order.customerCity}</TableCell>
              <TableCell className="text-xs text-text-muted">{order.productSlug}</TableCell>
              <TableCell className="text-xs text-text-muted">
                <p>Background: {order.customization.background}</p>
                <p>Notes: {order.customization.notes || "None"}</p>
              </TableCell>
              <TableCell className="text-xs text-text-muted">
                <Badge
                  variant={order.paymentStatus === "paid" ? "paid" : "pending"}
                  className="px-2 py-1 text-[9px] tracking-widest"
                >
                  {order.paymentStatus}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-text-muted">
                <Select disabled defaultValue={order.orderStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {orderStatusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="mt-1 text-[10px] text-text-muted">Inline updates enabled in next phase</p>
              </TableCell>
              <TableCell className="text-xs text-text-muted">{new Date(order.createdAt).toLocaleString()}</TableCell>
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
  );
}
