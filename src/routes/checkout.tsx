import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CreditCard, Lock, Loader2, MapPin, Plus, Check } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart, getLineItem } from "@/lib/cart-context";
import { useLocation, type SavedAddress } from "@/lib/location-context";

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

interface OrderAddress {
  name: string;
  phone: string;
  house: string;
  building: string;
  landmark: string;
  instructions: string;
  formatted: string;
  fullAddress: string;
  pincode: string;
}

function fromSaved(a: SavedAddress | null): OrderAddress {
  return {
    name: "", phone: "",
    house: a?.house ?? "",
    building: a?.building ?? "",
    landmark: a?.landmark ?? "",
    instructions: a?.instructions ?? "",
    formatted: a?.formatted ?? "",
    fullAddress: a?.fullAddress ?? "",
    pincode: a?.pincode ?? "",
  };
}

function Checkout() {
  const { lines, totalWithFees } = useCart();
  const { addresses, selectedId, setSelectedId, selected, openPicker } = useLocation();
  const nav = useNavigate();
  const [form, setForm] = useState<OrderAddress>(() => fromSaved(selected));
  const [paying, setPaying] = useState(false);

  // When user switches saved address, refill address fields (keep name/phone)
  useEffect(() => {
    setForm((f) => ({ ...fromSaved(selected), name: f.name, phone: f.phone }));
  }, [selectedId, selected?.house, selected?.building, selected?.landmark, selected?.instructions, selected?.formatted, selected?.fullAddress, selected?.pincode]);

  const disabled = !form.name || !form.phone || !form.house || !form.formatted || !form.pincode || lines.length === 0;
  const set = <K extends keyof OrderAddress>(k: K) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

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

          {/* Saved address picker */}
          <div className="rounded-3xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-lg font-black">Deliver to</h2>
              <button
                onClick={() => openPicker()}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-bold hover:border-primary hover:text-primary"
              >
                <Plus className="h-3.5 w-3.5" /> Add new
              </button>
            </div>
            {addresses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No saved addresses. Add one to continue.</p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {addresses.map((a) => {
                  const active = a.id === selectedId;
                  return (
                    <button
                      key={a.id}
                      onClick={() => setSelectedId(a.id)}
                      className={`flex items-start gap-2 rounded-2xl border p-3 text-left text-sm transition-colors ${
                        active ? "border-primary bg-primary/5" : "border-border bg-secondary hover:border-primary/60"
                      }`}
                    >
                      <MapPin className={`mt-0.5 h-4 w-4 shrink-0 ${active ? "text-primary" : "text-muted-foreground"}`} />
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-1 font-black">
                          {a.label}
                          {active && <Check className="h-3.5 w-3.5 text-primary" />}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">{a.formatted || a.fullAddress}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Contact + address details (prefilled, editable per-order) */}
          <div className="rounded-3xl border border-border bg-card p-5">
            <h2 className="text-lg font-black">Address & instructions</h2>
            <p className="mt-1 text-xs text-muted-foreground">Prefilled from your saved address. Edits apply to this order only.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Input label="Full name *" value={form.name} onChange={set("name")} placeholder="Kabir Sharma" />
              <Input label="Phone *" value={form.phone} onChange={set("phone")} placeholder="+91 98xxxxxx" />
              <Input label="House / Flat no. & Floor *" value={form.house} onChange={set("house")} placeholder="Flat 402, 3rd floor" />
              <Input label="Building / Society name" value={form.building} onChange={set("building")} placeholder="Sunshine Apts" />
              <Input label="Landmark" value={form.landmark} onChange={set("landmark")} placeholder="Opp. HDFC ATM" />
              <Input label="Pincode *" value={form.pincode} onChange={set("pincode")} placeholder="400050" />
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-black uppercase tracking-wider text-muted-foreground">Area / locality</label>
                <div className="flex items-center gap-2 rounded-2xl border border-border bg-secondary px-4 py-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="min-w-0 flex-1 truncate">{form.formatted || "Pick from a saved address"}</span>
                  <button onClick={() => openPicker()} className="text-xs font-bold text-primary hover:underline">Change</button>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-black uppercase tracking-wider text-muted-foreground">Delivery instructions for the driver</label>
                <textarea rows={2} value={form.instructions} onChange={set("instructions")} placeholder="Ring the bell twice · Leave at the door · Call on arrival" className="w-full rounded-2xl border border-border bg-secondary px-4 py-2 text-sm outline-none focus:border-primary" />
              </div>
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
