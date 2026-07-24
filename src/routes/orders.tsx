import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Order Tracking — Under Construction · Kabir's Kitchen" },
      { name: "description", content: "Live order tracking is on its way. We're still cooking up this feature." },
      { property: "og:title", content: "Order Tracking — Under Construction" },
      { property: "og:description", content: "Live order tracking coming soon." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Orders,
});

function Orders() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="mx-auto max-w-3xl px-4 py-12 text-center">
        <div className="relative mx-auto h-72 w-full max-w-xl overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-accent/40 to-background">
          {/* sun */}
          <div className="absolute right-8 top-6 h-16 w-16 rounded-full bg-primary/70 blur-[2px]" />
          {/* crane arm */}
          <svg className="absolute left-8 top-0 h-40 w-40" viewBox="0 0 200 200">
            <line x1="100" y1="10" x2="100" y2="120" stroke="currentColor" strokeWidth="6" className="text-foreground/80" />
            <g className="animate-swing origin-top" style={{ transformOrigin: "100px 20px" }}>
              <line x1="100" y1="20" x2="180" y2="20" stroke="currentColor" strokeWidth="4" className="text-foreground/80" />
              <line x1="180" y1="20" x2="180" y2="70" stroke="currentColor" strokeWidth="2" className="text-foreground/60" />
              <rect x="170" y="70" width="20" height="16" fill="currentColor" className="text-primary" rx="2" />
            </g>
          </svg>
          {/* hazard light */}
          <div className="animate-blink absolute right-16 top-14 h-4 w-4 rounded-full bg-primary shadow-[0_0_20px] shadow-primary" />
          {/* ground */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-foreground/10">
            <div className="absolute inset-x-0 top-0 h-1 bg-primary/50" />
            {/* caution tape stripes */}
            <div className="absolute inset-x-0 top-1 h-2 [background:repeating-linear-gradient(45deg,var(--color-primary),var(--color-primary)_10px,transparent_10px,transparent_20px)]" />
          </div>
          {/* truck */}
          <div className="absolute bottom-4 left-0 animate-drive">
            <svg width="90" height="46" viewBox="0 0 90 46">
              <rect x="0" y="10" width="55" height="24" rx="3" fill="currentColor" className="text-primary" />
              <rect x="55" y="16" width="25" height="18" rx="2" fill="currentColor" className="text-primary/70" />
              <rect x="58" y="19" width="12" height="8" fill="currentColor" className="text-background/70" />
              <circle cx="15" cy="38" r="6" fill="currentColor" className="text-foreground" />
              <circle cx="65" cy="38" r="6" fill="currentColor" className="text-foreground" />
              <circle cx="15" cy="38" r="2" fill="currentColor" className="text-background" />
              <circle cx="65" cy="38" r="2" fill="currentColor" className="text-background" />
            </svg>
          </div>
          {/* cone */}
          <div className="absolute bottom-14 right-14">
            <svg width="30" height="34"><polygon points="15,2 28,32 2,32" fill="currentColor" className="text-primary" /><rect x="6" y="18" width="18" height="3" fill="currentColor" className="text-background" /></svg>
          </div>
        </div>

        <h1 className="mt-8 text-4xl font-black">Order Tracking Is Under Construction 🚧</h1>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
          We're still cooking up this feature — your cart is safe, come back soon! In the meantime, keep browsing.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/menu" className="rounded-full bg-primary px-6 py-3 font-black text-primary-foreground shadow hover:opacity-95">Back to Menu</Link>
          <Link to="/" className="rounded-full border border-border bg-card px-6 py-3 font-black hover:bg-secondary">Go home</Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
