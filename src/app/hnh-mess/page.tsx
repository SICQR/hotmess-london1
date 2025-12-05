// app/hnh-mess/page.tsx
// Hand N Hand MESS resources

export const metadata = {
  title: "Hand N Hand | HOTMESS",
  description: "Care resources for the community",
};

export default function HnHMessPage() {
  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="space-y-2">
        <div className="text-sm opacity-80">Hand N Hand</div>
        <h1 className="text-4xl uppercase tracking-tight" style={{ fontWeight: 900 }}>
          CARE RESOURCES
        </h1>
        <div className="text-sm opacity-80">MESS edition. We got you.</div>
      </header>

      <div className="rounded-3xl border border-green-500/30 bg-green-500/5 p-6 space-y-2">
        <div className="font-bold text-green-400">💚 HAND N HAND</div>
        <div className="text-sm opacity-90">
          Extended care resources tailored for nightlife & party contexts.
        </div>
      </div>

      <div className="rounded-3xl border p-12 text-center space-y-4">
        <div className="text-6xl">🫱🏽‍🫲🏼</div>
        <div className="text-xl font-bold">HnH MESS launching soon</div>
        <div className="text-sm opacity-80 max-w-md mx-auto">
          Party-specific care resources. Look out for each other.
        </div>
      </div>
    </main>
  );
}
