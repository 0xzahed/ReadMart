"use client";

import { Link, useLocation } from "react-router-dom";
import { Home, MessageSquare, ScanLine, Tag, MoreHorizontal } from "lucide-react";

export function BottomNav() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: MessageSquare, label: "Chat", href: "/chat" },
    { icon: ScanLine, label: "Scan", href: "/scan" },
    { icon: Tag, label: "Offer", href: "/offers" },
    { icon: MoreHorizontal, label: "More", href: "/more" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40 md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 min-w-0 flex-1 transition-colors ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-0.5 truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
