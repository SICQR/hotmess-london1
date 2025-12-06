// app/trending/page.tsx
// Trending content

export const metadata = {
  title: "Trending | HOTMESS",
  description: "What's hot right now",
};

export default function TrendingPage() {
  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="space-y-2">
        <div className="text-sm opacity-80">Trending</div>
        <h1 className="text-4xl uppercase tracking-tight" style={{ fontWeight: 900 }}>
          WHAT'S HOT
        </h1>
        <div className="text-sm opacity-80">Top beacons, events, and community activity.</div>
      </header>

      <div className="rounded-3xl border border-hot/30 bg-hot/5 p-6 space-y-2">
        <div className="font-bold text-hot flex items-center gap-2">
          <div className="w-2 h-2 bg-hot rounded-full animate-pulse" />
          LIVE TRENDING
        </div>
        <div className="text-sm opacity-90">
          Real-time data showing what's popping off right now.
        </div>
      </div>

      <div className="rounded-3xl border p-12 text-center space-y-4">
        <div className="text-6xl">📈</div>
        <div className="text-xl font-bold">Trending feed launching soon</div>
        <div className="text-sm opacity-80 max-w-md mx-auto">
          See what's hot across beacons, events, and community content.
        </div>
      </div>
    </main>
  );
}
