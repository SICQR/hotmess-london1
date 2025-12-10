import type { Request } from "express";
import type { Beacon } from "../types/beacon";
import type { SignedBeaconPayload } from "../types/signedBeacon";
import type { GeoInfo } from "./scanEvents";
import { mockResale } from "../mockData";

async function getTicketResaleByTicketId(ticketId: string) {
  console.log("[Resale] get by ticket", ticketId);
  return ticketId === mockResale.ticket_id ? mockResale : null;
}

async function completeResale({
  resaleId,
  ticketId,
  buyerId
}: {
  resaleId: string;
  ticketId: string;
  buyerId: string;
}) {
  console.log("[Resale] complete", { resaleId, ticketId, buyerId });
}

export async function handleTicketResaleScan({
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
  const { ticket_id, event_id } = beacon.payload || {};
  if (!ticket_id) {
    return { ui: { kind: "resale_error", message: "Resale not bound to ticket." } };
  }

  const resale = await getTicketResaleByTicketId(ticket_id);
  if (!resale || resale.status !== "active") {
    return {
      ui: { kind: "resale_inactive", message: "This resale offer is not active (demo)." }
    };
  }

  if (req.method === "GET") {
    return {
      actionOverride: "ticket_resale_view",
      xp: 0,
      ui: {
        kind: "ticket_resale_view",
        resale_id: resale.id,
        ticket_id,
        event_id,
        seller_id: resale.seller_id,
        price_cents: resale.price_cents,
        signed_exp: signedPayload?.exp || null
      }
    };
  }

  if (!user) {
    return {
      ui: { kind: "auth_required", message: "Login required to buy resale ticket." }
    };
  }

  const { payment_intent_id } = req.body || {};
  if (!payment_intent_id) {
    return {
      ui: { kind: "payment_error", message: "Missing payment intent." }
    };
  }

  await completeResale({
    resaleId: resale.id,
    ticketId: ticket_id,
    buyerId: user.id
  });

  const xp = beacon.xp_base || 5;

  return {
    actionOverride: "ticket_resale_purchase",
    xp,
    ui: {
      kind: "ticket_resale_success",
      ticket_id,
      resale_id: resale.id,
      new_owner_id: user.id,
      message: "Ticket transferred (demo)."
    }
  };
}
