/**
 * HOTMESS LONDON - Branded QR Code Generator
 * Generates 1024x1024 print-ready PNG with beacon shortlinks
 * 
 * Compliance:
 * - Encodes only /l/:code (no tracking, no PII)
 * - 18+ + consent microcopy on artwork
 * - Error correction H (30% tolerance for logos/wear)
 * - Generous quiet zone for print safety
 */

import QRCode from "qrcode";

type BeaconLike = {
  code?: string | null;
  short_code?: string | null;
  slug?: string | null;
  type?: string | null;
  title?: string | null;
};

function pickCode(b: BeaconLike) {
  return b.code || b.short_code || b.slug || "";
}

function safeFilename(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9-_]+/g, "_").replace(/_+/g, "_").slice(0, 80);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return await new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob_failed"))), "image/png");
  });
}

/**
 * Generates a branded 1024x1024 QR PNG for a beacon shortlink: `${origin}/l/${code}`
 * - High contrast, EC Level H, generous quiet zone, print-friendly.
 * 
 * @param beacon - Beacon object with code/slug and optional type/title
 * @param opts - Optional origin override (defaults to window.location.origin)
 */
export async function downloadBrandedBeaconQR(beacon: BeaconLike, opts?: { origin?: string }) {
  const code = pickCode(beacon);
  if (!code) throw new Error("beacon_code_missing");

  const origin = opts?.origin || window.location.origin;
  const url = `${origin}/l/${encodeURIComponent(code)}`;

  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no_canvas_ctx");

  // --- STYLE (HOTMESS brutal clean) ---
  const bg = "#ffffff";
  const ink = "#0a0a0a";
  const border = "rgba(0,0,0,0.12)";
  const subtle = "rgba(0,0,0,0.6)";

  // Background
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);

  // Border frame
  const framePad = 42;
  ctx.strokeStyle = border;
  ctx.lineWidth = 6;
  ctx.strokeRect(framePad, framePad, size - framePad * 2, size - framePad * 2);

  // Header strip
  const headerH = 120;
  ctx.fillStyle = "rgba(0,0,0,0.03)";
  ctx.fillRect(framePad, framePad, size - framePad * 2, headerH);

  // Footer strip
  const footerH = 140;
  ctx.fillStyle = "rgba(0,0,0,0.03)";
  ctx.fillRect(framePad, size - framePad - footerH, size - framePad * 2, footerH);

  // Text: header
  ctx.fillStyle = ink;
  ctx.font = "700 44px system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.textBaseline = "middle";
  ctx.fillText("HOTMESS LONDON", framePad + 28, framePad + headerH / 2);

  // Text: small meta right
  const typeLabel = (beacon.type || "BEACON").toUpperCase();
  ctx.fillStyle = subtle;
  ctx.font = "600 18px system-ui, -apple-system, Segoe UI, Roboto, Arial";
  const meta = `${typeLabel} • /l/${code}`;
  const metaW = ctx.measureText(meta).width;
  ctx.fillText(meta, size - framePad - 28 - metaW, framePad + headerH / 2);

  // --- QR generation onto an offscreen canvas ---
  const qrSize = 720;           // big + scan-friendly
  const qrTop = framePad + headerH + 24;
  const qrLeft = (size - qrSize) / 2;

  const qrCanvas = document.createElement("canvas");
  qrCanvas.width = qrSize;
  qrCanvas.height = qrSize;

  await QRCode.toCanvas(qrCanvas, url, {
    errorCorrectionLevel: "H",
    margin: 2, // quiet zone inside qr canvas
    width: qrSize,
    color: { dark: ink, light: bg },
  });

  // "Quiet zone" around the QR on main canvas (extra safety for printing)
  const quietPad = 18;
  ctx.fillStyle = bg;
  ctx.fillRect(qrLeft - quietPad, qrTop - quietPad, qrSize + quietPad * 2, qrSize + quietPad * 2);

  // Draw QR
  ctx.drawImage(qrCanvas, qrLeft, qrTop);

  // Footer copy
  const footerY = size - framePad - footerH;
  ctx.fillStyle = ink;
  ctx.font = "700 28px system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.textBaseline = "top";
  ctx.fillText("Scan to open beacon", framePad + 28, footerY + 34);

  ctx.fillStyle = subtle;
  ctx.font = "600 18px system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillText("18+ only • Consent-first", framePad + 28, footerY + 78);

  // Optional: tiny URL for fallback
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.font = "500 14px system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillText(url, framePad + 28, footerY + 110);

  // Generate blob and download
  const blob = await canvasToBlob(canvas);
  const filename = `hotmess-beacon_${safeFilename(typeLabel)}_${safeFilename(code)}.png`;
  downloadBlob(blob, filename);
}
