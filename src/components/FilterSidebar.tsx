import { useEffect, useMemo, useState } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import type { Dish, Cuisine, Category } from "@/lib/data";
import { PRICE_BUCKETS } from "@/lib/data";
import { cn } from "@/lib/utils";
import { emptyFilters, applyFilters, type Filters } from "./FilterBar";

interface Props {
  items: Dish[]; // full pool
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

function countWith(items: Dish[], base: Filters, patch: Partial<Filters>): number {
  return applyFilters(items, { ...base, ...patch }).length;
}

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border py-4 last:border-b-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-xs font-black uppercase tracking-wider text-foreground">{title}</span>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

interface RowProps {
  active: boolean;
  onClick: () => void;
  label: React.ReactNode;
  count?: number;
}
function Row({ active, onClick, label, count }: RowProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors",
        active ? "bg-primary/10 font-bold text-primary" : "text-foreground hover:bg-secondary",
      )}
    >
      <span className="flex items-center gap-2">
        <span
          className={cn(
            "grid h-4 w-4 place-items-center rounded border transition-colors",
            active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background",
          )}
        >
          {active && <span className="text-[10px] leading-none">✓</span>}
        </span>
        <span>{label}</span>
      </span>
      {typeof count === "number" && (
        <span className={cn("text-xs", active ? "text-primary" : "text-muted-foreground")}>({count})</span>
      )}
    </button>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-secondary hover:border-primary/50",
      )}
    >
      {children}
    </button>
  );
}

function PriceRange({ min, max, value, onChange }: {
  min: number; max: number; value: [number, number]; onChange: (v: [number, number]) => void;
}) {
  // local buffer so dragging feels smooth
  const [local, setLocal] = useState<[number, number]>(value);
  useEffect(() => { setLocal(value); }, [value[0], value[1]]);
  const isMaxOpen = local[1] >= max;
  return (
    <div>
      <SliderPrimitive.Root
        className="relative flex h-5 w-full touch-none select-none items-center"
        min={min}
        max={max}
        step={10}
        minStepsBetweenThumbs={1}
        value={local}
        onValueChange={(v) => setLocal([v[0], v[1]] as [number, number])}
        onValueCommit={(v) => onChange([v[0], v[1]] as [number, number])}
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/15">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          aria-label="Minimum price"
          className="block h-4 w-4 rounded-full border-2 border-primary bg-background shadow transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        />
        <SliderPrimitive.Thumb
          aria-label="Maximum price"
          className="block h-4 w-4 rounded-full border-2 border-primary bg-background shadow transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        />
      </SliderPrimitive.Root>
      <div className="mt-3 flex items-center justify-between text-sm font-bold">
        <span>₹{local[0]}</span>
        <span className="text-muted-foreground">–</span>
        <span>₹{local[1]}{isMaxOpen ? "+" : ""}</span>
      </div>
    </div>
  );
}

