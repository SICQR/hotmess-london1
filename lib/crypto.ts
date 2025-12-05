/**
 * Cryptographic utilities for HOTMESS LONDON
 * Used for secure token hashing and generation
 */

/**
 * Generate a secure random token
 * @param bytes - Number of random bytes to generate (default: 32)
 * @returns Hex-encoded random string
 */
export function randomToken(bytes: number = 32): string {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * SHA-256 hash a string
 * @param input - String to hash
 * @returns Hex-encoded hash
 */
export async function sha256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate a time-based one-time token
 * @param expiryMs - Time until expiry in milliseconds (default: 90000 = 90 seconds)
 * @returns Object with token and expiry timestamp
 */
export function generateOTP(expiryMs: number = 90_000) {
  const token = randomToken(32);
  const expiresAt = new Date(Date.now() + expiryMs);
  return { token, expiresAt };
}

/**
 * Check if a timestamp has expired
 * @param timestamp - ISO timestamp string or Date object
 * @returns true if expired, false otherwise
 */
export function isExpired(timestamp: string | Date): boolean {
  const expiry = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  return expiry.getTime() < Date.now();
}
