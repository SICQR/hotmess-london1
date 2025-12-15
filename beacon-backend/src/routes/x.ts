import type { Request, Response } from "express";
import crypto from "crypto";

import { SignedBeaconPayload } from "../types/signedBeacon";
import { getBeaconByCode } from "../services/beacons";
import { handleBeaconScan } from "../services/beaconScan";

const BEACON_SECRET = process.env.BEACON_SECRET || "dev-secret";

function base64UrlDecode(str: string): string {
  const pad = 4 - (str.length % 4 || 4);
  const normalized = str.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(pad);
  return Buffer.from(normalized, "base64").toString("utf8");
}

function computeSig(payloadB64: string): string {
  const hmac = crypto.createHmac("sha256", BEACON_SECRET);
  hmac.update(payloadB64);
  return hmac
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function xHandler(req: Request, res: Response): Promise<void> {
  try {
    const { slug } = req.params as { slug: string };
    if (!slug) {
      res.status(400).json({ error: "Missing signed beacon slug" });
      return;
    }

    const [payloadB64, sig] = slug.split(".");
    if (!payloadB64 || !sig) {
      res.status(400).json({ error: "Invalid signed beacon slug format" });
      return;
    }

    const expectedSig = computeSig(payloadB64);
    if (sig !== expectedSig) {
      res.status(403).json({ error: "Invalid signed beacon signature" });
      return;
    }

    let payload: SignedBeaconPayload;
    try {
      const json = base64UrlDecode(payloadB64);
      payload = JSON.parse(json) as SignedBeaconPayload;
    } catch (e) {
      res.status(400).json({ error: "Malformed signed beacon payload" });
      return;
    }

    if (!payload.code || !payload.nonce || !payload.exp) {
      res.status(400).json({ error: "Incomplete signed payload" });
      return;
    }

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      res.status(410).json({ error: "This signed code has expired" });
      return;
    }

    const beacon = await getBeaconByCode(payload.code);
    if (!beacon) {
      res.status(404).json({ error: "Beacon not found" });
      return;
    }

    if (beacon.status !== "active") {
      res.status(410).json({ error: "Beacon is not active", status: beacon.status });
      return;
    }

    (req as any).signedBeacon = payload;
    (req as any).scanSource = "signed";

    await handleBeaconScan(req, res, { beacon, signedPayload: payload });
  } catch (err) {
    console.error("[xHandler] error", err);
    res.status(500).json({ error: "Signed beacon scan error" });
  }
}
