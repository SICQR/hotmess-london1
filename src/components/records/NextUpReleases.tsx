// components/records/NextUpReleases.tsx
// Show next 3 releases + ecosystem links



import * as React from "react";


export function NextUpReleases({ releaseId }: { releaseId: string }) {
  const [items, setItems] = React.useState<any[]>([]);

  React.useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          `/api/records/next-up?releaseId=${encodeURIComponent(releaseId)}`
        );
        const json = await response.json();
        setItems(json.ok ? json.items : []);
      } catch (err) {
        console.error("Failed to fetch next-up:", err);
      }
    })();
  }, [releaseId]);

  if (!items.length) return null;

  return (
    <section className="rounded-2xl border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Next up</div>
        <a className="text-sm underline" href="/records/releases">
          Browse all
        </a>
      </div>

      <div className="grid md:grid-cols-3 gap-2">
        {items.map((item) => (
          <a
            key={item.id}
            href={`/records/releases/${item.slug}`}
            className="rounded-2xl border p-3 hover:bg-black/5 transition-colors"
          >
            <div className="text-xs opacity-70">{item.artist_name}</div>
            <div className="font-semibold">{item.title}</div>
            <div className="text-xs opacity-70 mt-1">
              {new Date(item.release_date).toLocaleDateString("en-GB")}
            </div>
          </a>
        ))}
      </div>

      {/* Ecosystem crossover links */}
      <div className="flex flex-wrap gap-2 pt-1">
        <a
          className="rounded-2xl border px-4 py-2 text-sm"
          href="/radio"
        >
          Go Radio
        </a>
        <a
          className="rounded-2xl border px-4 py-2 text-sm"
          href="/care"
        >
          Care
        </a>
        <a
          className="rounded-2xl border px-4 py-2 text-sm"
          href="/shop"
        >
          Shop
        </a>
        <a
          className="rounded-2xl border px-4 py-2 text-sm"
          href="/affiliate"
        >
          Affiliate
        </a>
      </div>
    </section>
  );
}
