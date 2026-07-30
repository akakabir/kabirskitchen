import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart, getLineItem } from "@/lib/cart-context";
import { VegDot } from "@/components/DishCard";
import SpecularButton from "@/components/SpecularButton";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Kabir's Kitchen" },
      { name: "description", content: "Review your order and proceed to secure online payment." },
      { property: "og:title", content: "Your Cart — Kabir's Kitchen" },
      { property: "og:description", content: "Review and check out." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, updateQty, removeLine, totalWithFees } = useCart();

  if (lines.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-secondary">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="mt-6 text-3xl font-black">Your cart is empty</h1>
          <p className="mt-2 text-muted-foreground">Let's fix that.</p>
          <Link to="/menu" className="mt-6 inline-block rounded-full bg-primary px-6 py-3 font-black text-primary-foreground shadow">Browse menu</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const { subtotal, gst, delivery, total } = totalWithFees;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-6 md:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          <h1 className="text-3xl font-black">Your cart</h1>
          {lines.map((line) => {
            const item = getLineItem(line);
            if (!item) return null;
            return (
              <div key={line.lineId} className="flex gap-3 rounded-2xl border border-border bg-card p-3">
                <img src={item.image} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-2">
                    <VegDot veg={item.veg} />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-bold">{item.name}</h3>
                      {line.labelExtras && <p className="text-xs text-muted-foreground">{line.labelExtras}</p>}
                    </div>
                    <SpecularButton onClick={() => removeLine(line.lineId)} className="shrink-0 text-muted-foreground hover:text-primary" aria-label="Remove">
                      <Trash2 className="h-4 w-4" />
                    </SpecularButton>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 rounded-full border border-border px-2 py-0.5">
                      <SpecularButton onClick={() => updateQty(line.lineId, line.qty - 1)} className="grid h-6 w-6 place-items-center rounded-full hover:bg-secondary"><Minus className="h-3 w-3" /></SpecularButton>
                      <span className="w-5 text-center text-sm font-bold">{line.qty}</span>
                      <SpecularButton onClick={() => updateQty(line.lineId, line.qty + 1)} className="grid h-6 w-6 place-items-center rounded-full hover:bg-secondary"><Plus className="h-3 w-3" /></SpecularButton>
                    </div>
                    <div className="text-sm font-black">₹{line.unitPrice * line.qty}</div>
                  </div>
                </div>
              </div>
            );
          })}
          <Link to="/menu" className="inline-block text-sm font-bold text-primary hover:underline">+ Add more items</Link>
        </div>

        <aside className="md:sticky md:top-24 md:self-start">
          <div className="rounded-3xl border border-border bg-card p-5">
            <h2 className="text-lg font-black">Bill details</h2>
            <div className="mt-4 space-y-2 text-sm">
              <Row label="Item total" value={`₹${subtotal}`} />
              <Row label="GST (5%)" value={`₹${gst}`} />
              <Row label={delivery === 0 ? "Delivery (Free over ₹399)" : "Delivery fee"} value={delivery === 0 ? "FREE" : `₹${delivery}`} />
              <div className="my-3 border-t border-border" />
              <Row label={<span className="text-base font-black">Grand total</span>} value={<span className="text-xl font-black">₹{total}</span>} />
            </div>
            <Link to="/checkout" className="mt-5 flex w-full items-center justify-center rounded-full bg-primary py-3 text-sm font-black text-primary-foreground shadow-lg hover:opacity-95">
              Proceed to Pay
            </Link>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">Online payment only. No cash on delivery.</p>
          </div>
        </aside>
      </div>
      <Footer />
    </div>
  );
}

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return <div className="flex items-center justify-between"><span className="text-muted-foreground">{label}</span><span className="font-bold">{value}</span></div>;
}
