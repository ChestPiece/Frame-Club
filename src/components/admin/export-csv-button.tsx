'use client'

import { Button } from '@/components/ui/button'

export function ExportCsvButton({ orders }: { orders: any[] }) {
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
        return [
          order.id,
          order.orderNumber,
          `"${order.customerName.replace(/"/g, '""')}"`,
          `"${order.customerEmail.replace(/"/g, '""')}"`,
          `"${order.customerPhone.replace(/"/g, '""')}"`,
          `"${order.customerAddress.replace(/"/g, '""')}"`,
          `"${order.customerCity.replace(/"/g, '""')}"`,
          `"${order.productSlug.replace(/"/g, '""')}"`,
          `"Background: ${order.customization.background}, Notes: ${order.customization.notes || ''}"`,
          order.price,
          order.paymentStatus,
          order.orderStatus,
          `"${(order.notes || '').replace(/"/g, '""')}"`,
          new Date(order.createdAt).toISOString()
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