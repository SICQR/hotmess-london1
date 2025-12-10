import React from "react";
import type { BeaconResponse } from "../types/beacon";
import { BeaconUiRenderer } from "./BeaconUiRenderer";

type Props = {
  state: {
    data: BeaconResponse | null;
    error: string | null;
    loading: boolean;
  };
  titlePrefix?: string;
};

export const BeaconScanShell: React.FC<Props> = ({ state, titlePrefix }) => {
  const { data, error, loading } = state;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-pulse text-center">
          <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 mb-2">
            {titlePrefix || "HOTMESS BEACON"}
          </p>
          <p className="text-xl font-semibold">Tuning signal…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
        <div className="max-w-md text-center">
          <p className="text-[10px] uppercase tracking-[0.25em] text-red-400 mb-2">
            SCAN ERROR
          </p>
          <p className="text-lg font-semibold mb-2">
            This beacon is sulking.
          </p>
          <p className="text-sm text-neutral-400 mb-4">{error}</p>
          <p className="text-[11px] text-neutral-500">
            If this were live, you'd see options to retry, contact support, or open Care.
          </p>
        </div>
      </div>
    );
  }

  const { beacon, ui, xp_awarded, action } = data;

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md border border-neutral-800 rounded-2xl p-5 bg-neutral-950/80 backdrop-blur">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-500 mb-1">
              {titlePrefix || "HOTMESS BEACON"}
            </p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-600">
              {beacon.type.toUpperCase()} / {beacon.subtype.toUpperCase()}
            </p>
          </div>
          {xp_awarded > 0 && (
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.2em] text-lime-400">
                +{xp_awarded} XP
              </p>
              <p className="text-[10px] text-neutral-500">Action: {action}</p>
            </div>
          )}
        </div>

        <h1 className="text-2xl font-semibold mb-1">{beacon.label}</h1>

        <BeaconUiRenderer ui={ui} />
      </div>
    </div>
  );
};
