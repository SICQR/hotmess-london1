export type BeaconUiKind =
  | "checkin"
  | "ticket_validated"
  | "ticket_view"
  | "ticket_invalid"
  | "product_view"
  | "product_purchase_success"
  | "person_owner"
  | "person_request_sent"
  | "room_joined"
  | "hnh_open"
  | "ticket_resale_view"
  | "ticket_resale_success"
  | "ticket_error"
  | "resale_error"
  | "resale_inactive"
  | "product_error"
  | "product_inactive"
  | "room_error"
  | "auth_required"
  | "payment_error"
  | "unsupported_beacon";

export type BeaconResponse = {
  ok: boolean;
  action: string;
  beacon: {
    id: string;
    code: string;
    type: string;
    subtype: string;
    label: string;
    status: string;
  };
  xp_awarded: number;
  ui: {
    kind: BeaconUiKind | string;
    [key: string]: any;
  } | null;
};
