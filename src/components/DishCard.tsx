import { Link } from "@tanstack/react-router";
import { Plus, Star, Flame } from "lucide-react";
import { useState } from "react";
import type { Dish } from "@/lib/data";
import { useCart, computeSelection, defaultSelection, type SelectedOptions } from "@/lib/cart-context";
import { CustomizationModal } from "./CustomizationModal";
import { cn } from "@/lib/utils";

export function VegDot({ veg }: { veg: boolean }) {
  return (
    <span
      className={cn(
        "inline-grid h-3.5 w-3.5 place-items-center border-2 rounded-[3px]",
        veg ? "border-[color:var(--color-veg)]" : "border-[color:var(--color-nonveg)]",
      )}
      aria-label={veg ? "Veg" : "Non-veg"}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          veg ? "bg-[color:var(--color-veg)]" : "bg-[color:var(--color-nonveg)]",
        )}
      />
    </span>
  );
}

export function DishCard({ item, rank }: { item: Dish; rank?: number }) {
  const { addLine } = useCart();
  const [open, setOpen] = useState(false);
  const hasOptions = (item.options?.length ?? 0) > 0;
  const detailPath = item.kind === "dessert" ? `/dessert/${item.id}` : `/dish/${item.id}`;

  const quickAdd = () => {
    if (hasOptions) { setOpen(true); return; }
    const sel: SelectedOptions = defaultSelection(item);
    const { unitPrice, label } = computeSelection(item, sel);
    addLine(item.id, sel, unitPrice, label);
  };

  return (
    <>
      <div className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-shadow hover:shadow-lg">
        <Link to={detailPath} className="relative block aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {item.isSellingHot && (
            <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-primary-foreground shadow">
              <Flame className="h-3 w-3" /> Hot
            </span>
          )}
          {rank && (
            <span className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-background/90 text-sm font-black text-foreground shadow">
              #{rank}
            </span>
          )}
        </Link>

        <div className="flex flex-1 flex-col gap-2 p-3">
          <div className="flex items-start gap-2">
            <VegDot veg={item.veg} />
            <Link to={detailPath} className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-bold leading-tight">{item.name}</h3>
            </Link>
          </div>
          <p className="line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
          <div className="mt-auto flex items-center justify-between gap-2 pt-1">
            <div className="flex flex-col">
              <span className="text-lg font-black">₹{item.price}</span>
              <span className="flex items-center gap-0.5 text-[11px] text-muted-foreground">
                <Star className="h-3 w-3 fill-current text-amber-500" /> {item.rating.toFixed(1)}
              </span>
            </div>
            <button
              onClick={quickAdd}
              className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow transition-transform hover:scale-105 active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" /> {hasOptions ? "Add" : "Add"}
            </button>
          </div>
          {hasOptions && (
            <span className="text-[10px] text-muted-foreground">customizable</span>
          )}
        </div>
      </div>
      {open && <CustomizationModal item={item} onClose={() => setOpen(false)} />}
    </>
  );
}
