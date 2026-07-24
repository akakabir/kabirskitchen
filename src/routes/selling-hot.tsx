import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Flame } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyCartBar } from "@/components/StickyCartBar";
import { DishCard } from "@/components/DishCard";
import { Reveal } from "@/components/Reveal";
import { ALL_ITEMS } from "@/lib/data";

export const Route = createFileRoute("/selling-hot")({
  head: () => ({
    meta: [
      { title: "🔥 Selling Hot — Kabir's Kitchen" },
      { name: "description", content: "The hottest, most-ordered dishes right now, ranked." },
      { property: "og:title", content: "🔥 Selling Hot — Kabir's Kitchen" },
      { property: "og:description", content: "Ranked best-sellers." },
    ],
  }),
  component: SellingHot,
});

function SellingHot() {
  const items = useMemo(() =>
    ALL_ITEMS.filter((i) => i.isSellingHot).sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0)),
  []);
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary/80 to-primary/50 p-8 text-primary-foreground">
          <span className="inline-flex items-center gap-1 rounded-full bg-background/20 px-3 py-1 text-xs font-black uppercase">
            <Flame className="h-3 w-3" /> Real-world bestsellers
          </span>
          <h1 className="mt-2 text-5xl font-black">Selling Hot</h1>
          <p className="mt-2 max-w-md font-semibold opacity-90">The top {items.length} dishes flying out of the kitchen this week.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((it, i) => (
            <div key={it.id} className="relative">
              <DishCard item={it} rank={i + 1} />
              <p className="mt-1 text-center text-[11px] font-semibold text-muted-foreground">{it.popularity} orders this week</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
      <StickyCartBar />
    </div>
  );
}
