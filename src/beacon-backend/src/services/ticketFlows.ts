import type { Request } from "express";
import type { Beacon } from "../types/beacon";
import type { SignedBeaconPayload } from "../types/signedBeacon";
import type { GeoInfo } from "./scanEvents";
import { mockTicket } from "../mockData";

async function getTicketById(ticketId: string) {
  console.log("[Ticket] get", ticketId);
  return ticketId === mockTicket.id ? mockTicket : null;
}

async function updateTicket(ticketId: string, patch: any) {
  console.log("[Ticket] update", ticketId, patch);
  if (ticketId === mockTicket.id) {
    Object.assign(mockTicket, patch);
  }
}

export async function handleTicketScan({
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
    return { ui: { kind: "ticket_error", message: "Ticket not bound to this beacon." } };
  }

  const ticket = await getTicketById(ticket_id);
  if (!ticket) {
    return { ui: { kind: "ticket_error", message: "Ticket not found." } };
  }

  const mode = (req.query.mode as string) || "view";

  if (mode === "validate") {
    if (ticket.status !== "valid") {
      return {
        actionOverride: "ticket_validate",
        ui: {
          kind: "ticket_invalid",
          status: ticket.status,
          message: "Ticket is not valid for entry."
        }
      };
    }

    await updateTicket(ticket.id, {
      status: "scanned",
      history: [...ticket.history, { action: "scanned", at: new Date().toISOString() }]
    });

    const xp = beacon.xp_base || 10;

    return {
      actionOverride: "ticket_validate",
      xp,
      ui: {
        kind: "ticket_validated",
        ticket_id: ticket.id,
        event_id,
        message: "Entry valid."
      }
    };
  }

  return {
    actionOverride: "ticket_view",
    xp: 0,
    ui: {
      kind: "ticket_view",
      ticket_id: ticket.id,
      event_id,
      owner_id: ticket.owner_id,
      status: ticket.status
    }
  };
}
