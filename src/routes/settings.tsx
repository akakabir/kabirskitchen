import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Palette, Bell, User, Info, ChevronRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Kabir's Kitchen" },
      { name: "description", content: "Manage your theme, notifications, account and app info." },
      { property: "og:title", content: "Settings — Kabir's Kitchen" },
      { property: "og:description", content: "Manage preferences." },
    ],
  }),
  component: SettingsLayout,
});

const items = [
  { to: "/settings/theme", label: "Theme", desc: "Pick from 6 poppy themes.", icon: Palette },
  { to: "/settings", label: "Notifications", desc: "Order updates & promos.", icon: Bell, section: "notif" },
  { to: "/settings", label: "Account", desc: "Profile & saved addresses.", icon: User, section: "account" },
  { to: "/settings", label: "About the App", desc: "Version, credits, support.", icon: Info, section: "about" },
];

function SettingsLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isRoot = path === "/settings";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-6 md:grid-cols-[240px_1fr]">
        <aside>
          <h1 className="mb-4 text-3xl font-black">Settings</h1>
          <nav className="space-y-1">
            {items.map((it) => {
              const Icon = it.icon;
              const active = it.to === "/settings/theme" ? path === "/settings/theme" : false;
              return (
                <Link key={it.label} to={it.to} className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold",
                  active ? "bg-primary text-primary-foreground" : "hover:bg-secondary",
                )}>
                  <Icon className="h-4 w-4" />
                  <span className="flex-1">{it.label}</span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>
              );
            })}
          </nav>
        </aside>

        <main>
          {isRoot ? <SettingsHome /> : <Outlet />}
        </main>
      </div>
      <Footer />
    </div>
  );
}

function Toggle({ label, defaultOn = false }: { label: string; defaultOn?: boolean }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-border bg-card p-4">
      <span className="text-sm font-bold">{label}</span>
      <input type="checkbox" defaultChecked={defaultOn} className="peer sr-only" />
      <span className="relative h-6 w-11 rounded-full bg-secondary transition-colors peer-checked:bg-primary">
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-background shadow transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

function SettingsHome() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-3 text-lg font-black">Notifications</h2>
        <div className="space-y-2">
          <Toggle label="Order status updates" defaultOn />
          <Toggle label="New menu & offers" defaultOn />
          <Toggle label="Weekly digest email" />
        </div>
      </section>
      <section>
        <h2 className="mb-3 text-lg font-black">Account</h2>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-black uppercase tracking-wider text-muted-foreground">Name</label>
              <input defaultValue="Kabir" className="w-full rounded-full border border-border bg-secondary px-4 py-2 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-black uppercase tracking-wider text-muted-foreground">Email</label>
              <input defaultValue="hello@kabirskitchen.in" className="w-full rounded-full border border-border bg-secondary px-4 py-2 text-sm outline-none focus:border-primary" />
            </div>
          </div>
        </div>
      </section>
      <section>
        <h2 className="mb-3 text-lg font-black">About</h2>
        <p className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
          Kabir's Kitchen v1.0 — a poppy cloud-kitchen experience. Made with fresh ingredients & love.
        </p>
      </section>
    </div>
  );
}
