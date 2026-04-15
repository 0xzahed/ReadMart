"use client";

import { ReactNode } from "react";
import { BottomNav } from "@/components/layout/BottomNav";

interface StoreLayoutProps {
  children: ReactNode;
}

export function StoreLayout({ children }: StoreLayoutProps) {
  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      {children}
      <BottomNav />
    </div>
  );
}
