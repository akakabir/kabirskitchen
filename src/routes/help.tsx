import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ChevronDown, Mail, Phone, MessageCircle, FileText, Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import SpecularButton from "@/components/SpecularButton";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help & FAQ — Kabir's Kitchen" },
      { name: "description", content: "Answers on payments, customization, delivery, allergens and order issues. Reach us anytime." },
      { property: "og:title", content: "Help & FAQ — Kabir's Kitchen" },
      { property: "og:description", content: "Searchable FAQ + contact options." },
    ],
  }),
  component: Help,
});

interface Faq { q: string; a: string; tag: string; }

const FAQS: Faq[] = [
  { tag: "Payments", q: "How can I pay for my order?", a: "We accept UPI, credit/debit cards, netbanking and popular wallets — all secured. Just tap Pay Now at checkout and pick your method." },
  { tag: "Payments", q: "Do you offer Cash on Delivery?", a: "No. Kabir's Kitchen is online-payment only. This keeps deliveries fast, contact-free and safer for both riders and customers." },
  { tag: "Payments", q: "My payment failed but money got deducted.", a: "Failed payments are auto-refunded to the source within 5–7 business days. If you don't see the reversal, email hello@kabirskitchen.in with your reference ID." },
  { tag: "Customization", q: "Can I customize a dish (size, spice, add-ons)?", a: "Yes — any dish with a customizable badge opens a picker where you can pick size, crust, spice, sides or add-ons. Cakes let you pick flavor, size (500g–2kg), egg/eggless and a greeting message." },
  { tag: "Customization", q: "Can I add a greeting message on a cake?", a: "Absolutely. On any cake's page, type your message (up to 60 characters) — we'll print it on a fresh card that ships in the box." },
  { tag: "Delivery", q: "Which areas do you deliver to?", a: "We currently deliver across Mumbai — Bandra, Khar, Santacruz, Juhu, Andheri, Lower Parel, Worli and BKC. New zones roll out monthly." },
  { tag: "Delivery", q: "How long does delivery take?", a: "Our average is 28 minutes for main dishes. Cakes and large orders may take 45–60 minutes as they're baked to order." },
  { tag: "Delivery", q: "Is delivery free?", a: "Delivery is free on carts over ₹399. Smaller orders carry a flat ₹29 delivery fee." },
  { tag: "Allergens", q: "Do you list ingredients and allergens?", a: "Every dish page shows a short ingredient note. Our kitchen handles wheat, dairy, nuts, eggs, seafood and soy — cross-contact is possible, so message us in advance for severe allergies." },
  { tag: "Allergens", q: "Do you have eggless / vegan options?", a: "Yes. All cakes have an eggless toggle. Look for the green veg-dot on dish cards for pure vegetarian dishes. Fully vegan menu tags are coming soon." },
  { tag: "Order issues", q: "An item was missing or wrong. What do I do?", a: "Please raise it within 30 minutes of delivery via WhatsApp or email — with a photo if possible. We'll refund the item or send a fresh one." },
  { tag: "Order issues", q: "Can I cancel my order?", a: "You can cancel free of charge until the kitchen starts preparation. Once cooking begins, cancellations are non-refundable — full policy is in our Terms." },
  { tag: "Account", q: "Do I need an account to order?", a: "No account needed — enter your details at checkout. Accounts (with saved addresses & order history) are coming as part of the tracking release." },
  { tag: "Account", q: "How do I change the app theme?", a: "Head to Settings → Theme. Pick from six themes — Light, Dark, Emerald, Topaz, Sapphire or Ruby. The whole app re-themes instantly." },
];

const CATS = ["All", "Payments", "Customization", "Delivery", "Allergens", "Order issues", "Account"] as const;

function Help() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [open, setOpen] = useState<number | null>(0);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return FAQS.filter((f) => {
      if (cat !== "All" && f.tag !== cat) return false;
      if (!needle) return true;
      return f.q.toLowerCase().includes(needle) || f.a.toLowerCase().includes(needle);
    });
  }, [q, cat]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/20 via-accent/40 to-background" />
        <div className="mx-auto max-w-4xl px-4 py-14 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1 text-xs font-black uppercase tracking-wider text-primary">
              <Sparkles className="h-3 w-3" /> Help center
            </span>
            <h1 className="mt-3 text-5xl font-black leading-tight md:text-6xl">How can we help?</h1>
            <p className="mt-3 text-muted-foreground">Search the FAQ or reach out — we usually reply in minutes.</p>
          </Reveal>
          <Reveal delay={100}>
            <div className="relative mx-auto mt-6 max-w-xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search: payments, cake, delivery time…"
                className="w-full rounded-full border border-border bg-card py-3 pl-11 pr-4 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-8">
        <Reveal>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {CATS.map((c) => (
              <SpecularButton
                key={c}
                onClick={() => setCat(c)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-1.5 text-xs font-black transition-colors",
                  cat === c ? "bg-primary text-primary-foreground shadow" : "bg-secondary hover:bg-accent",
                )}
              >
                {c}
              </SpecularButton>
            ))}
          </div>
        </Reveal>

        <div className="mt-6 space-y-3">
          {results.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 40}>
                <div className="overflow-hidden rounded-2xl border border-border bg-card">
                  <SpecularButton
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center gap-3 px-4 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="hidden shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-primary sm:inline">{f.tag}</span>
                    <span className="min-w-0 flex-1 text-sm font-bold sm:text-base">{f.q}</span>
                    <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
                  </SpecularButton>
                  <div
                    className={cn(
                      "grid overflow-hidden px-4 transition-[grid-template-rows,padding] duration-300 ease-out",
                      isOpen ? "grid-rows-[1fr] pb-4" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="min-h-0 text-sm leading-relaxed text-muted-foreground">{f.a}</div>
                  </div>
                </div>
              </Reveal>
            );
          })}
          {results.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No answers match that search. Try a different keyword or reach us below.
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-10">
        <Reveal>
          <h2 className="text-2xl font-black">Still need help?</h2>
          <p className="mt-1 text-sm text-muted-foreground">Our team is around every day, 9am – 11pm.</p>
        </Reveal>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { icon: Mail, label: "Email", value: "hello@kabirskitchen.in" },
            { icon: Phone, label: "Call", value: "+91 98200 12345" },
            { icon: MessageCircle, label: "WhatsApp", value: "+91 98200 12345" },
          ].map(({ icon: Icon, label, value }, i) => (
            <Reveal key={label} delay={i * 80}>
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary"><Icon className="h-5 w-5" /></div>
                <div>
                  <div className="text-xs font-bold uppercase text-muted-foreground">{label}</div>
                  <div className="font-bold">{value}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={100}>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/terms" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-bold hover:bg-secondary">
              <FileText className="h-4 w-4" /> Terms & Conditions
            </Link>
            <Link to="/hygiene" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-bold hover:bg-secondary">
              <Sparkles className="h-4 w-4" /> How Our Orders Are Made
            </Link>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}
