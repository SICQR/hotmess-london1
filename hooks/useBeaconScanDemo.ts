/**
 * useBeaconScanDemo - Demo hook for Beacon OS testing
 * Connects to local demo backend on localhost:3001
 * Simpler version for testing the new reusable pattern
 */

import { useState, useEffect, useCallback } from 'react';

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

type UseBeaconScanDemoArgs = {
  endpoint: string; // e.g. `/l/DEMO_CHECKIN` or `/x/<payload>.<sig>`
  queryParams?: Record<string, string>; // Additional query params like lat, lng, mode
};

export function useBeaconScanDemo({ endpoint, queryParams }: UseBeaconScanDemoArgs) {
  const [data, setData] = useState<BeaconResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchScan = useCallback(() => {
    if (!endpoint) return;
    setLoading(true);
    setError(null);

    // Build query string if params provided
    let url = endpoint;
    if (queryParams && Object.keys(queryParams).length > 0) {
      const params = new URLSearchParams(queryParams);
      url += `?${params.toString()}`;
    }

    fetch(url)
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || `Error ${res.status}`);
        }
        return res.json();
      })
      .then((json: BeaconResponse) => {
        setData(json);
      })
      .catch((err: any) => {
        console.error("[useBeaconScanDemo] error", err);
        setError(err.message || "Something went wrong.");
      })
      .finally(() => setLoading(false));
  }, [endpoint, queryParams]);

  useEffect(() => {
    fetchScan();
  }, [fetchScan]);

  return {
    data,
    error,
    loading,
    refetch: fetchScan
  };
}
