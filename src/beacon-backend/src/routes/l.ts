import type { Request, Response } from "express";
import { getBeaconByCode } from "../services/beacons";
import { handleBeaconScan } from "../services/beaconScan";

export async function lHandler(req: Request, res: Response): Promise<void> {
  try {
    const { code } = req.params as { code: string };

    if (!code) {
      res.status(400).json({ error: "Missing beacon code" });
      return;
    }

    const beacon = await getBeaconByCode(code);
    if (!beacon) {
      res.status(404).json({ error: "Beacon not found" });
      return;
    }

    if (beacon.status !== "active") {
      res.status(410).json({ error: "Beacon is not active", status: beacon.status });
      return;
    }

    (req as any).scanSource = "qr";

    await handleBeaconScan(req, res, { beacon, signedPayload: null });
  } catch (err) {
    console.error("[lHandler] error", err);
    res.status(500).json({ error: "Beacon scan error" });
  }
}
