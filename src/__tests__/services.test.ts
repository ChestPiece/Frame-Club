import { beforeEach, describe, expect, it, vi } from "vitest";

const { createClientMock, createServiceClientMock } = vi.hoisted(() => ({
  createClientMock: vi.fn(),
  createServiceClientMock: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: createClientMock,
  createServiceClient: createServiceClientMock,
}));

import { applyWebhook, createOrder, getOrderById } from "@/lib/services";

function buildInsertChain(result: { data: unknown; error: unknown }) {
  const single = vi.fn().mockResolvedValue(result);
  const select = vi.fn().mockReturnValue({ single });
  const insert = vi.fn().mockReturnValue({ select });
  return { insert, select, single };
}

function buildEqSingleChain(result: { data: unknown; error: unknown }) {
  const single = vi.fn().mockResolvedValue(result);
  const eq = vi.fn().mockReturnValue({ single });
  const select = vi.fn().mockReturnValue({ eq });
  return { select, eq, single };
}

describe("services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("createOrder returns order record on success", async () => {
    const product = { id: "p1", price: 5000, slug: "r34" };
    const orderRow = {
      id: "o1",
      order_number: "FC-100001",
      customer_name: "Anas",
      customer_email: "anas@example.com",
      customer_phone: "123",
      customer_address: "addr",
      customer_city: "Lahore",
      product_id: "p1",
      product_slug: "r34",
      customization: { background: "Midnight", notes: "" },
      price: 5000,
      payment_status: "pending",
      order_status: "pending",
      created_at: "2026-01-01T00:00:00Z",
    };

    const productSingle = vi.fn().mockResolvedValue({ data: product, error: null });
    const productEq = vi.fn().mockReturnValue({ single: productSingle });
    const productSelect = vi.fn().mockReturnValue({ eq: productEq });

    const orderInsert = buildInsertChain({ data: orderRow, error: null });

    const from = vi.fn((table: string) => {
      if (table === "products") {
        return { select: productSelect };
      }
      if (table === "orders") {
        return { insert: orderInsert.insert };
      }
      throw new Error(`Unexpected table: ${table}`);
    });

    createClientMock.mockResolvedValue({ from });

    const result = await createOrder({
      customerName: "Anas",
      customerEmail: "anas@example.com",
      customerPhone: "123",
      customerAddress: "addr",
      customerCity: "Lahore",
      productSlug: "r34",
      background: "Midnight",
      notes: "",
    });

    expect("data" in result && result.data?.orderNumber).toBe("FC-100001");
  });

  it("createOrder returns PRODUCT_NOT_FOUND for missing product", async () => {
    const productSingle = vi.fn().mockResolvedValue({ data: null, error: { message: "missing" } });
    const productEq = vi.fn().mockReturnValue({ single: productSingle });
    const productSelect = vi.fn().mockReturnValue({ eq: productEq });
    const from = vi.fn(() => ({ select: productSelect }));
    createClientMock.mockResolvedValue({ from });

    const result = await createOrder({
      customerName: "Anas",
      customerEmail: "anas@example.com",
      customerPhone: "123",
      customerAddress: "addr",
      customerCity: "Lahore",
      productSlug: "missing",
      background: "Midnight",
    });

    expect(result).toEqual({ error: "PRODUCT_NOT_FOUND" });
  });

  it("createOrder returns ORDER_CREATION_FAILED for insert error", async () => {
    const product = { id: "p1", price: 5000, slug: "r34" };
    const productSingle = vi.fn().mockResolvedValue({ data: product, error: null });
    const productEq = vi.fn().mockReturnValue({ single: productSingle });
    const productSelect = vi.fn().mockReturnValue({ eq: productEq });

    const orderInsert = buildInsertChain({ data: null, error: { message: "failed" } });

    const from = vi.fn((table: string) => {
      if (table === "products") return { select: productSelect };
      if (table === "orders") return { insert: orderInsert.insert };
      throw new Error(`Unexpected table: ${table}`);
    });

    createClientMock.mockResolvedValue({ from });

    const result = await createOrder({
      customerName: "Anas",
      customerEmail: "anas@example.com",
      customerPhone: "123",
      customerAddress: "addr",
      customerCity: "Lahore",
      productSlug: "r34",
      background: "Midnight",
    });

    expect(result).toEqual({ error: "ORDER_CREATION_FAILED" });
  });

  it("getOrderById returns mapped order", async () => {
    const orderRow = {
      id: "o1",
      order_number: "FC-100001",
      customer_name: "Anas",
      customer_email: "anas@example.com",
      customer_phone: "123",
      customer_address: "addr",
      customer_city: "Lahore",
      product_id: "p1",
      product_slug: "r34",
      customization: { background: "Midnight", notes: "" },
      price: 5000,
      payment_status: "pending",
      order_status: "pending",
      created_at: "2026-01-01T00:00:00Z",
    };
    const selectChain = buildEqSingleChain({ data: orderRow, error: null });
    const from = vi.fn(() => ({ select: selectChain.select }));
    createServiceClientMock.mockResolvedValue({ from });

    const result = await getOrderById("o1");

    expect(result?.id).toBe("o1");
    expect(result?.customerEmail).toBe("anas@example.com");
  });

  it("getOrderById returns null when not found", async () => {
    const selectChain = buildEqSingleChain({ data: null, error: { message: "not found" } });
    const from = vi.fn(() => ({ select: selectChain.select }));
    createServiceClientMock.mockResolvedValue({ from });

    const result = await getOrderById("missing");

    expect(result).toBeNull();
  });

  it("applyWebhook confirms pending order when paid", async () => {
    const fetchSingle = vi
      .fn()
      .mockResolvedValue({ data: { order_status: "pending", payment_status: "pending" }, error: null });
    const fetchEq = vi.fn().mockReturnValue({ single: fetchSingle });
    const fetchSelect = vi.fn().mockReturnValue({ eq: fetchEq });

    const updated = {
      id: "o1",
      order_number: "FC-100001",
      customer_name: "Anas",
      customer_email: "anas@example.com",
      customer_phone: "123",
      customer_address: "addr",
      customer_city: "Lahore",
      product_id: "p1",
      product_slug: "r34",
      customization: { background: "Midnight", notes: "" },
      price: 5000,
      payment_status: "paid",
      order_status: "confirmed",
      created_at: "2026-01-01T00:00:00Z",
    };
    const updateSingle = vi.fn().mockResolvedValue({ data: updated, error: null });
    const updateSelect = vi.fn().mockReturnValue({ single: updateSingle });
    const updateEq = vi.fn().mockReturnValue({ select: updateSelect });
    const update = vi.fn().mockReturnValue({ eq: updateEq });

    const from = vi.fn((table: string) => {
      if (table !== "orders") throw new Error("Unexpected table");
      return { select: fetchSelect, update };
    });

    const result = await applyWebhook(
      { orderId: "o1", paymentStatus: "paid", paymentId: "pf-1" },
      { supabaseClient: { from } }
    );

    expect("data" in result && result.data?.orderStatus).toBe("confirmed");
    expect("previousPaymentStatus" in result && result.previousPaymentStatus).toBe("pending");
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        payment_status: "paid",
        order_status: "confirmed",
        payfast_payment_id: "pf-1",
      })
    );
  });

  it("applyWebhook returns ORDER_NOT_FOUND when fetch fails", async () => {
    const fetchSingle = vi.fn().mockResolvedValue({ data: null, error: { message: "missing" } });
    const fetchEq = vi.fn().mockReturnValue({ single: fetchSingle });
    const fetchSelect = vi.fn().mockReturnValue({ eq: fetchEq });
    const from = vi.fn(() => ({ select: fetchSelect, update: vi.fn() }));

    const result = await applyWebhook(
      { orderId: "missing", paymentStatus: "failed" },
      { supabaseClient: { from } }
    );

    expect(result).toEqual({ error: "ORDER_NOT_FOUND" });
  });

  it("applyWebhook returns UPDATE_FAILED when update fails", async () => {
    const fetchSingle = vi
      .fn()
      .mockResolvedValue({ data: { order_status: "pending", payment_status: "pending" }, error: null });
    const fetchEq = vi.fn().mockReturnValue({ single: fetchSingle });
    const fetchSelect = vi.fn().mockReturnValue({ eq: fetchEq });

    const updateSingle = vi.fn().mockResolvedValue({ data: null, error: { message: "write failed" } });
    const updateSelect = vi.fn().mockReturnValue({ single: updateSingle });
    const updateEq = vi.fn().mockReturnValue({ select: updateSelect });
    const update = vi.fn().mockReturnValue({ eq: updateEq });

    const from = vi.fn(() => ({ select: fetchSelect, update }));

    const result = await applyWebhook(
      { orderId: "o1", paymentStatus: "paid" },
      { supabaseClient: { from } }
    );

    expect(result).toEqual({ error: "UPDATE_FAILED" });
  });
});
