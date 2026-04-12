import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";
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

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@frameclub.pk";
const FROM_EMAIL = "Frame Club <orders@frameclub.pk>";

function makeOrderNumber() {
  return `FC-${Math.floor(Math.random() * 900000 + 100000)}`;
}

export async function createOrder(input: CreateOrderInput) {
  const supabase = await createClient();
  
  // Get product
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, price")
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

  // Need to map product_id to productSlug for return type since OrderRecord requires productSlug
  // Alternatively we can use join query
  return { 
    data: {
      ...order,
      productSlug: input.productSlug
    } as any as OrderRecord 
  };
}

export async function getOrderById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, products(slug)")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return {
    ...data,
    productSlug: data.products?.slug
  } as any as OrderRecord;
}

export async function listOrders() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, products(slug)")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map(order => ({
    ...order,
    productSlug: order.products?.slug
  })) as any as OrderRecord[];
}

export async function getAdminStats() {
  const supabase = await createClient();
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

export async function applyWebhook(
  input: WebhookInput,
  options?: { supabaseClient?: any }
) {
  const supabase = options?.supabaseClient ?? (await createClient());
  const { data: current, error: fetchError } = await supabase
    .from("orders")
    .select("order_status, payment_status")
    .eq("id", input.orderId)
    .single();

  if (fetchError || !current) {
    return { error: "ORDER_NOT_FOUND" as const };
  }

  const nextOrderStatus: OrderStatus =
    input.paymentStatus === "paid"
      ? current.order_status === "pending"
        ? "confirmed"
        : current.order_status
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

  return {
    data: updated as any as OrderRecord,
    previousPaymentStatus: current.payment_status as PaymentStatus,
  };
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
    .select()
    .single();

  if (!error && data) {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      message: data.message,
      createdAt: data.created_at,
    } as ContactSubmission;
  }

  console.error("Contact submission persistence failed:", error);

  if (resend) {
    await resend.emails
      .send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: "New contact form submission",
        text: `Name: ${input.name}\nEmail: ${input.email}\n\nMessage:\n${input.message}`,
      })
      .catch((emailError) => {
        console.error("Contact submission fallback email failed:", emailError);
      });
  }

  return {
    id: crypto.randomUUID(),
    name: input.name,
    email: input.email,
    message: input.message,
    createdAt: new Date().toISOString(),
  } satisfies ContactSubmission;
}

export async function createNotifySubscription(input: CreateNotifyInput) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notify_subscriptions")
    .insert({
      email: input.email,
      product_slug: input.productSlug,
    })
    .select()
    .single();

  if (!error && data) {
    return {
      id: data.id,
      email: data.email,
      productSlug: data.product_slug,
      createdAt: data.created_at,
    } as NotifySubscription;
  }

  console.error("Notify subscription persistence failed:", error);

  if (resend) {
    await resend.emails
      .send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: "New notify-me request",
        text: `Email: ${input.email}\nProduct slug: ${input.productSlug}`,
      })
      .catch((emailError) => {
        console.error("Notify subscription fallback email failed:", emailError);
      });
  }

  return {
    id: crypto.randomUUID(),
    email: input.email,
    productSlug: input.productSlug,
    createdAt: new Date().toISOString(),
  } satisfies NotifySubscription;
}