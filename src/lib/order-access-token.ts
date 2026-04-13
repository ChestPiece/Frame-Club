import crypto from "node:crypto";

const ORDER_TOKEN_TTL_MS = 1000 * 60 * 30;

function getOrderTokenSecret() {
  const secret =
    process.env.ORDER_ACCESS_TOKEN_SECRET ||
    process.env.PAYFAST_PASSPHRASE ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!secret) {
    throw new Error(
      "Missing token secret. Set ORDER_ACCESS_TOKEN_SECRET, PAYFAST_PASSPHRASE, or SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return secret;
}

function sign(orderId: string, expiresAt: number) {
  const secret = getOrderTokenSecret();
  return crypto.createHmac("sha256", secret).update(`${orderId}:${expiresAt}`).digest("hex");
}

export function createOrderAccessToken(orderId: string, ttlMs = ORDER_TOKEN_TTL_MS) {
  const expiresAt = Date.now() + ttlMs;
  const signature = sign(orderId, expiresAt);
  return `${expiresAt}.${signature}`;
}

export function verifyOrderAccessToken(orderId: string, token: string | null | undefined) {
  if (!token) {
    return false;
  }

  const [expiresAtRaw, signature] = token.split(".");
  const expiresAt = Number(expiresAtRaw);

  if (!expiresAtRaw || !signature || !Number.isFinite(expiresAt)) {
    return false;
  }

  if (Date.now() > expiresAt) {
    return false;
  }

  const expectedSignature = sign(orderId, expiresAt);

  const providedBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expectedSignature, "hex");

  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(providedBuffer, expectedBuffer);
}
