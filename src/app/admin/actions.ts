'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { OrderStatus, ProductStatus } from '@/lib/types'
import { sendStatusUpdate } from '@/lib/emails/send'

export async function updateOrderStatus(orderId: string, status: OrderStatus, customerEmail: string, orderNumber: string, productSlug: string) {
  const supabase = await createClient()

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
  // We need to fetch the actual product name, or just use the slug for now
  const { data: product } = await supabase
    .from('products')
    .select('name')
    .eq('slug', productSlug)
    .single()
    
  const productName = product?.name || productSlug

  // Format order record for the email template
  const orderRecord = {
    id: data.id,
    orderNumber: data.order_number,
    customerName: data.customer_name,
    customerEmail: data.customer_email,
    customerPhone: data.customer_phone,
    customerAddress: data.customer_address,
    customerCity: data.customer_city,
    productId: data.product_id,
    productSlug: productSlug,
    customization: data.customization,
    price: data.price,
    paymentStatus: data.payment_status,
    orderStatus: data.order_status,
    createdAt: data.created_at,
  }

  await sendStatusUpdate(orderRecord as any, productName)

  revalidatePath('/admin')
  revalidatePath('/admin/orders')
  return { success: true }
}

export async function updateProductStatus(productId: string, status: ProductStatus) {
  const supabase = await createClient()

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