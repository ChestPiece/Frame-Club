import crypto from 'crypto';

type PayFastConfig = {
  merchantId: string;
  merchantKey: string;
  passphrase: string;
  sandbox: boolean;
};

export const payfastConfig: PayFastConfig = {
  merchantId: process.env.PAYFAST_MERCHANT_ID || '',
  merchantKey: process.env.PAYFAST_MERCHANT_KEY || '',
  passphrase: process.env.PAYFAST_PASSPHRASE || '',
  sandbox: process.env.PAYFAST_SANDBOX === 'true' || false,
};

export function getPayFastUrl(): string {
  return payfastConfig.sandbox
    ? 'https://sandbox.payfast.co.za/eng/process'
    : 'https://www.payfast.co.za/eng/process';
}

export function generatePayFastSignature(data: Record<string, string>): string {
  // Sort the payload alphabetically by key
  const orderedData = Object.keys(data)
    .filter((key) => data[key] !== '' && key !== 'signature')
    .sort()
    .reduce((obj: Record<string, string>, key: string) => {
      obj[key] = data[key];
      return obj;
    }, {});

  // Form the query string
  let queryParams = new URLSearchParams(orderedData).toString();

  // Append the passphrase if it exists
  if (payfastConfig.passphrase) {
    queryParams += `&passphrase=${encodeURIComponent(payfastConfig.passphrase)}`;
  }

  // Create the md5 hash
  return crypto.createHash('md5').update(queryParams).digest('hex');
}

export function verifyPayFastSignature(data: Record<string, string>): boolean {
  const providedSignature = data.signature;
  if (!providedSignature) return false;

  const generatedSignature = generatePayFastSignature(data);
  return generatedSignature === providedSignature;
}