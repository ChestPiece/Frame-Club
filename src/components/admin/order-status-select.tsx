'use client'

import { useTransition } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { updateOrderStatus } from '@/app/admin/actions'
import type { OrderStatus } from '@/lib/types'

const orderStatusOptions: OrderStatus[] = [
  "pending",
  "confirmed",
  "in_production",
  "shipped",
  "delivered"
];

export function OrderStatusSelect({
  orderId,
  currentStatus,
  customerEmail,
  orderNumber,
  productSlug,
}: {
  orderId: string
  currentStatus: OrderStatus
  customerEmail: string
  orderNumber: string
  productSlug: string
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <Select
      disabled={isPending}
      defaultValue={currentStatus}
      onValueChange={(value) => {
        startTransition(async () => {
          await updateOrderStatus(
            orderId,
            value as OrderStatus,
            customerEmail,
            orderNumber,
            productSlug
          )
        })
      }}
    >
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
  )
}