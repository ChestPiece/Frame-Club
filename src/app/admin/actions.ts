'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import type { OrderStatus, ProductStatus } from '@/lib/types'
import { sendStatusUpdate } from '@/lib/emails/send'
import { getOrderById } from '@/lib/services'

export async function updateOrderStatus(orderId: string, status: OrderStatus, _customerEmail: string, _orderNumber: string, productSlug: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('orders')
    .update({ order_status: status })
    .eq('id', orderId)
    .select()
    .single()

  if (error) {
    console.error('Failed to update order status:', error)
    return { success: false, error: error.message }
  }

  // Trigger email notification
  const { data: product } = await supabase
    .from('products')
    .select('name')
    .eq('slug', productSlug)
    .single()
    
  const productName = product?.name || productSlug

  const orderRecord = await getOrderById(orderId)
  if (orderRecord) {
    await sendStatusUpdate(orderRecord, productName)
  }

  revalidatePath('/admin')
  revalidatePath('/admin/orders')
  return { success: true }
}

export async function updateProductStatus(productId: string, status: ProductStatus) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('products')
    .update({ status })
    .eq('id', productId)

  if (error) {
    console.error('Failed to update product status:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/products')
  revalidatePath('/shop')
  revalidatePath('/')
  return { success: true }
}