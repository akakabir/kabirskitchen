import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Kabir's Kitchen" },
      { name: "description", content: "Terms, privacy and refund policy for orders placed on Kabir's Kitchen." },
      { property: "og:title", content: "Terms & Conditions — Kabir's Kitchen" },
      { property: "og:description", content: "Terms, privacy and refund policy." },
    ],
  }),
  component: Terms,
});

const sections = [
  { h: "1. Payments", p: "All orders are payable online only via UPI, cards, netbanking or supported wallets. We do not accept cash on delivery under any circumstance." },
  { h: "2. Cancellation & refunds", p: "Orders can be cancelled without charge before the kitchen starts preparation. Once cooking begins, cancellations are non-refundable. Genuine quality complaints are refunded fully within 5 business days after review." },
  { h: "3. Delivery", p: "Estimated delivery times are indicative and may vary due to traffic, weather, or unusually high demand. Contact-free delivery is available on request." },
  { h: "4. Allergens", p: "Our kitchen handles wheat, dairy, nuts, eggs, seafood and soy. Cross-contact is possible; contact us in advance for allergy-sensitive orders." },
  { h: "5. Liability", p: "Kabir's Kitchen is liable only to the extent of the order value. We are not liable for consequential losses arising from delays or unavailability of items." },
  { h: "6. Privacy", p: "We collect only what is required to fulfill your order — name, phone, address and payment metadata. We never sell your data." },
  { h: "7. Changes", p: "We may update these terms as the service evolves. Continued use of the app after changes means you accept them." },
];

function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <span className="text-xs font-black uppercase tracking-wider text-primary">Legal</span>
        <h1 className="mt-2 text-5xl font-black">Terms & Conditions</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        <div className="mt-8 space-y-6">
          {sections.map((s) => (
            <section key={s.h}>
              <h2 className="text-lg font-black">{s.h}</h2>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{s.p}</p>
            </section>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
