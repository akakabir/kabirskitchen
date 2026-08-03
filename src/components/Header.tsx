import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { MapPin, Search, ShoppingBag, Menu as MenuIcon, X, Settings, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useLocation } from "@/lib/location-context";
import { cn } from "@/lib/utils";
import SpecularButton from "@/components/SpecularButton";

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
  { to: "/selling-hot", label: "Selling Hot" },
];




export function Header({ showSearch, searchValue, onSearchChange }: Props) {
  const { count } = useCart();
  const { selected, openPicker } = useLocation();
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();


  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-4 py-3 xl:gap-6">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-2xl bg-primary text-primary-foreground text-lg font-black">K</div>
          <span className="hidden text-lg font-black tracking-tight sm:inline">Kabir's Kitchen</span>
        </Link>

        <nav className="hidden shrink-0 items-center gap-1.5 lg:flex xl:gap-2">
          {nav.map((n) => (
            <SpecularButton
              key={n.to}
              onClick={() => navigate({ to: n.to })}
              className={cn(
                "whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold transition-colors",
                path.startsWith(n.to) ? "bg-primary text-primary-foreground" : "hover:bg-secondary",
              )}
            >
              {n.label}
            </SpecularButton>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <SpecularButton
            onClick={() => openPicker()}
            className="hidden max-w-[200px] items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs transition-colors hover:border-primary hover:text-primary xl:flex"
          >
            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="shrink-0 font-semibold">Deliver to</span>
            <span className="truncate text-muted-foreground">{selected?.formatted || "Set location"}</span>
          </SpecularButton>

          {showSearch && (
            <div className="relative hidden w-56 md:block xl:w-64">
              <input
                value={searchValue ?? ""}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder="Search dishes…"
                className="h-10 w-full rounded-full border border-border bg-secondary py-2 pl-4 pr-12 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <span className="pointer-events-none absolute inset-y-0 right-1 flex items-center">
                <SpecularButton
                  aria-label="Search"
                  className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground"
                >
                  <Search className="h-4 w-4" />
                </SpecularButton>
              </span>
            </div>
          )}

          <SpecularButton
            onClick={() => navigate({ to: "/settings" })}
            aria-label="Settings"
            className={cn(
              "grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-secondary transition-colors hover:border-primary hover:text-primary",
              path.startsWith("/settings") && "border-primary text-primary",
            )}
          >
            <Settings className="h-4 w-4" />
          </SpecularButton>

          <SpecularButton
            onClick={() => navigate({ to: "/cart" })}
            className="relative flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-sm transition-transform hover:scale-105"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            {count > 0 && (
              <span key={count} className="animate-pop grid h-5 min-w-5 place-items-center rounded-full bg-background px-1 text-[11px] font-black text-foreground">
                {count}
              </span>
            )}
          </SpecularButton>

        </div>
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
        <div className="space-y-3 border-t border-border bg-background px-4 py-3 lg:hidden">
          <SpecularButton
            onClick={() => { setOpen(false); openPicker(); }}
            className="flex w-full items-center gap-2 rounded-2xl bg-secondary px-3 py-2 text-left text-xs"
          >
            <MapPin className="h-4 w-4 text-primary" />
            <span className="font-bold">Deliver to</span>
            <span className="min-w-0 flex-1 truncate text-muted-foreground">{selected?.formatted || "Set location"}</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </SpecularButton>
          <div className="flex flex-wrap gap-2">
            {nav.concat([{ to: "/settings", label: "Settings" }]).map((n) => (
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
