import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyCartBar } from "@/components/StickyCartBar";
import { DishCard } from "@/components/DishCard";
import { Reveal } from "@/components/Reveal";
import { applyFilters, emptyFilters, type Filters } from "@/components/FilterBar";
import { FilterSidebar } from "@/components/FilterSidebar";
import { DESSERTS, DESSERT_TYPES, CAKE_FLAVORS } from "@/lib/data";


export const Route = createFileRoute("/desserts")({
  head: () => ({
    meta: [
      { title: "Desserts — Kabir's Kitchen" },
      { name: "description", content: "Cakes, pastries, ice cream, Indian sweets, baklava & more." },
      { property: "og:title", content: "Desserts — Kabir's Kitchen" },
      { property: "og:description", content: "Cakes, pastries, ice cream and more." },
    ],
  }),
  component: Desserts,
});

function Desserts() {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const results = useMemo(() => applyFilters(DESSERTS, filters), [filters]);
  return (
    <div className="min-h-screen bg-background">
      <Header showSearch searchValue={filters.q} onSearchChange={(v) => setFilters({ ...filters, q: v })} />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500/25 via-primary/20 to-yellow-400/20 p-8">
          <div className="text-xs font-black uppercase tracking-wider text-primary">Sweet stuff</div>
          <h1 className="mt-1 text-5xl font-black">Desserts</h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">Custom cakes (any flavor, any size), Indian sweets, ice cream, baklava, kunafa & more.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <FilterSidebar
              items={DESSERTS}
              filters={filters}
              onChange={setFilters}
              showSpice={false}
              showCuisine={false}
              showCategory={false}
              showDessertTypes
              dessertTypes={DESSERT_TYPES}
              showFlavors
              flavors={CAKE_FLAVORS}
            />
          </aside>
          <div>
            <p className="text-sm font-semibold text-muted-foreground">{results.length} desserts</p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {results.map((item, i) => <Reveal key={item.id} delay={Math.min(i, 8) * 30}><DishCard item={item} /></Reveal>)}
            </div>
          </div>
        </div>

      </div>
      <Footer />
      <StickyCartBar />
    </div>
  );
}
