import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em]",
  {
    variants: {
      variant: {
        default: "border-border-dark bg-bg-recessed text-text-muted",
        available: "border-[#2e6f4f] bg-[#173628] text-[#9bf0ba]",
        preorder: "border-[#6a1510] bg-brand text-[#ffd3d0]",
        unavailable: "border-border-dark bg-[#1a1614] text-text-muted",
        paid: "border-border-dark/40 bg-brand text-[#ffd5d2]",
        pending: "border-border-dark bg-bg-recessed text-text-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
