"use client";

import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Image from "next/image";
import { Search, Bell, ShoppingCart } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface MobileHeaderProps {
  onSearch?: (query: string) => void;
}
export function MobileHeader({ onSearch }: MobileHeaderProps) {
  const navigate = useNavigate();
  const {
    cart,
    products,
    unreadNotificationCount,
  } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const cartItems = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      return { ...item, product };
    })
    .filter(Boolean) as Array<{
    productId: string;
    quantity: number;
    selectedColor?: string;
    product: (typeof products)[0];
  }>;

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  useEffect(() => {
    if (searchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchExpanded]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/90">
      {/* Mobile Header */}
      <div className="p-3 lg:hidden">
        {searchExpanded ? (
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => {
                  if (!searchQuery.trim()) {
                    setSearchExpanded(false);
                  }
                }}
                className="h-10 w-full rounded-full border border-border bg-secondary pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchExpanded(false);
                if (!searchQuery.trim()) {
                  setSearchQuery("");
                }
              }}
              className="shrink-0 rounded-full border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Cancel
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <Link to="/" className="shrink-0 text-lg font-bold text-primary">
              ReadMart
            </Link>

            <div className="flex min-w-0 items-center justify-end gap-2">
              <button
                onClick={() => setSearchExpanded(true)}
                className="relative rounded-full bg-secondary p-2.5 transition-colors hover:bg-secondary/80"
                aria-label="Search"
              >
                <Search className="h-5 w-5 text-foreground" />
              </button>

              <div className="relative">
                <button
                  onClick={() => navigate("/notifications")}
                  className="relative rounded-full bg-secondary p-2.5 transition-colors hover:bg-secondary/80"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5 text-foreground" />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                      {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                    </span>
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowCartDrawer(true)}
                className="relative rounded-full bg-secondary p-2.5 transition-colors hover:bg-secondary/80"
                aria-label="Open cart"
              >
                <ShoppingCart className="h-5 w-5 text-foreground" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                    {cart.length > 9 ? "9+" : cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mx-auto hidden w-full max-w-[1400px] items-center gap-6 px-6 py-4 lg:flex">
        <Link to="/" className="text-2xl font-black tracking-tight text-primary">
          ReadMart
        </Link>

        <nav className="flex items-center gap-5 text-sm font-medium text-muted-foreground">
          <Link to="/" className="transition-colors hover:text-foreground">Home</Link>
          <Link to="/explore" className="transition-colors hover:text-foreground">Explore</Link>
          <Link to="/offers" className="transition-colors hover:text-foreground">Offers</Link>
          <Link to="/orders" className="transition-colors hover:text-foreground">Orders</Link>
        </nav>

        <form onSubmit={handleSearch} className="relative ml-auto w-full max-w-xl">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 w-full rounded-full border border-border bg-secondary pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </form>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => navigate("/notifications")}
              className="relative rounded-full bg-secondary p-2.5 transition-colors hover:bg-secondary/80"
            >
              <Bell className="h-5 w-5 text-foreground" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                  {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                </span>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowCartDrawer(true)}
            className="relative rounded-full bg-secondary p-2.5 transition-colors hover:bg-secondary/80"
          >
            <ShoppingCart className="h-5 w-5 text-foreground" />
            {cart.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                {cart.length > 9 ? "9+" : cart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <Drawer open={showCartDrawer} onOpenChange={setShowCartDrawer}>
        <DrawerContent className="flex h-[50vh] max-h-[50vh] flex-col">
          <DrawerHeader>
            <DrawerTitle>Cart ({cartItems.length})</DrawerTitle>
            <DrawerDescription>Quick view of your cart items.</DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-4 pb-2">
            {cartItems.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">Your cart is empty</p>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3 rounded-lg border border-border/70 bg-card px-3 py-2">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-secondary">
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-1">{item.product.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Qty: {item.quantity} • ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DrawerFooter>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-semibold text-foreground">${cartTotal.toFixed(2)}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowCartDrawer(false);
                navigate("/cart");
              }}
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              View Cart
            </button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </header>
  );
}
