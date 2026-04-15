import { Home, Search, ShoppingCart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Search, label: "Explore", path: "/explore" },
  { icon: ShoppingCart, label: "Cart", path: "/cart" },
];

const BottomNav = () => {
  const location = useLocation();
  const { cartCount } = useCart();

  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-50 lg:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around rounded-[30px] border border-border/70 bg-background px-2 py-2 shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
        {navItems.map((item) => {
          const active =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex min-w-[74px] flex-col items-center gap-1 rounded-2xl px-2 py-1.5 text-xs font-medium transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div
                className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                  active ? "bg-primary/15" : "bg-transparent"
                }`}
              >
                <item.icon className="h-6 w-6" />
                {item.label === "Cart" && cartCount > 0 && (
                  <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {cartCount}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
