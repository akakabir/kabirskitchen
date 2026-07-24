import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export function StickyCartBar() {
  const { count, subtotal } = useCart();
  if (count === 0) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-30 flex justify-center px-4">
      <Link
        to="/cart"
        className="pointer-events-auto flex w-full max-w-md items-center justify-between gap-3 rounded-full bg-primary px-5 py-3 text-primary-foreground shadow-2xl transition-transform hover:scale-[1.02]"
      >
        <div className="flex items-center gap-2 text-sm font-bold">
          <ShoppingBag className="h-4 w-4" />
          {count} item{count > 1 ? "s" : ""} · ₹{subtotal}
        </div>
        <div className="text-sm font-black">View Cart →</div>
      </Link>
    </div>
  );
}
