import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyCartBar } from "@/components/StickyCartBar";
import { DishCard } from "@/components/DishCard";
import { Reveal } from "@/components/Reveal";
import { FilterBar, applyFilters, emptyFilters, type Filters } from "@/components/FilterBar";
import { ALL_ITEMS, type Cuisine } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — Kabir's Kitchen" },
      { name: "description", content: "Browse the full menu — Indian, Chinese, Arabian dishes and more." },
      { property: "og:title", content: "Menu — Kabir's Kitchen" },
      { property: "og:description", content: "Browse dishes across cuisines, filter by veg, price and rating." },
    ],
  }),
  component: MenuPage,
});

const tabs: Array<"All" | Cuisine | "Desserts"> = ["All", "Indian", "Chinese", "Arabian", "Desserts"];

function MenuPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const [filters, setFilters] = useState<Filters>(emptyFilters);

  // universe for this page based on selected top tab
  const universe = useMemo(() => {
    let items = ALL_ITEMS.filter((i) => i.kind === "dish" || tab === "Desserts" || tab === "All");
    if (tab === "Desserts") items = ALL_ITEMS.filter((i) => i.kind === "dessert");
    else if (tab !== "All") items = items.filter((i) => i.cuisine === tab);
    return items;
  }, [tab]);

  const results = useMemo(
    () => applyFilters(universe, { ...filters, q: filters.q }),
    [universe, filters],
  );

  return (
    <div className="min-h-screen bg-background">
      <Header showSearch searchValue={filters.q} onSearchChange={(v) => setFilters({ ...filters, q: v })} />

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Cuisine tabs */}
        <div className="mb-4 flex gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "shrink-0 rounded-full px-5 py-2 text-sm font-black transition-colors",
                tab === t ? "bg-primary text-primary-foreground shadow" : "bg-secondary hover:bg-accent",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <FilterBar items={universe} filters={filters} onChange={setFilters} />

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-muted-foreground">{results.length} dishes</p>
          {(filters.vegOnly || filters.nonvegOnly || filters.cuisines.length || filters.categories.length || filters.priceBuckets.length || filters.spice.length || filters.minRating) ? (
            <button onClick={() => setFilters({ ...emptyFilters, q: filters.q })} className="text-xs font-bold text-primary hover:underline">
              Clear filters
            </button>
          ) : null}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {results.map((item, i) => (
            <Reveal key={item.id} delay={Math.min(i, 8) * 30}>
              <DishCard item={item} />
            </Reveal>
          ))}
        </div>

        {results.length === 0 && (
          <div className="rounded-3xl border border-dashed border-border p-12 text-center">
            <p className="text-lg font-bold">No dishes match those filters</p>
            <p className="mt-1 text-sm text-muted-foreground">Try clearing a few and browse again.</p>
          </div>
        )}
      </div>

      <Footer />
      <StickyCartBar />
    </div>
  );
}
