import { getProductBySlug, getProducts } from "@/lib/mock-data";
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

const now = () => new Date().toISOString();

function makeOrderId() {
  return `ord_${Date.now()}_${Math.floor(Math.random() * 9000 + 1000)}`;
}

function makeTicketId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 9000 + 1000)}`;
}

function makeOrderNumber() {
  return `FC-${Math.floor(Math.random() * 900000 + 100000)}`;
}

let orders: OrderRecord[] = [
  {
    id: "ord_seed_1",
    orderNumber: "FC-8821",
    customerName: "Hamza Khan",
    customerEmail: "hamza@example.com",
    customerPhone: "+923001111111",
    customerAddress: "DHA Phase 6",
    customerCity: "Karachi",
    productId: "p1",
    productSlug: "porsche-911-gt2-rs",
    price: 5000,
    customization: {
      background: "carbon-grid",
      notes: "Deliver in secure double packaging.",
    },
    paymentStatus: "paid",
    orderStatus: "in_production",
    createdAt: now(),
  },
  {
    id: "ord_seed_2",
    orderNumber: "FC-8822",
    customerName: "Sarah Junaid",
    customerEmail: "sarah@example.com",
    customerPhone: "+923002222222",
    customerAddress: "Gulberg III",
    customerCity: "Lahore",
    productId: "p2",
    productSlug: "ferrari-f40",
    price: 5000,
    customization: {
      background: "race-line",
      notes: "Use red accent label on spec plate.",
    },
    paymentStatus: "pending",
    orderStatus: "pending",
    createdAt: now(),
  },
];

let contactSubmissions: ContactSubmission[] = [];
let notifySubscriptions: NotifySubscription[] = [];

export function createOrder(input: CreateOrderInput) {
  const product = getProductBySlug(input.productSlug);
  if (!product) {
    return { error: "PRODUCT_NOT_FOUND" as const };
  }

  const record: OrderRecord = {
    id: makeOrderId(),
    orderNumber: makeOrderNumber(),
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
    customerAddress: input.customerAddress,
    customerCity: input.customerCity,
    productId: product.id,
    productSlug: product.slug,
    price: product.price,
    customization: {
      background: input.background,
      notes: input.notes ?? "",
    },
    paymentStatus: "pending",
    orderStatus: "pending",
    createdAt: now(),
  };

  orders = [record, ...orders];
  return { data: record };
}

export function getOrderById(id: string) {
  return orders.find((order) => order.id === id);
}

export function listOrders() {
  return [...orders].sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
}

export function listProductsForAdmin() {
  return getProducts();
}

export function getAdminStats() {
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((order) => order.orderStatus === "pending").length;
  const paidOrders = orders.filter((order) => order.paymentStatus === "paid").length;
  const inProduction = orders.filter((order) => order.orderStatus === "in_production").length;

  return {
    totalOrders,
    pendingOrders,
    paidOrders,
    inProduction,
    revenue: orders
      .filter((order) => order.paymentStatus === "paid")
      .reduce((sum, order) => sum + order.price, 0),
  };
}

export function applyWebhook(input: WebhookInput) {
  const index = orders.findIndex((order) => order.id === input.orderId);
  if (index < 0) {
    return { error: "ORDER_NOT_FOUND" as const };
  }

  const current = orders[index];
  const nextOrderStatus: OrderStatus =
    input.paymentStatus === "paid"
      ? current.orderStatus === "pending"
        ? "confirmed"
        : current.orderStatus
      : "pending";

  const updated: OrderRecord = {
    ...current,
    paymentStatus: input.paymentStatus,
    orderStatus: nextOrderStatus,
  };

  orders[index] = updated;
  return { data: updated };
}

export function createContactSubmission(input: CreateContactInput) {
  const record: ContactSubmission = {
    id: makeTicketId("contact"),
    name: input.name,
    email: input.email,
    message: input.message,
    createdAt: now(),
  };

  contactSubmissions = [record, ...contactSubmissions];
  return record;
}

export function createNotifySubscription(input: CreateNotifyInput) {
  const record: NotifySubscription = {
    id: makeTicketId("notify"),
    email: input.email,
    productSlug: input.productSlug,
    createdAt: now(),
  };

  notifySubscriptions = [record, ...notifySubscriptions];
  return record;
}
