// app/shop/page.tsx
// Shop page - Brutalist × Luxury

import { spacing, typography } from "@/lib/design-system";
import { PageHeader } from "@/components/layouts/PageHeader";
import { BrutalistCard } from "@/components/layouts/BrutalistCard";
import { ShoppingBag } from "lucide-react";

export const metadata = {
  title: "Shop | HOTMESS",
  description: "Merch & gear",
};

export default function ShopPage() {
  return (
    <main className={spacing.pageContainer + " " + spacing.sectionVertical}>
      <PageHeader
        label="SHOP"
        title="MERCH & GEAR"
        subtitle="Coming soon. Raw & brutal. Drops that hit different."
      />

      <BrutalistCard variant="section">
        <div className="text-center space-y-6 py-12">
          <ShoppingBag className="h-20 w-20 mx-auto text-hot" />
          <div className="space-y-3">
            <div className={typography.h2}>
              Shop launching soon
            </div>
            <p className="text-sm md:text-base opacity-70 max-w-md mx-auto leading-relaxed">
              Merch, gear, and exclusive drops. Keep your eyes on this space.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <a
              href="/records"
              className="rounded-xl border border-hot/50 bg-hot/10 backdrop-blur-sm px-6 py-3 font-bold uppercase tracking-wide text-hot hover:bg-hot hover:text-black transition-all text-sm"
            >
              Browse Records
            </a>
            <a
              href="/messmarket"
              className="rounded-xl border border-white/20 bg-black/30 backdrop-blur-sm px-6 py-3 font-bold uppercase tracking-wide hover:bg-white/10 hover:border-white/30 transition-all text-sm"
            >
              Check Marketplace
            </a>
          </div>
        </div>
      </BrutalistCard>

      {/* Microcopy */}
      <div className={typography.microcopy + " text-center"}>
        Brutal merch for London's queer nightlife
      </div>
    </main>
  );
}