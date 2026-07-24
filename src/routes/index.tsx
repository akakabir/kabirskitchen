import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Flame } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyCartBar } from "@/components/StickyCartBar";
import { DishCard } from "@/components/DishCard";
import { Reveal } from "@/components/Reveal";
import { ALL_ITEMS } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kabir's Kitchen — Cloud Kitchen Delivery" },
      { name: "description", content: "Order Indian, Chinese, Arabian and desserts — fresh, hygienic, delivered hot." },
      { property: "og:title", content: "Kabir's Kitchen — Cloud Kitchen Delivery" },
      { property: "og:description", content: "Fresh Indian, Chinese, Arabian & desserts, delivered hot." },
    ],
  }),
  component: Home,
});

const categoryTiles = [
  { label: "Indian", to: "/menu", emoji: "🍛", bg: "from-orange-500/20 to-red-500/20" },
  { label: "Chinese", to: "/menu", emoji: "🥡", bg: "from-red-500/20 to-yellow-500/20" },
  { label: "Arabian", to: "/menu", emoji: "🥙", bg: "from-yellow-500/20 to-emerald-500/20" },
  { label: "Desserts", to: "/desserts", emoji: "🍰", bg: "from-pink-500/20 to-purple-500/20" },
];

function Home() {
  const trending = ALL_ITEMS.filter((i) => i.isSellingHot).slice(0, 10);
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/25 via-accent/40 to-background" />
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:grid-cols-2 md:items-center md:py-20">
          <Reveal>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1 text-xs font-black uppercase tracking-wider text-primary">
              <Sparkles className="h-3 w-3" /> Fresh · Fast · Hygienic
            </span>
            <h1 className="mt-4 text-5xl font-black leading-[1.02] tracking-tight md:text-7xl">
              Real food.<br />Really fast.
            </h1>
            <p className="mt-4 max-w-md text-base text-muted-foreground md:text-lg">
              Kabir's Kitchen delivers Indian, Chinese, Arabian & desserts from our spotless cloud kitchen — straight to your door.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/menu" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-black text-primary-foreground shadow-lg transition-transform hover:scale-105">
                Order now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/selling-hot" className="inline-flex items-center gap-2 rounded-full border-2 border-foreground/10 bg-card px-6 py-3 text-sm font-black hover:border-primary">
                <Flame className="h-4 w-4" /> Selling hot
              </Link>
            </div>
          </Reveal>
          <Reveal delay={120} className="relative">
            <img
              src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=900&h=900&fit=crop&auto=format&q=80"
              alt="Signature biryani"
              className="aspect-square w-full rounded-[2.5rem] object-cover shadow-2xl"
            />
            <div className="absolute -bottom-4 -left-4 rounded-2xl bg-card px-4 py-3 shadow-xl">
              <div className="text-xs font-bold text-muted-foreground">Avg delivery</div>
              <div className="text-2xl font-black">28 min</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Category tiles */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <Reveal><h2 className="mb-4 text-2xl font-black">Pick your craving</h2></Reveal>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {categoryTiles.map((c, i) => (
            <Reveal key={c.label} delay={i * 60}>
              <Link to={c.to} className={`group relative block overflow-hidden rounded-3xl border border-border bg-gradient-to-br ${c.bg} p-6 transition-transform hover:scale-[1.02]`}>
                <div className="text-4xl">{c.emoji}</div>
                <div className="mt-3 text-lg font-black">{c.label}</div>
                <div className="text-xs font-semibold text-muted-foreground">Browse →</div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Promo strips */}
      <section className="mx-auto max-w-7xl px-4">
        <div className="grid gap-3 md:grid-cols-2">
          <Reveal>
            <Link to="/deals/50" className="group relative block overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary/70 p-6 text-primary-foreground shadow-lg">
              <div className="text-xs font-black uppercase tracking-wider opacity-80">Everyday steal</div>
              <div className="mt-1 text-4xl font-black">₹50 Only</div>
              <div className="mt-1 text-sm font-semibold opacity-90">Snacks, sweets & sides. Tap in.</div>
              <ArrowRight className="absolute bottom-4 right-4 h-6 w-6 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
          <Reveal delay={100}>
            <Link to="/deals/99" className="group relative block overflow-hidden rounded-3xl bg-gradient-to-r from-foreground to-foreground/70 p-6 text-background shadow-lg">
              <div className="text-xs font-black uppercase tracking-wider opacity-80">Meal deal</div>
              <div className="mt-1 text-4xl font-black">₹99 Only</div>
              <div className="mt-1 text-sm font-semibold opacity-90">Fill-up meals under a hundred.</div>
              <ArrowRight className="absolute bottom-4 right-4 h-6 w-6 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Trending carousel */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <Reveal>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-black">🔥 Trending now</h2>
              <p className="text-sm text-muted-foreground">Real-world best-sellers this week.</p>
            </div>
            <Link to="/selling-hot" className="text-sm font-bold text-primary hover:underline">See all →</Link>
          </div>
        </Reveal>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {trending.map((item, i) => (
            <Reveal key={item.id} delay={i * 40} className="w-64 shrink-0">
              <DishCard item={item} />
            </Reveal>
          ))}
        </div>
      </section>

      <Footer />
      <StickyCartBar />
    </div>
  );
}
