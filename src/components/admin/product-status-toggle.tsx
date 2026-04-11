'use client'

import { useTransition } from 'react'
import { updateProductStatus } from '@/app/admin/actions'
import type { ProductStatus } from '@/lib/types'

export function ProductStatusToggle({
  productId,
  status,
}: {
  productId: string
  status: ProductStatus
}) {
  const [isPending, startTransition] = useTransition()

  const isAvailable = status === "available"
  const isPreorder = status === "preorder"
  const label = isAvailable ? "Available" : isPreorder ? "Pre-Order" : "Unavailable"

  const toggleStatus = () => {
    // Cycle: available -> preorder -> unavailable -> available
    const nextStatus: ProductStatus = isAvailable
      ? "preorder"
      : isPreorder
      ? "unavailable"
      : "available"

    startTransition(async () => {
      await updateProductStatus(productId, nextStatus)
    })
  }

  return (
    <button
      type="button"
      onClick={toggleStatus}
      disabled={isPending}
      className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] outline-none"
    >
      <span className="relative block h-4 w-8 border border-border-dark bg-bg-recessed opacity-80 group-hover:opacity-100">
        <span
          className={`absolute top-0 h-full w-4 transition-all duration-300 ${
            isAvailable
              ? "right-0 bg-[#ffb3af]"
              : isPreorder
              ? "left-1/2 -translate-x-1/2 bg-[#ffb3af]"
              : "left-0 bg-[#544342]"
          }`}
        />
      </span>
      <span className={isAvailable ? "text-text-primary" : "text-text-muted"}>
        {label}
      </span>
    </button>
  )
}