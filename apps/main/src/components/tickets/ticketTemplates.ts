// components/tickets/ticketTemplates.ts
// Template messages for ticket threads
// Standardized proof requests + safety boundaries + clean close-outs

export type TicketTemplate = {
  id: string;
  label: string;
  message: string;
  tone?: "proof" | "safety" | "details" | "close";
};

export const TICKET_TEMPLATES: TicketTemplate[] = [
  // Proof requests (must-have)
  {
    id: "proof_basic",
    tone: "proof",
    label: "Ask for proof",
    message:
      "Send proof please: screenshot + ticket PDF + order email header (no full name).",
  },
  {
    id: "proof_screenrecord",
    tone: "proof",
    label: "Screen-record",
    message:
      "Can you screen-record opening the ticket in-app with today's date visible?",
  },
  {
    id: "proof_terms",
    tone: "proof",
    label: "Entry terms",
    message:
      "Show entry terms (time window, ticket type) + any restrictions.",
  },

  // Details check
  {
    id: "details_confirm",
    tone: "details",
    label: "Confirm details",
    message:
      "Confirm: qty, price, entry time, and whether it's transferable.",
  },
  {
    id: "details_event",
    tone: "details",
    label: "Event/venue/date",
    message:
      "What's the exact event/venue/date and ticket name as shown in-app?",
  },

  // Safety boundaries
  {
    id: "safety_in_thread",
    tone: "safety",
    label: "Keep it here",
    message:
      "Keep it in this thread. No off-platform payment, no weird links.",
  },
  {
    id: "safety_refusal",
    tone: "safety",
    label: "Proof or I'm out",
    message:
      "If you won't show proof, I'm out. No drama.",
  },

  // Clean close-outs
  {
    id: "close_ready",
    tone: "close",
    label: "Ready to proceed",
    message:
      "All good. I'm ready to proceed once proof checks out.",
  },
  {
    id: "close_pass",
    tone: "close",
    label: "Pass",
    message:
      "I'm passing. Thanks.",
  },
];
