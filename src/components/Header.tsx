import { Link, useRouterState } from "@tanstack/react-router";
import { MapPin, Search, ShoppingBag, Menu as MenuIcon, X, Settings, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useLocation } from "@/lib/location-context";
import { cn } from "@/lib/utils";

interface Props {
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (v: string) => void;
}

const nav = [
  { to: "/menu", label: "Menu" },
  { to: "/desserts", label: "Desserts" },
  { to: "/deals/50", label: "₹50 Only" },
  { to: "/deals/99", label: "₹99 Only" },
  { to: "/selling-hot", label: "🔥 Selling Hot" },
  { to: "/hygiene", label: "Hygiene" },
  { to: "/help", label: "Help" },
];

export function Header({ showSearch, searchValue, onSearchChange }: Props) {
  const { count } = useCart();
  const { selected, openPicker } = useLocation();
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-2xl bg-primary text-primary-foreground text-lg font-black">K</div>
          <span className="hidden text-lg font-black tracking-tight sm:inline">Kabir's Kitchen</span>
        </Link>

        <button
          onClick={() => openPicker()}
          className="hidden max-w-[220px] items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs transition-colors hover:border-primary hover:text-primary md:flex"
        >
          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span className="font-semibold shrink-0">Deliver to</span>
          <span className="truncate text-muted-foreground">{selected?.formatted || "Set location"}</span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        </button>

        {showSearch && (
          <div className="relative hidden max-w-md flex-1 md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchValue ?? ""}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search for biryani, pizza, kunafa…"
              className="w-full rounded-full border border-border bg-secondary py-2 pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        )}

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-semibold transition-colors",
                path.startsWith(n.to) ? "bg-primary text-primary-foreground" : "hover:bg-secondary",
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <Link
          to="/settings"
          aria-label="Settings"
          className={cn(
            "ml-auto grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-secondary transition-colors hover:border-primary hover:text-primary lg:ml-0",
            path.startsWith("/settings") && "border-primary text-primary",
          )}
        >
          <Settings className="h-4 w-4" />
        </Link>

        <Link
          to="/cart"
          className="relative flex shrink-0 items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-sm transition-transform hover:scale-105"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Cart</span>
          {count > 0 && (
            <span key={count} className="animate-pop grid h-5 min-w-5 place-items-center rounded-full bg-background px-1 text-[11px] font-black text-foreground">
              {count}
            </span>
          )}
        </Link>


        <button className="lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>

      {showSearch && (
        <div className="mx-auto w-full max-w-7xl px-4 pb-3 md:hidden">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchValue ?? ""}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search dishes…"
              className="w-full rounded-full border border-border bg-secondary py-2 pl-9 pr-4 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>
      )}

      {open && (
        <div className="border-t border-border bg-background px-4 py-3 lg:hidden">
          <div className="flex flex-wrap gap-2">
            {nav.concat([{ to: "/about", label: "About" }, { to: "/contact", label: "Contact" }, { to: "/settings", label: "Settings" }]).map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-full bg-secondary px-3 py-1.5 text-sm font-semibold">
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
