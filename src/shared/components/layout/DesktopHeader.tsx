import { FormEvent, useState } from "react";
import { ShoppingCart, Heart, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useCart } from "@/contexts/CartContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const DesktopHeader = () => {
  const { cartCount, wishlist } = useCart();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (query.trim()) {
      navigate(`/explore?q=${encodeURIComponent(query.trim())}`);
      return;
    }

    navigate("/explore");
  };

  return (
    <header className="sticky top-0 z-50 hidden border-b border-border bg-background lg:block">
      <div className="container flex h-16 items-center justify-between gap-8">
        <Link to="/" className="text-xl font-bold text-primary">
          ReadMart
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="text-foreground hover:text-primary transition-colors">Home</Link>
          <Link to="/explore" className="text-muted-foreground hover:text-primary transition-colors">Explore</Link>
          <Link to="/explore?category=shoes" className="text-muted-foreground hover:text-primary transition-colors">Shoes</Link>
          <Link to="/explore?category=clothing" className="text-muted-foreground hover:text-primary transition-colors">Clothing</Link>
          <Link to="/explore?category=electronics" className="text-muted-foreground hover:text-primary transition-colors">Electronics</Link>
        </nav>

        <form className="relative flex-1 max-w-md" onSubmit={onSearch}>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="border-0 bg-secondary pl-10"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </form>

        <div className="flex items-center gap-2">
          <Link to="/wishlist">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {wishlist.length}
                </span>
              )}
            </Button>
          </Link>
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default DesktopHeader;
