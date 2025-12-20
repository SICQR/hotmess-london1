// components/records/WhatYouGet.tsx
// Simple value proposition comparison

"use client";

export function WhatYouGet({
  hasDigital,
  hasStudio,
  unlocked,
  onBuyDigital,
  onBuyStudio,
}: {
  hasDigital: boolean;
  hasStudio: boolean;
  unlocked: boolean;
  onBuyDigital: () => void;
  onBuyStudio: () => void;
}) {
  return (
    <section className="rounded-2xl border p-4 space-y-3">
      <div className="font-semibold">What you get</div>
      <div className="text-sm opacity-80">
        Preview is SoundCloud. HQ and files live here.
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {/* Digital */}
        <div className="rounded-2xl border p-4 space-y-2">
          <div className="font-semibold">Digital</div>
          <ul className="text-sm opacity-80 list-disc pl-5 space-y-1">
            <li>HQ audio</li>
            <li>Cover art</li>
            <li>Receipt + library unlock</li>
          </ul>
          <button
            className="rounded-2xl border px-4 py-2 w-full"
            onClick={onBuyDigital}
            disabled={!hasDigital}
          >
            {unlocked ? "Unlocked" : "Buy Digital • Get files now"}
          </button>
          {!hasDigital && (
            <div className="text-xs opacity-70">
              Not available for this release.
            </div>
          )}
        </div>

        {/* Studio Pack */}
        <div className="rounded-2xl border p-4 space-y-2">
          <div className="font-semibold">Studio Pack</div>
          <ul className="text-sm opacity-80 list-disc pl-5 space-y-1">
            <li>Stems / loops (zip)</li>
            <li>Alt edits (optional)</li>
            <li>Project notes (optional)</li>
          </ul>
          <button
            className="rounded-2xl border px-4 py-2 w-full"
            onClick={onBuyStudio}
            disabled={!hasStudio}
          >
            {unlocked ? "Unlocked" : "Get Studio Pack"}
          </button>
          {!hasStudio && (
            <div className="text-xs opacity-70">
              Not available for this release.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
