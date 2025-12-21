// MapControlsSheet.tsx
"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export type MapLayers = {
  pins: boolean;
  heat: boolean;
  trails: boolean;
  cities: boolean;
  myLayer: boolean;
};

const DEFAULT_LAYERS: MapLayers = {
  pins: true,
  heat: false,
  trails: false,
  cities: false,
  myLayer: false,
};

const STORAGE_KEY = "hotmess.map.layers.v1";

function loadLayers(): MapLayers {
  if (typeof window === "undefined") return DEFAULT_LAYERS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_LAYERS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_LAYERS, ...parsed };
  } catch {
    return DEFAULT_LAYERS;
  }
}

function saveLayers(layers: MapLayers) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(layers));
}

function Row(props: {
  label: string;
  desc: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="space-y-1">
        <div className="text-sm font-semibold">{props.label}</div>
        <div className="text-xs opacity-75">{props.desc}</div>
      </div>
      <Switch checked={props.checked} onCheckedChange={props.onCheckedChange} />
    </div>
  );
}

export function MapControlsSheet(props: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  layers: MapLayers;
  onChange: (next: MapLayers) => void;
}) {
  const set = (key: keyof MapLayers, val: boolean) => {
    const next = { ...props.layers, [key]: val };
    props.onChange(next);
    saveLayers(next);
  };

  return (
    <Sheet open={props.open} onOpenChange={props.onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader className="space-y-2">
          <SheetTitle className="text-lg">Map Controls</SheetTitle>
          <div className="text-xs opacity-75">
            Heat and Trails are privacy-safe: aggregated, delayed, never precise.
          </div>
        </SheetHeader>

        <div className="mt-2">
          <Row
            label="Pins"
            desc="Beacon locations and clusters."
            checked={props.layers.pins}
            onCheckedChange={(v) => set("pins", v)}
          />
          <Separator />
          <Row
            label="Heat"
            desc="Where scans are happening (delayed + blended)."
            checked={props.layers.heat}
            onCheckedChange={(v) => set("heat", v)}
          />
          <Separator />
          <Row
            label="Trails"
            desc="Movement signals (anonymous)."
            checked={props.layers.trails}
            onCheckedChange={(v) => set("trails", v)}
          />
          <Separator />
          <Row
            label="Cities"
            desc="Jump to city hubs."
            checked={props.layers.cities}
            onCheckedChange={(v) => set("cities", v)}
          />
          <Separator />
          <Row
            label="My Layer"
            desc="Your scans, saves, streaks."
            checked={props.layers.myLayer}
            onCheckedChange={(v) => set("myLayer", v)}
          />
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            variant="secondary"
            className="w-full rounded-2xl"
            onClick={() => {
              props.onChange(DEFAULT_LAYERS);
              saveLayers(DEFAULT_LAYERS);
            }}
          >
            Reset to default
          </Button>
          <Button className="w-full rounded-2xl" onClick={() => props.onOpenChange(false)}>
            Done
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Helper you can use in MapBeaconView to initialise layers:
export function usePersistedMapLayers() {
  const [layers, setLayers] = React.useState<MapLayers>(DEFAULT_LAYERS);
  React.useEffect(() => setLayers(loadLayers()), []);
  React.useEffect(() => saveLayers(layers), [layers]);
  return { layers, setLayers } as const;
}
