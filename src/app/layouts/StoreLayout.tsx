"use client";

import { ReactNode } from "react";

interface StoreLayoutProps {
  children: ReactNode;
}

export function StoreLayout({ children }: StoreLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
