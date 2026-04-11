import type { ProductStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

type StatusBadgeProps = {
  status: ProductStatus;
};

const VARIANTS: Record<ProductStatus, "available" | "preorder" | "unavailable"> = {
  available: "available",
  preorder: "preorder",
  unavailable: "unavailable",
};

const LABELS: Record<ProductStatus, string> = {
  available: "Available",
  preorder: "Pre-Order",
  unavailable: "Unavailable",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant={VARIANTS[status]}>
      {LABELS[status]}
    </Badge>
  );
}
