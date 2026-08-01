import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChefHat, LifeBuoy, Mail, ScrollText } from "lucide-react";


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

        <h2 className="mt-12 text-2xl font-black">More about us</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { to: "/hygiene", icon: ChefHat, title: "How Our Orders Are Made", desc: "Our kitchen, hygiene and packing standards." },
            { to: "/help", icon: LifeBuoy, title: "Help & FAQ", desc: "Payments, customization, delivery area, allergens." },
            { to: "/contact", icon: Mail, title: "Contact", desc: "Reach the team for anything else." },
            { to: "/terms", icon: ScrollText, title: "Terms & Conditions", desc: "The fine print, in plain language." },
          ].map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="group flex items-start gap-3 rounded-3xl border border-border bg-card p-5 transition-transform hover:-translate-y-0.5 hover:border-primary"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary">
                <c.icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-base font-black group-hover:text-primary">{c.title}</span>
                <span className="block text-sm text-muted-foreground">{c.desc}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
