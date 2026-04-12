import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Json, Tables } from "@/lib/supabase/database.types";
import type {
  ContactSubmission,
  NotifySubscription,
  OrderRecord,
  OrderStatus,
  PaymentStatus,
} from "@/lib/types";

type CreateOrderInput = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  productSlug: string;
  background: string;
  notes?: string;
};

type WebhookInput = {
  orderId: string;
  paymentStatus: PaymentStatus;
};

type CreateContactInput = {
  name: string;
  email: string;
  message: string;
};

type CreateNotifyInput = {
  email: string;
  productSlug: string;
};

type OrderRow = Tables<"orders">;

function makeOrderNumber() {
  return `FC-${Math.floor(Math.random() * 900000 + 100000)}`;
}

function parseCustomization(value: Json | null): OrderRecord["customization"] {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const background = value.background;
    const notes = value.notes;
    return {
      background: typeof background === "string" ? background : "",
      notes: typeof notes === "string" ? notes : "",
    };
  }

  return { background: "", notes: "" };
}

function parsePaymentStatus(value: string | null): PaymentStatus {
  if (value === "paid" || value === "failed" || value === "pending") {
    return value;
  }
  return "pending";
}

function parseOrderStatus(value: string | null): OrderStatus {
  if (
    value === "pending" ||
    value === "confirmed" ||
    value === "in_production" ||
    value === "shipped" ||
    value === "delivered"
  ) {
    return value;
  }
  return "pending";
}

function toOrderRecord(row: OrderRow): OrderRecord {
  return {
    id: row.id,
    orderNumber: row.order_number,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    customerAddress: row.customer_address,
    customerCity: row.customer_city,
    productId: row.product_id ?? "",
    productSlug: row.product_slug ?? "",
    price: row.price,
    customization: parseCustomization(row.customization),
    paymentStatus: parsePaymentStatus(row.payment_status),
    orderStatus: parseOrderStatus(row.order_status),
    createdAt: row.created_at ?? new Date().toISOString(),
  };
}

export async function createOrder(input: CreateOrderInput) {
  const supabase = await createClient();

  // Get product
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, price, slug")
    .eq("slug", input.productSlug)
    .single();

  if (productError || !product) {
    console.error("Product fetch error:", productError);
    return { error: "PRODUCT_NOT_FOUND" as const };
  }

  const orderNumber = makeOrderNumber();

  // Insert order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      customer_name: input.customerName,
      customer_email: input.customerEmail,
      customer_phone: input.customerPhone,
      customer_address: input.customerAddress,
      customer_city: input.customerCity,
      product_id: product.id,
      product_slug: product.slug,
      customization: {
        background: input.background,
        notes: input.notes ?? "",
      },
      price: product.price,
      payment_status: "pending",
      order_status: "pending",
    })
    .select()
    .single();

  if (orderError) {
    console.error("Order insertion error:", orderError);
    return { error: "ORDER_CREATION_FAILED" as const };
  }

  return { data: toOrderRecord(order) };
}

export async function getOrderById(id: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return toOrderRecord(data);
}

export async function listOrders() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map(toOrderRecord);
}

export async function getAdminStats() {
  const supabase = createAdminClient();
  const { data: orders, error } = await supabase.from("orders").select("*");

  if (error || !orders) {
    return {
      totalOrders: 0,
      pendingOrders: 0,
      paidOrders: 0,
      inProduction: 0,
      revenue: 0,
    };
  }

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((order) => order.order_status === "pending").length;
  const paidOrders = orders.filter((order) => order.payment_status === "paid").length;
  const inProduction = orders.filter((order) => order.order_status === "in_production").length;

  return {
    totalOrders,
    pendingOrders,
    paidOrders,
    inProduction,
    revenue: orders
      .filter((order) => order.payment_status === "paid")
      .reduce((sum, order) => sum + order.price, 0),
  };
}

export async function applyWebhook(input: WebhookInput) {
  const supabase = createAdminClient();
  const { data: current, error: fetchError } = await supabase
    .from("orders")
    .select("order_status")
    .eq("id", input.orderId)
    .single();

  if (fetchError || !current) {
    return { error: "ORDER_NOT_FOUND" as const };
  }

  const nextOrderStatus: OrderStatus =
    input.paymentStatus === "paid"
      ? current.order_status === "pending"
        ? "confirmed"
        : parseOrderStatus(current.order_status)
      : "pending";

  const { data: updated, error: updateError } = await supabase
    .from("orders")
    .update({
      payment_status: input.paymentStatus,
      order_status: nextOrderStatus,
    })
    .eq("id", input.orderId)
    .select()
    .single();

  if (updateError) {
    return { error: "UPDATE_FAILED" as const };
  }

  return { data: toOrderRecord(updated) };
}

export async function createContactSubmission(input: CreateContactInput) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_submissions")
    .insert({
      name: input.name,
      email: input.email,
      message: input.message,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error("Failed to save contact submission.");
  }

  const submission: ContactSubmission = {
    id: data.id,
    name: data.name,
    email: data.email,
    message: data.message,
    createdAt: data.created_at ?? new Date().toISOString(),
  };

  return submission;
}

export async function createNotifySubscription(input: CreateNotifyInput) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notify_subscriptions")
    .upsert(
      {
        email: input.email,
        product_slug: input.productSlug,
      },
      { onConflict: "email,product_slug" }
    )
    .select("*")
    .single();

  if (error || !data) {
    throw new Error("Failed to save notify subscription.");
  }

  const subscription: NotifySubscription = {
    id: data.id,
    email: data.email,
    productSlug: data.product_slug,
    createdAt: data.created_at ?? new Date().toISOString(),
  };

  return subscription;
}