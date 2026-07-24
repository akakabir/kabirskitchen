import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyCartBar } from "@/components/StickyCartBar";
import { DishCard } from "@/components/DishCard";
import { FilterBar, applyFilters, emptyFilters, type Filters } from "@/components/FilterBar";
import { ALL_ITEMS } from "@/lib/data";

export const Route = createFileRoute("/deals/99")({
  head: () => ({
    meta: [
      { title: "₹99 Only — Kabir's Kitchen" },
      { name: "description", content: "Full meals at just ₹99 — filling and fast." },
      { property: "og:title", content: "₹99 Only — Kabir's Kitchen" },
      { property: "og:description", content: "Full meals at ₹99." },
    ],
  }),
  component: Deals99,
});

function Deals99() {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const universe = useMemo(() => ALL_ITEMS.filter((i) => i.price === 99), []);
  const results = useMemo(() => applyFilters(universe, filters), [universe, filters]);
  return (
    <div className="min-h-screen bg-background">
      <Header showSearch searchValue={filters.q} onSearchChange={(v) => setFilters({ ...filters, q: v })} />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-foreground to-foreground/70 p-8 text-background shadow-lg">
          <div className="text-xs font-black uppercase tracking-wider opacity-80">Meal deal</div>
          <div className="mt-1 text-5xl font-black">₹99 Only</div>
          <p className="mt-2 max-w-md font-semibold opacity-90">{universe.length} meals priced at exactly ₹99. Fill up without emptying the wallet.</p>
        </div>
        <FilterBar items={universe} filters={filters} onChange={setFilters} />
        <p className="mt-4 text-sm font-semibold text-muted-foreground">{results.length} items</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {results.map((item) => <DishCard key={item.id} item={item} />)}
        </div>
      </div>
      <Footer />
      <StickyCartBar />
    </div>
  );
}
