import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Minus, Plus, Star } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyCartBar } from "@/components/StickyCartBar";
import { DishCard, VegDot } from "@/components/DishCard";
import { getItem, ALL_ITEMS } from "@/lib/data";
import { useCart, computeSelection, defaultSelection, type SelectedOptions } from "@/lib/cart-context";
import { cn } from "@/lib/utils";
import SpecularButton from "@/components/SpecularButton";

export const Route = createFileRoute("/dish/$id")({
  head: ({ params }) => {
    const item = getItem(params.id);
    if (!item) return { meta: [{ title: "Dish — Kabir's Kitchen" }] };
    return {
      meta: [
        { title: `${item.name} — Kabir's Kitchen` },
        { name: "description", content: item.description },
        { property: "og:title", content: `${item.name} — Kabir's Kitchen` },
        { property: "og:description", content: item.description },
        { property: "og:image", content: item.image },
        { name: "twitter:image", content: item.image },
      ],
    };
  },
  component: DishDetail,
  notFoundComponent: NotFound,
});

function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-3xl font-black">Dish not found</h1>
        <Link to="/menu" className="mt-4 inline-block rounded-full bg-primary px-5 py-2 font-bold text-primary-foreground">Back to menu</Link>
      </div>
      <Footer />
    </div>
  );
}

function DishDetail() {
  const { id } = Route.useParams();
  const item = getItem(id);
  const { addLine } = useCart();
  const [sel, setSel] = useState<SelectedOptions>(() => item ? defaultSelection(item) : {});
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setSel(item ? defaultSelection(item) : {});
    setQty(1);
  }, [id]);


  const alt = useMemo(
    () => item ? ALL_ITEMS.filter((i) => i.id !== item.id && i.cuisine === item.cuisine && i.kind === "dish").slice(0, 8) : [],
    [item],
  );

  if (!item) return <NotFound />;

  const { unitPrice, label } = computeSelection(item, sel);

  const toggle = (gid: string, cid: string, type: "single" | "multi") => {
    setSel((prev) => {
      if (type === "single") return { ...prev, [gid]: cid };
      const arr = Array.isArray(prev[gid]) ? [...(prev[gid] as string[])] : [];
      const i = arr.indexOf(cid);
      if (i >= 0) arr.splice(i, 1); else arr.push(cid);
      return { ...prev, [gid]: arr };
    });
  };

  const addToCart = () => {
    addLine(item.id, sel, unitPrice, label, qty);
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header />
      <div className="mx-auto max-w-4xl px-4 py-6">
        <Link to="/menu" className="mb-4 inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to menu
        </Link>

        <div className="grid gap-6 md:grid-cols-2 md:items-start">
          <div className="overflow-hidden rounded-3xl bg-muted self-start">
            <img src={item.image} alt={item.name} className="block aspect-square w-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <VegDot veg={item.veg} />
              <span className="text-xs font-black uppercase tracking-wider text-primary">{item.cuisine} · {item.category}</span>
            </div>
            <h1 className="mt-2 text-4xl font-black leading-tight">{item.name}</h1>
            <div className="mt-2 flex items-center gap-3">
              <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                <Star className="h-3 w-3 fill-current" /> {item.rating.toFixed(1)}
              </span>
              <span className="text-lg font-black">₹{item.price}</span>
              {item.spice && <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-bold">🌶 {item.spice}</span>}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{item.description}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              <b>Ingredients:</b> chef-selected fresh produce, spices, oils. Contact us for allergen details.
            </p>

            {item.options?.map((g) => (
              <div key={g.id} className="mt-6">
                <h3 className="mb-2 text-xs font-black uppercase tracking-wider text-muted-foreground">
                  {g.label} {g.required && <span className="text-primary">*</span>}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {g.choices.map((c) => {
                    const active = g.type === "single"
                      ? sel[g.id] === c.id
                      : Array.isArray(sel[g.id]) && (sel[g.id] as string[]).includes(c.id);
                    return (
                      <SpecularButton
                        key={c.id}
                        onClick={() => toggle(g.id, c.id, g.type)}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors",
                          active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-secondary hover:border-primary/50",
                        )}
                      >
                        {c.label}{c.priceDelta > 0 && ` +₹${c.priceDelta}`}
                      </SpecularButton>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-border px-2 py-1.5">
                <SpecularButton onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-7 w-7 place-items-center rounded-full hover:bg-secondary"><Minus className="h-3.5 w-3.5" /></SpecularButton>
                <span className="w-6 text-center text-sm font-bold">{qty}</span>
                <SpecularButton onClick={() => setQty((q) => q + 1)} className="grid h-7 w-7 place-items-center rounded-full hover:bg-secondary"><Plus className="h-3.5 w-3.5" /></SpecularButton>
              </div>
            </div>
          </div>
        </div>

        {alt.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-3 text-xl font-black">You might also like</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {alt.map((a) => <div key={a.id} className="w-56 shrink-0"><DishCard item={a} /></div>)}
            </div>
          </div>
        )}
      </div>

      {/* sticky add-to-cart */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 p-3 backdrop-blur">
        <SpecularButton
          onClick={addToCart}
          className="mx-auto flex w-full max-w-4xl items-center justify-center rounded-full bg-primary py-3 text-sm font-black text-primary-foreground shadow-lg transition-transform hover:scale-[1.01] active:scale-95"
        >
          Add to Cart — ₹{unitPrice * qty}
        </SpecularButton>
      </div>

      <Footer />
      <StickyCartBar />
    </div>
  );
}
