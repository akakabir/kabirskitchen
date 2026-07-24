import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Kabir's Kitchen" },
      { name: "description", content: "The story behind Kabir's Kitchen — a delivery-only cloud kitchen." },
      { property: "og:title", content: "About — Kabir's Kitchen" },
      { property: "og:description", content: "The story behind Kabir's Kitchen." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <span className="text-xs font-black uppercase tracking-wider text-primary">Our story</span>
        <h1 className="mt-2 text-5xl font-black">Cooked with heart. Delivered with speed.</h1>
        <div className="prose prose-neutral mt-6 max-w-none text-base leading-relaxed text-muted-foreground">
          <p>Kabir's Kitchen started as a home dabba service in 2022. Today, we run a modern cloud kitchen serving Indian, Chinese and Arabian classics — plus a proper cake & desserts wing.</p>
          <p>We're delivery-only by design. Fewer distractions, sharper focus on cooking. Every dish leaves the kitchen sealed, hot, and made-to-order — never re-heated.</p>
          <p>Our small team includes a head chef, a pastry lead, four line cooks, and a delivery ops crew that obsesses over hitting our 30-minute promise.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
