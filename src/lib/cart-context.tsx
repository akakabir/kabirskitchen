import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getItem, type Dish, type OptionGroup } from "./data";

export interface SelectedOptions {
  // groupId -> choiceId(s)
  [groupId: string]: string | string[];
}

export interface CartLine {
  lineId: string;
  itemId: string;
  qty: number;
  options: SelectedOptions;
  unitPrice: number; // includes option deltas
  labelExtras: string; // "Large, Extra cheese"
}

interface Ctx {
  lines: CartLine[];
  addLine: (itemId: string, opts: SelectedOptions, unitPrice: number, extras: string, qty?: number) => void;
  updateQty: (lineId: string, qty: number) => void;
  removeLine: (lineId: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  totalWithFees: { subtotal: number; gst: number; delivery: number; total: number };
}
const CartCtx = createContext<Ctx | null>(null);
const KEY = "kk_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setLines(JSON.parse(saved));
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch {}
  }, [lines]);

  const addLine: Ctx["addLine"] = (itemId, options, unitPrice, labelExtras, qty = 1) => {
    setLines((prev) => {
      // merge if same item+options
      const key = JSON.stringify({ itemId, options });
      const idx = prev.findIndex((l) => JSON.stringify({ itemId: l.itemId, options: l.options }) === key);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [
        ...prev,
        {
          lineId: `l-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          itemId, qty, options, unitPrice, labelExtras,
        },
      ];
    });
  };
  const updateQty = (lineId: string, qty: number) => {
    setLines((prev) => qty <= 0 ? prev.filter((l) => l.lineId !== lineId) : prev.map((l) => l.lineId === lineId ? { ...l, qty } : l));
  };
  const removeLine = (lineId: string) => setLines((prev) => prev.filter((l) => l.lineId !== lineId));
  const clear = () => setLines([]);

  const count = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines]);
  const subtotal = useMemo(() => lines.reduce((s, l) => s + l.unitPrice * l.qty, 0), [lines]);
  const totalWithFees = useMemo(() => {
    const gst = Math.round(subtotal * 0.05);
    const delivery = subtotal === 0 ? 0 : subtotal >= 399 ? 0 : 29;
    return { subtotal, gst, delivery, total: subtotal + gst + delivery };
  }, [subtotal]);

  return (
    <CartCtx.Provider value={{ lines, addLine, updateQty, removeLine, clear, count, subtotal, totalWithFees }}>
      {children}
    </CartCtx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

// Compute unit price + label for a set of selected options
export function computeSelection(item: Dish, selection: SelectedOptions): { unitPrice: number; label: string } {
  let price = item.price;
  const parts: string[] = [];
  for (const group of item.options ?? []) {
    const sel = selection[group.id];
    if (!sel) continue;
    const ids = Array.isArray(sel) ? sel : [sel];
    for (const id of ids) {
      const choice = group.choices.find((c) => c.id === id);
      if (choice) {
        price += choice.priceDelta;
        if (choice.priceDelta !== 0 || group.type === "single") parts.push(choice.label);
      }
    }
  }
  return { unitPrice: price, label: parts.join(", ") };
}

export function defaultSelection(item: Dish): SelectedOptions {
  const sel: SelectedOptions = {};
  for (const g of item.options ?? []) {
    if (g.required || g.type === "single") {
      sel[g.id] = g.type === "multi" ? [] : g.choices[0].id;
    } else {
      sel[g.id] = [];
    }
  }
  return sel;
}

export function getLineItem(line: CartLine) {
  return getItem(line.itemId);
}

// Re-export OptionGroup for consumers
export type { OptionGroup };
