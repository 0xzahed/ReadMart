"use client";

import { Link, useLocation } from "react-router-dom";
import { Home, MessageSquare, ScanLine, BadgePercent, Menu } from "lucide-react";

export function BottomNav() {
  const location = useLocation();
  if (location.pathname.startsWith("/product/")) {
    return null;
  }

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: MessageSquare, label: "Help", href: "/chat" },
    { icon: ScanLine, label: "Scan", href: "/scan" },
    { icon: BadgePercent, label: "Offer", href: "/offers" },
    { icon: Menu, label: "More", href: "/more" },
  ];

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-40 md:hidden">
      <div className="relative mx-auto flex max-w-md items-end justify-around rounded-[28px] border border-border/60 bg-background/95 px-2 pb-2 pt-3 shadow-[0_10px_30px_rgba(15,23,42,0.12)] backdrop-blur">
        <div className="pointer-events-none absolute -top-0.5 left-1/2 h-10 w-[108px] -translate-x-1/2 overflow-hidden">
          <div className="h-14 w-full -translate-y-8 rounded-full bg-background" />
        </div>
        <div className="pointer-events-none absolute top-1 left-[calc(50%-58px)] h-4 w-4 rounded-full bg-background" />
        <div className="pointer-events-none absolute top-1 left-[calc(50%+42px)] h-4 w-4 rounded-full bg-background" />
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          const isScan = item.label === "Scan";
          const isHome = item.label === "Home";
          const isOffer = item.label === "Offer";
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`relative flex min-w-[74px] flex-1 flex-col items-center justify-center gap-1 px-2 py-1 text-xs font-medium transition-colors ${
                isScan
                  ? "text-black"
                  : active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isScan ? (
                <>
                  <div className="-mt-10 mb-1 flex h-14 w-14 items-center justify-center rounded-full border-[5px] border-background bg-[#2f78d4] text-white shadow-[0_10px_20px_rgba(0,0,0,0.22)]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="truncate text-muted-foreground">{item.label}</span>
                </>
              ) : (
                <>
                  <div className={`relative ${isOffer && active ? "rounded-full bg-primary p-1" : ""}`}>
                    <Icon className={isOffer && active ? "h-6 w-6 text-white" : `h-6 w-6 ${active ? "fill-current" : ""}`} />
                    {isHome && active && (
                      <span className="absolute bottom-[3px] left-1/2 h-[9px] w-[6px] -translate-x-1/2 rounded-sm bg-background" />
                    )}
                  </div>
                  <span className="truncate">{item.label}</span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
