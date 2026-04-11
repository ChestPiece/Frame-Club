import type { ProductStatus } from "@/lib/types";

type StatusBadgeProps = {
  status: ProductStatus;
};

const STYLES: Record<ProductStatus, string> = {
  available: "border-[#2e6f4f] bg-[#173628] text-[#9bf0ba]",
  preorder: "border-[#6a1510] bg-brand text-[#ffd3d0]",
  unavailable: "border-border-dark bg-[#1a1614] text-text-muted",
};

const LABELS: Record<ProductStatus, string> = {
  available: "Available",
  preorder: "Pre-Order",
  unavailable: "Unavailable",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}
