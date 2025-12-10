import type { Request } from "express";
import type { Beacon } from "../types/beacon";
import type { SignedBeaconPayload } from "../types/signedBeacon";
import type { GeoInfo } from "./scanEvents";
import { mockListing } from "../mockData";

async function getListing(listingId: string) {
  console.log("[Listing] get", listingId);
  return listingId === mockListing.id ? mockListing : null;
}

async function createOrder({
  userId,
  listingId,
  vendorId,
  priceCents
}: {
  userId: string;
  listingId: string;
  vendorId: string;
  priceCents: number;
}) {
  console.log("[Order] create", { userId, listingId, vendorId, priceCents });
  return { id: "ord_demo" };
}

export async function handleProductOrDropScan({
  req,
  beacon,
  user,
  geo,
  signedPayload
}: {
  req: Request;
  beacon: Beacon;
  user: any;
  geo: GeoInfo;
  signedPayload?: SignedBeaconPayload | null;
}): Promise<{ ui: any; xp?: number; actionOverride?: string }> {
  const { listing_id, vendor_id } = beacon.payload || {};
  if (!listing_id) {
    return { ui: { kind: "product_error", message: "Product not bound to beacon." } };
  }

  const listing = await getListing(listing_id);
  if (!listing || !listing.is_active) {
    return {
      ui: { kind: "product_inactive", message: "This drop is no longer available." }
    };
  }

  if (req.method === "GET") {
    return {
      actionOverride: beacon.subtype === "drop" ? "drop_view" : "product_view",
      xp: 0,
      ui: {
        kind: "product_view",
        subtype: beacon.subtype,
        listing,
        vendor_id: vendor_id || listing.vendor_id
      }
    };
  }

  if (!user) {
    return {
      ui: { kind: "auth_required", message: "Login required to purchase." }
    };
  }

  const { payment_intent_id } = req.body || {};
  if (!payment_intent_id) {
    return {
      ui: { kind: "payment_error", message: "Missing payment intent." }
    };
  }

  const order = await createOrder({
    userId: user.id,
    listingId: listing.id,
    vendorId: listing.vendor_id,
    priceCents: listing.price_cents
  });

  const xp = beacon.xp_base || 5;

  return {
    actionOverride: beacon.subtype === "drop" ? "drop_purchase" : "product_purchase",
    xp,
    ui: {
      kind: "product_purchase_success",
      order_id: order.id,
      listing_id: listing.id,
      message: "Order placed (demo)."
    }
  };
}
