import { useState } from "react";
import { X, Minus, Plus } from "lucide-react";
import type { Dish } from "@/lib/data";
import { useCart, computeSelection, defaultSelection, type SelectedOptions } from "@/lib/cart-context";
import { VegDot } from "./DishCard";
import { cn } from "@/lib/utils";

export function CustomizationModal({ item, onClose }: { item: Dish; onClose: () => void }) {
  const { addLine } = useCart();
  const [sel, setSel] = useState<SelectedOptions>(() => defaultSelection(item));
  const [qty, setQty] = useState(1);

  const { unitPrice, label } = computeSelection(item, sel);

  const toggle = (groupId: string, choiceId: string, type: "single" | "multi") => {
    setSel((prev) => {
      if (type === "single") return { ...prev, [groupId]: choiceId };
      const arr = Array.isArray(prev[groupId]) ? [...(prev[groupId] as string[])] : [];
      const idx = arr.indexOf(choiceId);
      if (idx >= 0) arr.splice(idx, 1); else arr.push(choiceId);
      return { ...prev, [groupId]: arr };
    });
  };

  const submit = () => {
    addLine(item.id, sel, unitPrice, label, qty);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-card text-card-foreground sm:rounded-3xl"
      >
        <div className="relative h-40 shrink-0 bg-muted">
          <img src={item.image} alt="" className="h-full w-full object-cover" />
          <button onClick={onClose} className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/90 shadow">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <div className="flex items-start gap-2">
            <VegDot veg={item.veg} />
            <div>
              <h2 className="text-xl font-black">{item.name}</h2>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          </div>

          {item.options?.map((g) => (
            <div key={g.id}>
              <h3 className="mb-2 text-xs font-black uppercase tracking-wider text-muted-foreground">
                {g.label} {g.required && <span className="text-primary">*</span>}
              </h3>
              <div className="flex flex-wrap gap-2">
                {g.choices.map((c) => {
                  const active = g.type === "single"
                    ? sel[g.id] === c.id
                    : Array.isArray(sel[g.id]) && (sel[g.id] as string[]).includes(c.id);
                  return (
                    <button
                      key={c.id}
                      onClick={() => toggle(g.id, c.id, g.type)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors",
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-secondary hover:border-primary/50",
                      )}
                    >
                      {c.label}{c.priceDelta > 0 && ` +₹${c.priceDelta}`}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 border-t border-border bg-background p-4">
          <div className="flex items-center gap-2 rounded-full border border-border px-2 py-1">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-7 w-7 place-items-center rounded-full hover:bg-secondary">
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-6 text-center text-sm font-bold">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} className="grid h-7 w-7 place-items-center rounded-full hover:bg-secondary">
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <button
            onClick={submit}
            className="flex flex-1 items-center justify-center rounded-full bg-primary py-3 text-sm font-black text-primary-foreground shadow transition-transform hover:scale-[1.02] active:scale-95"
          >
            Add to Cart — ₹{unitPrice * qty}
          </button>
        </div>
      </div>
    </div>
  );
}
