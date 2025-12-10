import React from "react";
import type { BeaconUiKind } from "../types/beacon";

type Props = {
  ui: {
    kind: BeaconUiKind | string;
    [key: string]: any;
  } | null;
};

export const BeaconUiRenderer: React.FC<Props> = ({ ui }) => {
  if (!ui) return null;

  switch (ui.kind) {
    case "checkin":
      return (
        <div>
          <p className="text-sm mb-3">{ui.message}</p>
          <p className="text-[11px] text-neutral-500">
            You're checked into this space. On live, your heat joins the map and your
            XP tracks the night.
          </p>
        </div>
      );

    case "ticket_validated":
      return (
        <div>
          <p className="text-sm mb-2 font-medium text-lime-400">
            Ticket accepted.
          </p>
          <p className="text-sm mb-3">{ui.message}</p>
          <p className="text-[11px] text-neutral-500">
            Door mode. In production this is pinned to staff devices with audit logs.
          </p>
        </div>
      );

    case "ticket_view":
      return (
        <div>
          <p className="text-sm mb-2">
            Ticket ID:{" "}
            <span className="font-mono text-xs bg-neutral-900 px-1 py-0.5 rounded">
              {ui.ticket_id}
            </span>
          </p>
          <p className="text-sm mb-3">
            Status: <span className="font-semibold uppercase">{ui.status}</span>
          </p>
          <p className="text-[11px] text-neutral-500">
            On live, this becomes a scannable wallet card with event info and door
            instructions.
          </p>
        </div>
      );

    case "ticket_invalid":
      return (
        <div>
          <p className="text-sm mb-2 font-medium text-red-400">
            Ticket invalid.
          </p>
          <p className="text-sm mb-3">
            Status: <span className="font-semibold uppercase">{ui.status}</span>
          </p>
          <p className="text-sm mb-3">{ui.message}</p>
          <p className="text-[11px] text-neutral-500">
            This ticket has already been used or has been voided.
          </p>
        </div>
      );

    case "product_view":
      return (
        <div>
          <p className="text-sm font-medium mb-1">{ui.listing.title}</p>
          <p className="text-sm text-neutral-300 mb-2">
            {ui.listing.description}
          </p>
          <p className="text-sm mb-4">
            {(ui.listing.price_cents / 100).toFixed(2)} {ui.listing.currency}
          </p>
          <button className="w-full text-sm font-medium bg-neutral-50 text-black py-2 rounded-full hover:bg-white transition">
            Buy (demo)
          </button>
          <p className="mt-2 text-[11px] text-neutral-500">
            Here we'll wire into Shopify/Stripe, vendor fulfilment and XP / affiliate.
          </p>
        </div>
      );

    case "product_purchase_success":
      return (
        <div>
          <p className="text-sm mb-2 font-medium text-lime-400">
            Order placed.
          </p>
          <p className="text-sm mb-3">{ui.message}</p>
          <p className="text-[11px] text-neutral-500">
            Confirmation email + vendor dashboard update fire from here.
          </p>
        </div>
      );

    case "product_error":
    case "product_inactive":
      return (
        <div>
          <p className="text-sm mb-2 font-medium text-red-400">
            Product unavailable.
          </p>
          <p className="text-sm mb-3">{ui.message}</p>
          <p className="text-[11px] text-neutral-500">
            This drop may have sold out or been removed.
          </p>
        </div>
      );

    case "person_owner":
      return (
        <div>
          <p className="text-sm mb-3">{ui.message}</p>
          <p className="text-[11px] text-neutral-500">
            The real view lets you mint one-night QRs, revoke codes, and route connections
            into safe rooms.
          </p>
        </div>
      );

    case "person_request_sent":
      return (
        <div>
          <p className="text-sm mb-2 font-medium">
            Request sent.
          </p>
          <p className="text-sm mb-3">{ui.message}</p>
          <p className="text-[11px] text-neutral-500">
            The other side gets a quiet nudge to accept, decline, or route into Care if
            needed.
          </p>
        </div>
      );

    case "room_joined":
      return (
        <div>
          <p className="text-sm mb-2 font-medium">
            Room joined.
          </p>
          <p className="text-sm mb-3">{ui.message}</p>
          {ui.geo_room && (
            <p className="text-[11px] text-neutral-600 mb-2">
              GPS-based room • {ui.insideVenue ? "Inside venue" : "Outside venue"}
            </p>
          )}
          <p className="text-[11px] text-neutral-500">
            On live, this redirects into chat (web or Telegram) with safety tools in
            the footer.
          </p>
        </div>
      );

    case "room_error":
      return (
        <div>
          <p className="text-sm mb-2 font-medium text-red-400">
            Room unavailable.
          </p>
          <p className="text-sm mb-3">{ui.message}</p>
          <p className="text-[11px] text-neutral-500">
            This room may have closed or requires special access.
          </p>
        </div>
      );

    case "hnh_open":
      return (
        <div>
          <p className="text-sm mb-2 font-medium">Hand N Hand</p>
          <p className="text-sm mb-3">{ui.message}</p>
          <p className="text-[11px] text-neutral-500">
            Care dressed as kink. Community support, not medical advice. Here we surface
            grounding tools, safer use info, and Sunday show links.
          </p>
        </div>
      );

    case "ticket_resale_view":
      return (
        <div>
          <p className="text-sm mb-2 font-medium">
            Resale ticket available.
          </p>
          <p className="text-sm mb-1">
            Price: {(ui.price_cents / 100).toFixed(2)} GBP
          </p>
          {ui.signed_exp && (
            <p className="text-[11px] text-neutral-600 mb-2">
              Expires: {new Date(ui.signed_exp * 1000).toLocaleString()}
            </p>
          )}
          <button className="w-full text-sm font-medium bg-neutral-50 text-black py-2 rounded-full hover:bg-white transition mt-3">
            Purchase (demo)
          </button>
          <p className="mt-2 text-[11px] text-neutral-500">
            On live, the call-to-action here routes into secure payment and ownership
            transfer.
          </p>
        </div>
      );

    case "ticket_resale_success":
      return (
        <div>
          <p className="text-sm mb-2 font-medium text-lime-400">
            Ticket transferred.
          </p>
          <p className="text-sm mb-3">{ui.message}</p>
          <p className="text-[11px] text-neutral-500">
            The new holder sees the pass; the seller sees their payout and XP bump.
          </p>
        </div>
      );

    case "resale_error":
    case "resale_inactive":
      return (
        <div>
          <p className="text-sm mb-2 font-medium text-red-400">
            Resale unavailable.
          </p>
          <p className="text-sm mb-3">{ui.message}</p>
          <p className="text-[11px] text-neutral-500">
            This resale offer may have sold or been cancelled.
          </p>
        </div>
      );

    case "auth_required":
      return (
        <div>
          <p className="text-sm mb-2 font-medium">
            Login required.
          </p>
          <p className="text-sm mb-3">{ui.message}</p>
          <button className="w-full text-sm font-medium bg-neutral-50 text-black py-2 rounded-full hover:bg-white transition">
            Sign In
          </button>
          <p className="mt-2 text-[11px] text-neutral-500">
            This action requires authentication to continue.
          </p>
        </div>
      );

    case "payment_error":
      return (
        <div>
          <p className="text-sm mb-2 font-medium text-red-400">
            Payment error.
          </p>
          <p className="text-sm mb-3">{ui.message}</p>
          <p className="text-[11px] text-neutral-500">
            Please check your payment details and try again.
          </p>
        </div>
      );

    case "ticket_error":
      return (
        <div>
          <p className="text-sm mb-2 font-medium text-red-400">
            Ticket error.
          </p>
          <p className="text-sm mb-3">{ui.message}</p>
          <p className="text-[11px] text-neutral-500">
            There was an issue loading this ticket.
          </p>
        </div>
      );

    case "unsupported_beacon":
    default:
      return (
        <div>
          <p className="text-sm mb-2">
            Beacon UI kind:{" "}
            <span className="font-mono text-xs bg-neutral-900 px-1 py-0.5 rounded">
              {ui.kind}
            </span>
          </p>
          <pre className="text-[10px] bg-neutral-900/80 rounded p-2 overflow-x-auto">
            {JSON.stringify(ui, null, 2)}
          </pre>
          <p className="mt-2 text-[11px] text-neutral-500">
            This beacon type hasn't been styled yet. The raw data is shown above.
          </p>
        </div>
      );
  }
};
