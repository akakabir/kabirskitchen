import { useMemo } from "react";
import type { Dish, Cuisine, Category } from "@/lib/data";
import { PRICE_BUCKETS } from "@/lib/data";
import { cn } from "@/lib/utils";

export interface Filters {
  q: string;
  vegOnly: boolean;
  nonvegOnly: boolean;
  cuisines: Cuisine[];
  categories: Category[];
  priceBuckets: string[];
  minRating: number;
  spice: string[];
  dessertTypes?: string[];
  flavors?: string[];
  priceMin?: number;
  priceMax?: number;
}

export const emptyFilters: Filters = {
  q: "", vegOnly: false, nonvegOnly: false,
  cuisines: [], categories: [], priceBuckets: [], minRating: 0, spice: [],
  dessertTypes: [], flavors: [],
};

export function applyFilters(items: Dish[], f: Filters): Dish[] {
  const q = f.q.trim().toLowerCase();
  return items.filter((d) => {
    if (q && !d.name.toLowerCase().includes(q) && !d.description.toLowerCase().includes(q)) return false;
    if (f.vegOnly && !d.veg) return false;
    if (f.nonvegOnly && d.veg) return false;
    if (f.cuisines.length && !f.cuisines.includes(d.cuisine)) return false;
    if (f.categories.length && !f.categories.includes(d.category)) return false;
    if (f.priceBuckets.length) {
      const ok = f.priceBuckets.some((id) => {
        const b = PRICE_BUCKETS.find((x) => x.id === id);
        return b ? b.test(d.price) : false;
      });
      if (!ok) return false;
    }
    if (typeof f.priceMin === "number" && d.price < f.priceMin) return false;
    if (typeof f.priceMax === "number" && d.price > f.priceMax) return false;
    if (f.minRating && d.rating < f.minRating) return false;
    if (f.spice.length && (!d.spice || !f.spice.includes(d.spice))) return false;
    if (f.dessertTypes && f.dessertTypes.length && (!d.dessertType || !f.dessertTypes.includes(d.dessertType))) return false;
    if (f.flavors && f.flavors.length && (!d.flavor || !f.flavors.includes(d.flavor))) return false;
    return true;
  });
}


// Count how many items match if we toggle ON a candidate value while keeping others.
function countWith(items: Dish[], base: Filters, patch: Partial<Filters>): number {
  return applyFilters(items, { ...base, ...patch }).length;
}

interface ChipProps { active: boolean; onClick: () => void; children: React.ReactNode; }
function Chip({ active, onClick, children }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-secondary hover:border-primary/50",
      )}
    >
      {children}
    </button>
  );
}

interface Props {
  items: Dish[]; // full universe for this page (pre-filter) — for live counts
  filters: Filters;
  onChange: (f: Filters) => void;
  showCuisine?: boolean;
  showCategory?: boolean;
  showSpice?: boolean;
  showDessertTypes?: boolean;
  dessertTypes?: readonly string[];
  showFlavors?: boolean;
  flavors?: readonly string[];
}

export function FilterBar({
  items, filters, onChange,
  showCuisine = true, showCategory = true, showSpice = true,
  showDessertTypes = false, dessertTypes = [],
  showFlavors = false, flavors = [],
}: Props) {
  const toggleIn = <T extends string>(arr: T[], v: T): T[] =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });

  // Live counts — recomputed from the full items pool with the current filters.
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    c.veg = countWith(items, filters, { vegOnly: true, nonvegOnly: false });
    c.nonveg = countWith(items, filters, { nonvegOnly: true, vegOnly: false });
    (["Indian", "Chinese", "Arabian", "Continental"] as Cuisine[]).forEach((cu) => {
      c[`cu_${cu}`] = countWith(items, filters, { cuisines: [cu] });
    });
    (["Starters", "Main Course", "Rice/Biryani", "Breads", "Beverages", "Combos", "Desserts"] as Category[]).forEach((ct) => {
      c[`ct_${ct}`] = countWith(items, filters, { categories: [ct] });
    });
    PRICE_BUCKETS.forEach((b) => { c[`pb_${b.id}`] = countWith(items, filters, { priceBuckets: [b.id] }); });
    (["Mild", "Medium", "Spicy"]).forEach((s) => { c[`sp_${s}`] = countWith(items, filters, { spice: [s] }); });
    dessertTypes.forEach((t) => { c[`dt_${t}`] = countWith(items, filters, { dessertTypes: [t] }); });
    flavors.forEach((f) => { c[`fl_${f}`] = countWith(items, filters, { flavors: [f] }); });
    c[`rat_4`] = countWith(items, filters, { minRating: 4 });
    return c;
  }, [items, filters, dessertTypes, flavors]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        <Chip active={filters.vegOnly} onClick={() => set({ vegOnly: !filters.vegOnly, nonvegOnly: false })}>
          <span className="mr-1 inline-block h-2 w-2 rounded-full align-middle" style={{ background: "var(--color-veg)" }} /> Veg ({counts.veg})
        </Chip>
        <Chip active={filters.nonvegOnly} onClick={() => set({ nonvegOnly: !filters.nonvegOnly, vegOnly: false })}>
          <span className="mr-1 inline-block h-2 w-2 rounded-full align-middle" style={{ background: "var(--color-nonveg)" }} /> Non-Veg ({counts.nonveg})
        </Chip>
        <Chip active={filters.minRating >= 4} onClick={() => set({ minRating: filters.minRating >= 4 ? 0 : 4 })}>
          ⭐ 4+ ({counts.rat_4})
        </Chip>
      </div>

      {showCuisine && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {(["Indian", "Chinese", "Arabian", "Continental"] as Cuisine[]).map((cu) => (
            <Chip key={cu} active={filters.cuisines.includes(cu)} onClick={() => set({ cuisines: toggleIn(filters.cuisines, cu) })}>
              {cu} ({counts[`cu_${cu}`]})
            </Chip>
          ))}
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {PRICE_BUCKETS.map((b) => (
          <Chip key={b.id} active={filters.priceBuckets.includes(b.id)} onClick={() => set({ priceBuckets: toggleIn(filters.priceBuckets, b.id) })}>
            {b.label} ({counts[`pb_${b.id}`]})
          </Chip>
        ))}
      </div>

      {showCategory && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {(["Starters", "Main Course", "Rice/Biryani", "Breads", "Beverages", "Combos", "Desserts"] as Category[]).map((ct) => (
            <Chip key={ct} active={filters.categories.includes(ct)} onClick={() => set({ categories: toggleIn(filters.categories, ct) })}>
              {ct} ({counts[`ct_${ct}`]})
            </Chip>
          ))}
        </div>
      )}

      {showSpice && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {["Mild", "Medium", "Spicy"].map((s) => (
            <Chip key={s} active={filters.spice.includes(s)} onClick={() => set({ spice: toggleIn(filters.spice, s) })}>
              {s} ({counts[`sp_${s}`]})
            </Chip>
          ))}
        </div>
      )}

      {showDessertTypes && dessertTypes.length > 0 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {dessertTypes.map((t) => (
            <Chip key={t} active={(filters.dessertTypes ?? []).includes(t)}
              onClick={() => set({ dessertTypes: toggleIn(filters.dessertTypes ?? [], t) })}>
              {t} ({counts[`dt_${t}`]})
            </Chip>
          ))}
        </div>
      )}

      {showFlavors && flavors.length > 0 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {flavors.map((f) => (
            <Chip key={f} active={(filters.flavors ?? []).includes(f)}
              onClick={() => set({ flavors: toggleIn(filters.flavors ?? [], f) })}>
              {f} ({counts[`fl_${f}`]})
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
}
