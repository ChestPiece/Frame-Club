'use server'

import { createClient, createServiceClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { OrderStatus, ProductStatus } from '@/lib/db/types'
import { sendStatusUpdate } from '@/lib/emails/send'
import { getOrderById } from '@/lib/db/services'
import { getConfiguredAdminEmail, isUserAdmin } from '@/lib/auth/admin'

async function assertAdminSession() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false as const, error: 'UNAUTHORIZED' }
  }

  if (!getConfiguredAdminEmail()) {
    return { ok: false as const, error: 'ADMIN_NOT_CONFIGURED' }
  }

  if (!isUserAdmin(user.email)) {
    return { ok: false as const, error: 'FORBIDDEN' }
  }

  return { ok: true as const }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus, _customerEmail: string, _orderNumber: string, productSlug: string) {
  const auth = await assertAdminSession()
  if (!auth.ok) {
    return { success: false, error: auth.error }
  }

  const supabase = await createServiceClient()

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
  const auth = await assertAdminSession()
  if (!auth.ok) {
    return { success: false, error: auth.error }
  }

  const supabase = await createServiceClient()

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