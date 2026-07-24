import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-secondary">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-primary text-primary-foreground text-lg font-black">K</div>
            <span className="text-lg font-black">Kabir's Kitchen</span>
          </div>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            A cloud kitchen delivering Indian, Chinese, Arabian & desserts — fresh, safe, hot.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/menu" className="hover:text-primary">Menu</Link></li>
            <li><Link to="/desserts" className="hover:text-primary">Desserts</Link></li>
            <li><Link to="/selling-hot" className="hover:text-primary">Selling Hot</Link></li>
            <li><Link to="/deals/50" className="hover:text-primary">₹50 Only</Link></li>
            <li><Link to="/deals/99" className="hover:text-primary">₹99 Only</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">Company</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            <li><Link to="/help" className="hover:text-primary">Help & FAQ</Link></li>
            <li><Link to="/hygiene" className="hover:text-primary">How Orders Are Made</Link></li>
            <li><Link to="/terms" className="hover:text-primary">Terms & Conditions</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">Account</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/settings" className="hover:text-primary">Settings</Link></li>
            <li><Link to="/settings/theme" className="hover:text-primary">Theme</Link></li>
            <li><Link to="/cart" className="hover:text-primary">Cart</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Kabir's Kitchen · Online payments only · Made with ❤️
      </div>
    </footer>
  );
}
