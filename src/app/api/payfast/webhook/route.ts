import { NextResponse } from "next/server";
import { applyWebhook } from "@/lib/services";
import { verifyPayFastSignature } from "@/lib/payfast";
import { getProductBySlug } from "@/lib/data";
import { sendAdminNotification, sendOrderConfirmation } from "@/lib/emails/send";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  let serviceClient;

  try {
    serviceClient = await createServiceClient();
  } catch (error) {
    console.error("Webhook configuration error:", error);
    return new NextResponse("Webhook Configuration Error", { status: 500 });
  }

  const formData = await request.formData().catch(() => null);

  if (!formData) {
    return new NextResponse("Invalid Request", { status: 400 });
  }

  // Convert formData to a plain object
  const data: Record<string, string> = {};
  formData.forEach((value, key) => {
    data[key] = value.toString();
  });

  // Verify the signature
  const isValid = verifyPayFastSignature(data);
  if (!isValid) {
    console.error("PayFast signature verification failed", data);
    return new NextResponse("Invalid Signature", { status: 400 });
  }

  const paymentStatus = data.payment_status === "COMPLETE" ? "paid" : "failed";
  const orderId = data.m_payment_id;

  if (!orderId) {
    return new NextResponse("Missing m_payment_id", { status: 400 });
  }

  const result = await applyWebhook({
    orderId,
    paymentStatus,
  }, {
    supabaseClient: serviceClient,
  });

  if ("error" in result || !result.data) {
    console.error("Webhook processing failed:", result.error);
    return new NextResponse("Processing Failed", { status: 500 });
  }

  const order = result.data;
  const shouldSendPaymentEmails =
    paymentStatus === "paid" && result.previousPaymentStatus !== "paid";

  // Send emails if payment is complete
  if (shouldSendPaymentEmails) {
    const product = await getProductBySlug(order.productSlug);
    const productName = product?.name || order.productSlug;

    // We can fire these off concurrently
    Promise.all([
      sendOrderConfirmation(order, productName),
      sendAdminNotification(order, productName)
    ]).catch(console.error);
  }

  return new NextResponse("OK", { status: 200 });
}