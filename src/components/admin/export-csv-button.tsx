'use client'

import { Button } from '@/components/ui/button'
import type { OrderRecord } from '@/lib/db/types'

function escapeCsvValue(value: unknown) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`
}

export function ExportCsvButton({ orders }: { orders: OrderRecord[] }) {
  const handleExport = () => {
    if (!orders || orders.length === 0) return

    const headers = [
      'Order ID',
      'Order Number',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Customer Address',
      'Customer City',
      'Product Model',
      'Customization',
      'Price',
      'Payment Status',
      'Order Status',
      'Notes',
      'Date Created'
    ]

    const csvContent = [
      headers.join(','),
      ...orders.map(order => {
        const customization = `Background: ${order.customization.background}, Notes: ${order.customization.notes || ''}`

        return [
          escapeCsvValue(order.id),
          escapeCsvValue(order.orderNumber),
          escapeCsvValue(order.customerName),
          escapeCsvValue(order.customerEmail),
          escapeCsvValue(order.customerPhone),
          escapeCsvValue(order.customerAddress),
          escapeCsvValue(order.customerCity),
          escapeCsvValue(order.productSlug),
          escapeCsvValue(customization),
          escapeCsvValue(order.price),
          escapeCsvValue(order.paymentStatus),
          escapeCsvValue(order.orderStatus),
          escapeCsvValue(order.customization.notes || ''),
          escapeCsvValue(new Date(order.createdAt).toISOString())
        ].join(',')
      })
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button
      type="button"
      onClick={handleExport}
      variant="outline"
      size="sm"
      className="display-kicker text-[10px] text-text-primary hover:text-text-primary"
    >
      Export CSV
    </Button>
  )
}