export function FilterSidebar({
  items, filters, onChange,
  showCuisine = true, showCategory = true, showSpice = true,
  showDessertTypes = false, dessertTypes = [],
  showFlavors = false, flavors = [],
}: Props) {
  const toggleIn = <T extends string>(arr: T[], v: T): T[] =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });

  const [priceMin, priceMax] = useMemo(() => {
    if (!items.length) return [0, 1000] as const;
    const prices = items.map((i) => i.price);
    const lo = Math.floor(Math.min(...prices) / 10) * 10;
    const hi = Math.ceil(Math.max(...prices) / 10) * 10;
    return [Math.max(0, lo), Math.max(hi, lo + 10)] as const;
  }, [items]);

  const currentRange: [number, number] = [
    typeof filters.priceMin === "number" ? filters.priceMin : priceMin,
    typeof filters.priceMax === "number" ? filters.priceMax : priceMax,
  ];

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
    for (let r = 4; r >= 3; r--) c[`rat_${r}`] = countWith(items, filters, { minRating: r });
    return c;
  }, [items, filters, dessertTypes, flavors]);

  const hasAny =
    filters.vegOnly || filters.nonvegOnly ||
    filters.cuisines.length || filters.categories.length ||
    filters.priceBuckets.length || filters.spice.length ||
    filters.minRating || (filters.dessertTypes?.length ?? 0) ||
    (filters.flavors?.length ?? 0) ||
    typeof filters.priceMin === "number" || typeof filters.priceMax === "number";

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-black">Filters</h2>
        </div>
        {hasAny ? (
          <button
            onClick={() => onChange({ ...emptyFilters, q: filters.q })}
            className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
          >
            <X className="h-3 w-3" /> Clear
          </button>
        ) : null}
      </div>

      <Section title="Diet">
        <Row active={filters.vegOnly} onClick={() => set({ vegOnly: !filters.vegOnly, nonvegOnly: false })}
          label={<><span className="mr-1 inline-block h-2 w-2 rounded-full align-middle" style={{ background: "var(--color-veg)" }} /> Veg</>} count={counts.veg} />
        <Row active={filters.nonvegOnly} onClick={() => set({ nonvegOnly: !filters.nonvegOnly, vegOnly: false })}
          label={<><span className="mr-1 inline-block h-2 w-2 rounded-full align-middle" style={{ background: "var(--color-nonveg)" }} /> Non-Veg</>} count={counts.nonveg} />
      </Section>

      <Section title="Price">
        <PriceRange
          min={priceMin}
          max={priceMax}
          value={currentRange}
          onChange={(v) => set({ priceMin: v[0], priceMax: v[1] })}
        />
        <div className="mt-3 flex flex-wrap gap-1.5">
          {PRICE_BUCKETS.map((b) => (
            <Chip key={b.id} active={filters.priceBuckets.includes(b.id)}
              onClick={() => set({ priceBuckets: toggleIn(filters.priceBuckets, b.id) })}>
              {b.label} ({counts[`pb_${b.id}`]})
            </Chip>
          ))}
        </div>
      </Section>

      {showCuisine && (
        <Section title="Cuisine">
          {(["Indian", "Chinese", "Arabian", "Continental"] as Cuisine[]).map((cu) => (
            <Row key={cu} active={filters.cuisines.includes(cu)}
              onClick={() => set({ cuisines: toggleIn(filters.cuisines, cu) })}
              label={cu} count={counts[`cu_${cu}`]} />
          ))}
        </Section>
      )}

      {showCategory && (
        <Section title="Category">
          {(["Starters", "Main Course", "Rice/Biryani", "Breads", "Beverages", "Combos", "Desserts"] as Category[]).map((ct) => (
            <Row key={ct} active={filters.categories.includes(ct)}
              onClick={() => set({ categories: toggleIn(filters.categories, ct) })}
              label={ct} count={counts[`ct_${ct}`]} />
          ))}
        </Section>
      )}

      <Section title="Rating">
        {[4, 3].map((r) => (
          <Row key={r} active={filters.minRating === r}
            onClick={() => set({ minRating: filters.minRating === r ? 0 : r })}
            label={<>⭐ {r}+ & up</>} count={counts[`rat_${r}`]} />
        ))}
      </Section>

      {showSpice && (
        <Section title="Spice Level">
          {["Mild", "Medium", "Spicy"].map((s) => (
            <Row key={s} active={filters.spice.includes(s)}
              onClick={() => set({ spice: toggleIn(filters.spice, s) })}
              label={s} count={counts[`sp_${s}`]} />
          ))}
        </Section>
      )}

      {showDessertTypes && dessertTypes.length > 0 && (
        <Section title="Dessert Type">
          {dessertTypes.map((t) => (
            <Row key={t} active={(filters.dessertTypes ?? []).includes(t)}
              onClick={() => set({ dessertTypes: toggleIn(filters.dessertTypes ?? [], t) })}
              label={t} count={counts[`dt_${t}`]} />
          ))}
        </Section>
      )}

      {showFlavors && flavors.length > 0 && (
        <Section title="Cake Flavor">
          {flavors.map((f) => (
            <Row key={f} active={(filters.flavors ?? []).includes(f)}
              onClick={() => set({ flavors: toggleIn(filters.flavors ?? [], f) })}
              label={f} count={counts[`fl_${f}`]} />
          ))}
        </Section>
      )}
    </div>
  );
}
