import { createFileRoute } from "@tanstack/react-router";
import { Leaf, ChefHat, Flame, ShieldCheck, Package, Truck } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/hygiene")({
  head: () => ({
    meta: [
      { title: "How Our Orders Are Made — Kabir's Kitchen" },
      { name: "description", content: "See exactly how your food is sourced, cooked, quality-checked, sealed and delivered." },
      { property: "og:title", content: "How Our Orders Are Made — Kabir's Kitchen" },
      { property: "og:description", content: "Our full hygiene & preparation process, step by step." },
      { property: "og:image", content: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=1200&h=630&fit=crop&auto=format&q=80" },
      { name: "twitter:image", content: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=1200&h=630&fit=crop&auto=format&q=80" },
    ],
  }),
  component: Hygiene,
});

const steps = [
  { icon: Leaf, title: "Sourcing", body: "Fresh produce delivered daily from vetted local farms & butcher partners. Nothing frozen sneaks in." , img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop&auto=format&q=75" },
  { icon: ChefHat, title: "Prep", body: "Prep stations sanitized every 90 minutes. Staff wear fresh gloves, hairnets & masks — non-negotiable.", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&auto=format&q=75" },
  { icon: Flame, title: "Cooking", body: "Every order is made-to-order on separate veg & non-veg lines. Nothing re-heated, nothing sitting.", img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop&auto=format&q=75" },
  { icon: ShieldCheck, title: "Quality check", body: "A duty manager tastes, weighs & inspects before your order leaves the pass.", img: "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=800&h=600&fit=crop&auto=format&q=75" },
  { icon: Package, title: "Sealed packaging", body: "Tamper-proof lids, heat-locking containers, and separate bags for cold desserts. Contactless-safe.", img: "https://images.unsplash.com/photo-1594322436404-5a0526db4d13?w=800&h=600&fit=crop&auto=format&q=75" },
  { icon: Truck, title: "Dispatch", body: "Insulated bags, sanitized between runs. Drivers do temperature checks daily.", img: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&h=600&fit=crop&auto=format&q=75" },
];

function Hygiene() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="max-w-2xl">
          <span className="text-xs font-black uppercase tracking-wider text-primary">Behind the pass</span>
          <h1 className="mt-2 text-5xl font-black leading-tight">How your food is made</h1>
          <p className="mt-3 text-muted-foreground">Full transparency, no shortcuts. This is exactly what happens between the farm and your front door.</p>
        </div>
        <div className="mt-10 space-y-6">
          {steps.map(({ icon: Icon, title, body, img }, i) => (
            <Reveal key={title} delay={i * 50}>
              <div className={`grid gap-6 rounded-3xl border border-border bg-card p-6 md:grid-cols-2 md:items-center ${i % 2 ? "md:[&>div:first-child]:order-2" : ""}`}>
                <div>
                  <div className="flex items-center gap-2 text-primary">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/15"><Icon className="h-5 w-5" /></div>
                    <span className="text-xs font-black uppercase tracking-wider">Step {i + 1}</span>
                  </div>
                  <h2 className="mt-2 text-3xl font-black">{title}</h2>
                  <p className="mt-2 text-muted-foreground">{body}</p>
                </div>
                <div className="overflow-hidden rounded-2xl bg-muted">
                  <img src={img} alt={title} className="aspect-video w-full object-cover" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
