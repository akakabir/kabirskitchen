import { createFileRoute, Link, Outlet, useRouterState, Navigate } from "@tanstack/react-router";
import { Palette, Bell, User, Info, ChevronRight, MapPin, CreditCard, Languages, Shield } from "lucide-react";
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
  { to: "/settings/theme", label: "Theme", icon: Palette },
  { to: "/settings/notifications", label: "Notifications", icon: Bell },
  { to: "/settings/account", label: "Account", icon: User },
  { to: "/settings/addresses", label: "Saved Addresses", icon: MapPin },
  { to: "/settings/payment", label: "Payment Methods", icon: CreditCard },
  { to: "/settings/language", label: "Language", icon: Languages },
  { to: "/settings/privacy", label: "Privacy & Data", icon: Shield },
  { to: "/settings/about", label: "About the App", icon: Info },
] as const;

function SettingsLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (path === "/settings") return <Navigate to="/settings/theme" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-6 md:grid-cols-[240px_1fr]">
        <aside>
          <h1 className="mb-4 text-3xl font-black">Settings</h1>
          <nav className="space-y-1">
            {items.map((it) => {
              const Icon = it.icon;
              const active = path === it.to;
              return (
                <Link key={it.to} to={it.to} className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold transition-colors",
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
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
