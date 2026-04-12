import type { ProductStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { PulsingDot } from "@/components/shared/pulsing-dot";

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
    <div className="flex items-center gap-2">
      {status === "available" && <PulsingDot />}
      <Badge variant={VARIANTS[status]}>{LABELS[status]}</Badge>
    </div>
  );
}
