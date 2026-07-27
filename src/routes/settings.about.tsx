import { createFileRoute, Link } from "@tanstack/react-router";
import { SettingsHeader, Card } from "@/components/SettingsBits";

export const Route = createFileRoute("/settings/about")({
  head: () => ({ meta: [{ title: "About the App — Settings" }, { name: "description", content: "Version, credits and support." }] }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div>
      <SettingsHeader title="About the App" desc="Made with fresh ingredients & love." />
      <Card>
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-2xl font-black text-primary-foreground">K</div>
          <div>
            <p className="text-lg font-black">Kabir's Kitchen</p>
            <p className="text-xs text-muted-foreground">Version 1.0 · Cloud kitchen · Mumbai</p>
          </div>
        </div>
        <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
          <Row k="Support" v={<a className="text-primary hover:underline" href="mailto:help@kabirskitchen.in">help@kabirskitchen.in</a>} />
          <Row k="Phone" v={<a className="text-primary hover:underline" href="tel:+911800000000">1800-000-000</a>} />
          <Row k="Terms" v={<Link className="text-primary hover:underline" to="/terms">Read terms</Link>} />
          <Row k="Hygiene" v={<Link className="text-primary hover:underline" to="/hygiene">How orders are made</Link>} />
        </dl>
        <p className="mt-6 text-xs text-muted-foreground">© {new Date().getFullYear()} Kabir's Kitchen. All rights reserved.</p>
      </Card>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-secondary/50 px-3 py-2">
      <dt className="text-xs font-black uppercase tracking-wider text-muted-foreground">{k}</dt>
      <dd className="text-sm font-bold">{v}</dd>
    </div>
  );
}
