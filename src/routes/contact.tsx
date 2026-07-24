import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Instagram } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Kabir's Kitchen" },
      { name: "description", content: "Reach Kabir's Kitchen for orders, feedback and catering." },
      { property: "og:title", content: "Contact — Kabir's Kitchen" },
      { property: "og:description", content: "Get in touch with the kitchen." },
    ],
  }),
  component: Contact,
});

const items = [
  { icon: Phone, label: "Call us", value: "+91 98200 12345" },
  { icon: Mail, label: "Email", value: "hello@kabirskitchen.in" },
  { icon: MapPin, label: "Cloud kitchen", value: "Bandra West, Mumbai" },
  { icon: Instagram, label: "Instagram", value: "@kabirskitchen" },
];

function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <span className="text-xs font-black uppercase tracking-wider text-primary">Say hi</span>
        <h1 className="mt-2 text-5xl font-black">Contact us</h1>
        <p className="mt-3 text-muted-foreground">For orders, feedback, or bulk catering — we're one tap away.</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {items.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary"><Icon className="h-5 w-5" /></div>
              <div>
                <div className="text-xs font-bold uppercase text-muted-foreground">{label}</div>
                <div className="font-bold">{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
