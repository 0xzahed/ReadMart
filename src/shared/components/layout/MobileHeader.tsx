import { Bell, Search, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

import { useCart } from "@/contexts/CartContext";

const MobileHeader = () => {
  const { cartCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background px-4 py-3 lg:hidden">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-lg font-bold text-primary">ReadMart</Link>
        <div className="flex items-center gap-3">
          <Link to="/explore">
            <Search className="h-5 w-5 text-foreground" />
          </Link>
          <Bell className="h-5 w-5 text-foreground" />
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-5 w-5 text-foreground" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
