import React from "react";
import { useParams } from "react-router-dom";
import { useBeaconScan } from "../hooks/useBeaconScan";
import { BeaconScanShell } from "../components/BeaconScanShell";

export const BeaconScanPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();

  if (!code) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-lg">No beacon code provided.</p>
      </div>
    );
  }

  const { data, error, loading } = useBeaconScan({ endpoint: `/l/${code}` });

  return (
    <BeaconScanShell
      state={{ data, error, loading }}
      titlePrefix="HOTMESS BEACON"
    />
  );
};
