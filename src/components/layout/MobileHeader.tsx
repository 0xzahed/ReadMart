"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Bell, ShoppingCart, Image as ImageIcon } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";

interface MobileHeaderProps {
  onSearch?: (query: string) => void;
}

export function MobileHeader({ onSearch }: MobileHeaderProps) {
  const { cart, unreadNotificationCount } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

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
              className="w-full pl-10 pr-10 py-2.5 rounded-full bg-secondary text-foreground placeholder:text-muted-foreground border-0 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
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
              <div className="p-3 border-b border-border">
                <h3 className="font-semibold text-foreground">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {/* Placeholder notifications */}
                <div className="p-3 hover:bg-secondary/50 cursor-pointer">
                  <p className="text-sm font-medium text-foreground">Welcome to ReadMart!</p>
                  <p className="text-xs text-muted-foreground">Start shopping amazing deals</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cart Icon */}
        <Link
          to="/cart"
          className="relative p-2.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
        >
          <ShoppingCart className="w-5 h-5 text-foreground" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold">
              {cart.length > 9 ? "9+" : cart.length}
            </span>
          )}
        </Link>
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
                <div className="border-b border-border p-3">
                  <h3 className="font-semibold text-foreground">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  <div className="cursor-pointer p-3 hover:bg-secondary/50">
                    <p className="text-sm font-medium text-foreground">Welcome to ReadMart!</p>
                    <p className="text-xs text-muted-foreground">Start shopping amazing deals</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link
            to="/cart"
            className="relative rounded-full bg-secondary p-2.5 transition-colors hover:bg-secondary/80"
          >
            <ShoppingCart className="h-5 w-5 text-foreground" />
            {cart.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                {cart.length > 9 ? "9+" : cart.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
