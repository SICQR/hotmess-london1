/**
 * BEACON SIGNATURE SYSTEM
 * For encrypted/signed QR codes (hook-ups, resale, one-time codes)
 */

import { createHmac } from 'node:crypto';

export interface SignedBeaconPayload {
  code: string; // Beacon.code (links back to beacons table)
  nonce: string; // random 16-32 bytes, base64url
  exp: number; // unix timestamp (seconds) expiry
  kind?: string; // optional: "person", "resale", "one_night_room"
}

/**
 * Base64url encoding (URL-safe)
 */
export function base64UrlEncode(input: string | Buffer): string {
  const base64 = Buffer.from(input).toString('base64');
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Base64url decoding
 */
export function base64UrlDecode(input: string): string {
  // Add padding back
  const padded = input + '==='.slice((input.length + 3) % 4);
  const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(base64, 'base64').toString('utf8');
}

/**
 * Generate HMAC signature for a payload
 */
export function signPayload(payload: string, secret: string): string {
  const hmac = createHmac('sha256', secret);
  hmac.update(payload);
  return base64UrlEncode(hmac.digest());
}

/**
 * Verify HMAC signature
 */
export function verifySignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSig = signPayload(payload, secret);
  return signature === expectedSig;
}

/**
 * Create a signed beacon payload
 */
export function createSignedPayload(
  data: SignedBeaconPayload,
  secret: string
): { payload: string; signature: string; url: string } {
  const jsonPayload = JSON.stringify(data);
  const encodedPayload = base64UrlEncode(jsonPayload);
  const signature = signPayload(encodedPayload, secret);

  return {
    payload: encodedPayload,
    signature,
    url: `${encodedPayload}.${signature}`,
  };
}

/**
 * Parse and verify a signed beacon payload
 */
export function parseSignedPayload(
  payloadAndSig: string,
  secret: string
): { valid: boolean; payload?: SignedBeaconPayload; error?: string } {
  try {
    const [encodedPayload, signature] = payloadAndSig.split('.');

    if (!encodedPayload || !signature) {
      return { valid: false, error: 'Invalid format' };
    }

    // Verify signature
    if (!verifySignature(encodedPayload, signature, secret)) {
      return { valid: false, error: 'Invalid signature' };
    }

    // Decode and parse JSON
    const jsonPayload = base64UrlDecode(encodedPayload);
    const payload = JSON.parse(jsonPayload) as SignedBeaconPayload;

    // Check expiry
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return { valid: false, error: 'Expired', payload };
    }

    return { valid: true, payload };
  } catch (err) {
    return {
      valid: false,
      error: err instanceof Error ? err.message : 'Parse error',
    };
  }
}

/**
 * Generate a random nonce (16 bytes)
 */
export function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return base64UrlEncode(Buffer.from(bytes));
}

/**
 * Create a one-time hook-up beacon link (expires in 6 hours)
 */
export function createHookupBeacon(
  beaconCode: string,
  secret: string
): { payload: string; signature: string; url: string; expiresAt: Date } {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 6 * 60 * 60; // 6 hours from now

  const data: SignedBeaconPayload = {
    code: beaconCode,
    nonce: generateNonce(),
    exp,
    kind: 'person',
  };

  const result = createSignedPayload(data, secret);

  return {
    ...result,
    expiresAt: new Date(exp * 1000),
  };
}

/**
 * Create a resale ticket beacon link (custom expiry)
 */
export function createResaleBeacon(
  beaconCode: string,
  expiryDate: Date,
  secret: string
): { payload: string; signature: string; url: string } {
  const exp = Math.floor(expiryDate.getTime() / 1000);

  const data: SignedBeaconPayload = {
    code: beaconCode,
    nonce: generateNonce(),
    exp,
    kind: 'resale',
  };

  return createSignedPayload(data, secret);
}
