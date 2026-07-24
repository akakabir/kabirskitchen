import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CreditCard, Lock, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart, getLineItem } from "@/lib/cart-context";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Kabir's Kitchen" },
      { name: "description", content: "Enter your delivery address and pay securely online." },
      { property: "og:title", content: "Checkout — Kabir's Kitchen" },
      { property: "og:description", content: "Enter address and pay online." },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { lines, totalWithFees } = useCart();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", address: "", pincode: "" });
  const [paying, setPaying] = useState(false);

  const disabled = !form.name || !form.phone || !form.address || !form.pincode || lines.length === 0;
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });

  const pay = () => {
    setPaying(true);
    setTimeout(() => { nav({ to: "/orders" }); }, 1600);
  };

  if (lines.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <h1 className="text-2xl font-black">Cart is empty</h1>
          <Link to="/menu" className="mt-4 inline-block rounded-full bg-primary px-5 py-2 font-bold text-primary-foreground">Browse menu</Link>
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
        <div className="space-y-6">
          <h1 className="text-3xl font-black">Checkout</h1>

          <div className="rounded-3xl border border-border bg-card p-5">
            <h2 className="text-lg font-black">Delivery address</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Input label="Full name" value={form.name} onChange={set("name")} placeholder="Kabir Sharma" />
              <Input label="Phone" value={form.phone} onChange={set("phone")} placeholder="+91 98xxxxxx" />
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-black uppercase tracking-wider text-muted-foreground">Address</label>
                <textarea rows={3} value={form.address} onChange={set("address")} placeholder="Flat / building / area" className="w-full rounded-2xl border border-border bg-secondary px-4 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <Input label="Pincode" value={form.pincode} onChange={set("pincode")} placeholder="400050" />
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              <h2 className="text-lg font-black">Pay online</h2>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Secure payment via UPI, Card or Netbanking. We don't accept cash on delivery.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["UPI", "Cards", "Netbanking", "Wallets"].map((m) => (
                <span key={m} className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-bold">{m}</span>
              ))}
            </div>
            <button
              onClick={pay}
              disabled={disabled || paying}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-black text-primary-foreground shadow-lg transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {paying ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing payment…</> : <><CreditCard className="h-4 w-4" /> Pay Now — ₹{total}</>}
            </button>
          </div>
        </div>

        <aside className="md:sticky md:top-24 md:self-start">
          <div className="rounded-3xl border border-border bg-card p-5">
            <h2 className="text-lg font-black">Order summary</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {lines.map((l) => {
                const item = getLineItem(l);
                return (
                  <li key={l.lineId} className="flex justify-between gap-2">
                    <span className="min-w-0 truncate"><b>{l.qty}×</b> {item?.name}</span>
                    <span className="font-bold">₹{l.unitPrice * l.qty}</span>
                  </li>
                );
              })}
            </ul>
            <div className="my-3 border-t border-border" />
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>₹{subtotal}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>GST</span><span>₹{gst}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Delivery</span><span>{delivery === 0 ? "FREE" : `₹${delivery}`}</span></div>
              <div className="flex justify-between pt-2 text-lg font-black"><span>Total</span><span>₹{total}</span></div>
            </div>
          </div>
        </aside>
      </div>
      <Footer />
    </div>
  );
}

function Input({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-1 block text-xs font-black uppercase tracking-wider text-muted-foreground">{label}</label>
      <input {...rest} className="w-full rounded-full border border-border bg-secondary px-4 py-2 text-sm outline-none focus:border-primary" />
    </div>
  );
}
