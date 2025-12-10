import React from "react";
import { useParams } from "react-router-dom";
import { useBeaconScan } from "../hooks/useBeaconScan";
import { BeaconScanShell } from "../components/BeaconScanShell";

export const SignedBeaconScanPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-lg">No signed beacon slug provided.</p>
      </div>
    );
  }

  const { data, error, loading } = useBeaconScan({ endpoint: `/x/${slug}` });

  return (
    <BeaconScanShell
      state={{ data, error, loading }}
      titlePrefix="HOTMESS • SIGNED"
    />
  );
};
