"use client";

import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { BottomNav } from "@/components/layout/BottomNav";
// import BottomNav from "@/components/layout/BottomNav";

interface StoreLayoutProps {
  children: ReactNode;
}

export function StoreLayout({ children }: StoreLayoutProps) {
  const location = useLocation();

  useEffect(() => {
    // Keep route transitions predictable: every new page starts from the top.
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname, location.search]);

  return (
    <div className="min-h-screen overflow-x-clip bg-background pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0">
      {children}
      <BottomNav />
    </div>
  );
}
