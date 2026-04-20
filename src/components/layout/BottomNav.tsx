"use client";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Headset, ScanLine, BadgePercent, Menu } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function BottomNav() {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
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
    { icon: Headset, label: "Help", href: "/chat" },
    { icon: ScanLine, label: "Scan", href: "/scan" },
    { icon: BadgePercent, label: "Offer", href: "/offers" },
    { icon: Menu, label: "More", href: "/more" },
  ];

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-40 pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="relative mx-auto flex max-w-md items-end justify-around rounded-[28px] border border-border/60 bg-background/95 px-2 pb-2 pt-3 shadow-[0_10px_30px_rgba(15,23,42,0.12)] backdrop-blur">
        <div className="pointer-events-none absolute -top-0.5 left-1/2 h-10 w-27 -translate-x-1/2 overflow-hidden">
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
          const isHelp = item.label === "Help";
          const isHelpActive = isHelp && isHelpModalOpen;

          if (isHelp) {
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setIsHelpModalOpen(true)}
                className={`relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1.5 py-1 text-[11px] font-medium transition-colors ${
                  isHelpActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="relative">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="truncate">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1.5 py-1 text-[11px] font-medium transition-colors ${
                isScan
                  ? "text-black"
                  : active || isHelpActive
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
                  <div
                    className={`relative ${
                      isOffer ? "flex h-8 w-8 items-center justify-center rounded-full" : ""
                    } ${isOffer && active ? "bg-primary" : ""}`}
                  >
                    <Icon
                      className={
                        isOffer
                          ? `h-6 w-6 ${active ? "text-white" : "text-muted-foreground"}`
                          : `h-6 w-6 ${active ? "fill-current" : ""}`
                      }
                    />
                    {isHome && active && (
                        <span className="absolute bottom-0.75 left-1/2 h-2.25 w-1.5 -translate-x-1/2 rounded-sm bg-background" />
                    )}
                  </div>
                  <span className="truncate">{item.label}</span>
                </>
              )}
            </Link>
          );
        })}
      </div>

      <Dialog open={isHelpModalOpen} onOpenChange={setIsHelpModalOpen}>
        <DialogContent className="max-w-85 rounded-2xl p-5">
          <DialogHeader className="text-left">
            <DialogTitle>Help & Support</DialogTitle>
            <DialogDescription>Choose a channel to contact us quickly.</DialogDescription>
          </DialogHeader>

          <div className="space-y-2 pt-1">
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/40"
            >
              <span>WhatsApp</span>
              <span className="text-xs text-muted-foreground">Open</span>
            </a>

            <Link
              to="/chat"
              onClick={() => setIsHelpModalOpen(false)}
              className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/40"
            >
              <span>Live Chat</span>
              <span className="text-xs text-muted-foreground">Open</span>
            </Link>

            <a
              href="https://m.me/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/40"
            >
              <span>Messenger</span>
              <span className="text-xs text-muted-foreground">Open</span>
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  );
}
