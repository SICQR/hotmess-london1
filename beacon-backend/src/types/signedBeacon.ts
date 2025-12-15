export interface SignedBeaconPayload {
  code: string; // Beacon.code
  nonce: string;
  exp: number;  // unix timestamp (seconds)
  kind?: string;
}
