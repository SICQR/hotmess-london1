import React from "react";
import type { BeaconResponse } from "../types/beacon";

type UseBeaconScanArgs = {
  endpoint: string; // e.g. `/l/DEMO_CHECKIN` or `/x/<payload>.<sig>`
};

export function useBeaconScan({ endpoint }: UseBeaconScanArgs) {
  const [data, setData] = React.useState<BeaconResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  const fetchScan = React.useCallback(() => {
    if (!endpoint) return;
    setLoading(true);
    setError(null);

    fetch(endpoint)
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
        console.error("[useBeaconScan] error", err);
        setError(err.message || "Something went wrong.");
      })
      .finally(() => setLoading(false));
  }, [endpoint]);

  React.useEffect(() => {
    fetchScan();
  }, [fetchScan]);

  return {
    data,
    error,
    loading,
    refetch: fetchScan
  };
}
