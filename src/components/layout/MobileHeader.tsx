"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);

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

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/90">
      <div className="flex items-center gap-2 p-3 lg:hidden">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-secondary text-foreground placeholder:text-muted-foreground border-0 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </form>

        {/* Notification Icon */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <Bell className="w-5 h-5 text-foreground" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold">
                {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-card rounded-lg shadow-lg border border-border overflow-hidden z-50">
              <div className="flex items-center justify-between p-3 border-b border-border">
                <h3 className="font-semibold text-foreground">Notifications</h3>
                {unreadNotificationCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-xs font-medium text-primary hover:text-primary/80"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-3 text-sm text-muted-foreground">No notifications yet</div>
                ) : (
                  notifications.slice(0, 8).map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => markNotificationAsRead(notification.id)}
                      className="w-full p-3 hover:bg-secondary/50 text-left"
                    >
                      <p className="text-sm font-medium text-foreground">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.message}</p>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Cart Icon */}
        <button
          type="button"
          onClick={() => setShowCartDrawer(true)}
          className="relative p-2.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
        >
          <ShoppingCart className="w-5 h-5 text-foreground" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold">
              {cart.length > 9 ? "9+" : cart.length}
            </span>
          )}
        </button>
      </div>

      <div className="mx-auto hidden w-full max-w-330 items-center gap-6 px-6 py-4 lg:flex">
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
            className="h-11 w-full rounded-full border-0 bg-secondary pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </form>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative rounded-full bg-secondary p-2.5 transition-colors hover:bg-secondary/80"
            >
              <Bell className="h-5 w-5 text-foreground" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                  {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                <div className="flex items-center justify-between border-b border-border p-3">
                  <h3 className="font-semibold text-foreground">Notifications</h3>
                  {unreadNotificationCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-xs font-medium text-primary hover:text-primary/80"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-3 text-sm text-muted-foreground">No notifications yet</div>
                  ) : (
                    notifications.slice(0, 8).map((notification) => (
                      <button
                        key={notification.id}
                        onClick={() => markNotificationAsRead(notification.id)}
                        className="w-full cursor-pointer p-3 hover:bg-secondary/50 text-left"
                      >
                        <p className="text-sm font-medium text-foreground">{notification.title}</p>
                        <p className="text-xs text-muted-foreground">{notification.message}</p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
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
        <DrawerContent className="max-h-[82vh]">
          <DrawerHeader>
            <DrawerTitle>Cart ({cartItems.length})</DrawerTitle>
            <DrawerDescription>Quick view of your cart items.</DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-2 overflow-y-auto">
            {cartItems.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">Your cart is empty</p>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.productId} className="rounded-lg border border-border/70 bg-card px-3 py-2">
                    <p className="text-sm font-medium text-foreground line-clamp-1">{item.product.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Qty: {item.quantity} • ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
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
