import { NextResponse } from "next/server";
import { applyWebhook } from "@/lib/services";
import { verifyPayFastSignature } from "@/lib/payfast";
import { getProductBySlug } from "@/lib/data";
import { sendAdminNotification, sendOrderConfirmation } from "@/lib/emails/send";

export async function POST(request: Request) {
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
  });

  if ("error" in result || !result.data) {
    console.error("Webhook processing failed:", result.error);
    return new NextResponse("Processing Failed", { status: 500 });
  }

  const order = result.data;

  // Send emails if payment is complete
  if (paymentStatus === "paid") {
    const product = await getProductBySlug(order.productSlug);
    const productName = product?.name || order.productSlug;

    await Promise.all([
      sendOrderConfirmation(order, productName),
      sendAdminNotification(order, productName)
    ]).catch(console.error);
  }

  return new NextResponse("OK", { status: 200 });
}